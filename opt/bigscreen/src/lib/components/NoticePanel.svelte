<script lang="ts">
  import { notices, type Notice } from "$lib/data/mock";

  function typeLabel(type: Notice["type"]): string {
    switch (type) {
      case "urgent": return "紧急";
      case "activity": return "活动";
      case "normal": return "通知";
    }
  }

  function typeColor(type: Notice["type"]): string {
    switch (type) {
      case "urgent": return "bg-red-500/80 text-white";
      case "activity": return "bg-accent-warm/80 text-white";
      case "normal": return "bg-accent/30 text-accent";
    }
  }
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">社区公告</div>

  <div class="flex-1 scroll-area p-3 space-y-2">
    {#each notices as notice, i (notice.id)}
      <div class="p-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors animate-fade-in"
        style="animation-delay: {i * 0.1}s">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-1.5 py-0.5 rounded text-[10px] font-medium {typeColor(notice.type)}">
            {typeLabel(notice.type)}
          </span>
          <span class="text-sm font-medium truncate">{notice.title}</span>
        </div>
        <p class="text-xs text-text-secondary line-clamp-2 leading-relaxed">{notice.content}</p>
        <div class="text-[10px] text-text-secondary/50 mt-1">{notice.time}</div>
      </div>
    {/each}
  </div>
</div>
