import path from "path";
import fs from "fs";
import { logger } from "../logger.js";

import express from "express";
import {
  AgentSession,
  type AgentSessionEvent,
} from "@mariozechner/pi-coding-agent";
import { ImageContent } from "@mariozechner/pi-ai";
import { createSessionByRole } from "../agents/index.js";
import { BotDeps, BotRole, BotChannel } from "../types.js";
import {
  CHANNEL_ROLES,
  DATA_DIR,
  TTS_BASE_URL,
  createBotID,
  toUserFolder,
} from "../config.js";
import { formatMessages } from "./utils.js";

export class TalkieBot implements BotDeps {
  role: BotRole = "talker";
  channel: BotChannel = "talkie";
  userId = "";
  folder = "";
  sessionId = "";
  session!: AgentSession;
  private unsubscribe: (() => void) | null = null;
  private msgBuffer: string = "";

  private constructor(userId: string, role: BotRole, sessionId?: string) {
    this.userId = userId;
    this.role = role;
    this.folder = toUserFolder(userId, "talkie");
    fs.mkdirSync(this.folder, { recursive: true });

    if (sessionId) {
      this.sessionId = sessionId;
    }
  }

  static async create (
    userId: string,
    role: BotRole,
    sessionId?: string,
  ): Promise<TalkieBot> {
    const validRoles = CHANNEL_ROLES["talkie"];
    if (!validRoles.includes(role)) {
      throw new Error(
        `Invalid role "${role}" for talkie channel, allowed: ${validRoles.join(", ")}`,
      );
    }

    const bot = new TalkieBot(userId, role, sessionId);

    const { session } = await createSessionByRole[role](bot.sessionId, bot);
    bot.session = session;
    if (bot.sessionId !== session.sessionId) {
      bot.sessionId = session.sessionId;
    }
    return bot;
  }

  getBotId(): string {
    return createBotID(this.userId, this.role);
  }
  getFolder(): string {
    return this.folder;
  }

  async runQuery(
    text: string,
    res: express.Response,
    imgContent?: ImageContent,
  ): Promise<void> {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    if (this.session.isStreaming) {
      res.write("上一条消息还未结束，请稍等...");
    } else {
      res.write("收到！");
    }
    res.end();

    this.msgBuffer = "";
    try {
      const formatted = formatMessages(text, "txt");
      if (!imgContent) {
        await this.session.prompt(formatted);
      } else {
        await this.session.prompt(formatted, { images: [imgContent] });
      }
    } finally {
      this.sendMessage(this.msgBuffer);
      this.msgBuffer = "";
    }
  }

  private handleEvent(event: AgentSessionEvent): void {
    switch (event.type) {
      case "message_update": {
        const assistantEvent = event.assistantMessageEvent;
        if (assistantEvent.type === "text_delta") {
          this.msgBuffer += assistantEvent.delta;
        }
        break;
      }
    }
  }

  async start(): Promise<void> {
    logger.info(`Starting talkie bot: ${this.userId}`);
    this.unsubscribe = this.session.subscribe((event) =>
      this.handleEvent(event as AgentSessionEvent),
    );
  }

  async stop(): Promise<void> {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  async sendMessage(text: string): Promise<void> {
    logger.info(`TalkieBot ${this.userId} sending message: ${text}`);
    if (!text.trim()) return;
    try {
      const res = await fetch(`${TTS_BASE_URL}/tts/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        logger.error(`TTS request failed: HTTP ${res.status}`);
      }
    } catch (err) {
      logger.error(`TTS request error: ${err}`);
    }
  }

  async sendFile(filePath: string): Promise<void> {}
}
