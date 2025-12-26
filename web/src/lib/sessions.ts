import { get } from 'svelte/store';
import { sessionsStore, settingsStore, sortStore } from '$lib/localStorage';

import type { Role } from './devices';
import { formatTimestampToNow } from './utils';

export interface Message {
	role: 'user' | 'assistant';
	content: string;
	payload: string;
}

export interface Session {
	id: string;
	messages: Message[];
	role?: Role;	
	updatedAt?: string;
	title?: string;
}

export interface Editor {
	prompt: string;
	messageIndexToEdit: number | null;
	isCodeEditor: boolean;
	isCompletionInProgress: boolean;
	isNewSession: boolean;
	shouldFocusTextarea: boolean;
	attachments?: { type: 'image'; id: string; name: string; dataUrl: string }[];
	completion?: string;
	promptTextarea?: HTMLTextAreaElement;
	abortController?: AbortController;
}

export const loadSession = (id: string): Session => {
	let session: Session | null = null;

	// Retrieve the current sessions
	const currentSessions = get(sessionsStore);

	// Find the session with the given id
	if (currentSessions) {
		const existingSession = currentSessions.find((s) => s.id === id);
		if (existingSession) {
			session = existingSession
		}
	}

	if (!session) {
		// Create a new session
		session = {
			id,
			updatedAt: new Date().toISOString(),
			messages: [],
		};
	}

	return session;
};

export const saveSession = (session: Session): void => {
	// Retrieve the current sessions
	const currentSessions = get(sessionsStore) || [];

	// Find the index of the session with the same id, if it exists
	const existingIndex = currentSessions.findIndex((k) => k.id === session.id);

	if (existingIndex !== -1) {
		// Update the existing session
		currentSessions[existingIndex] = session;
	} else {
		// Add the new session if it doesn't exist
		currentSessions.push(session);
	}

	// Sort the sessions by updatedAt in descending order (most recent first)
	const sortedSessions = sortStore(currentSessions);

	// Update the store with the sorted sessions
	sessionsStore.set(sortedSessions);
};

export function formatSessionMetadata(session: Session) {
	const subtitles: string[] = [];
	if (session.updatedAt) subtitles.push(formatTimestampToNow(session.updatedAt));
	if (session.role) subtitles.push(session.role.name);
	return subtitles.join(' • ');
}

export function getSessionTitle(session: Session) {
	if (session.title) return session.title;

	const firstUserMessage = session.messages.find(
		(m) => m.role === 'user' && m.content
	);

	if (firstUserMessage?.content) {
		const MAX_TITLE_LENGTH = 56;
		return firstUserMessage.content.slice(0, MAX_TITLE_LENGTH);
	}

	return '';
}
