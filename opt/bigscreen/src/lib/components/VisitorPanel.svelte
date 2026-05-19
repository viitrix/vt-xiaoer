<script lang="ts">
  import { recentVisitors } from "$lib/data/mock";

  // 模拟持续更新的进入记录
  let visitors = $state(recentVisitors);
  let lastTime = $state("12:30:45");

  $effect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      lastTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      // 模拟随机添加新访客记录
      const randomIdx = Math.floor(Math.random() * recentVisitors.length);
      visitors = [recentVisitors[randomIdx], ...visitors.slice(0, 7)];
    }, 5000);
    return () => clearInterval(timer);
  });
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">进出记录</div>

  <div class="flex-1 scroll-auto p-3 space-y-1.5">
    {#each visitors as visitor, i (visitor.id + '-' + i)}
      <div class="flex items-center gap-3 p-2 rounded-lg bg-white/5 transition-all {i === 0 ? 'animate-fade-in ring-1 ring-accent/20' : ''}">
        <!-- 头像 -->
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style="background: {visitor.avatar_color}33; color: {visitor.avatar_color}; border: 1px solid {visitor.avatar_color}55">
          {visitor.name[0]}
        </div>
        <!-- 信息 -->
        <div class="flex-1 min-w-0">
          <div class="text-sm truncate">{visitor.name}</div>
          <div class="text-[10px] text-text-secondary">{visitor.unit}</div>
        </div>
        <!-- 状态 -->
        <div class="text-[10px] text-green-400 flex items-center gap-1 shrink-0">
          <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          已通行
        </div>
      </div>
    {/each}
  </div>
</div>
