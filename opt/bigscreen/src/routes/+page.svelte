<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import VideoPanel from "$lib/components/VideoPanel.svelte";
  import StatsPanel from "$lib/components/StatsPanel.svelte";
  import NoticePanel from "$lib/components/NoticePanel.svelte";
  import VisitorPanel from "$lib/components/VisitorPanel.svelte";
  import EnergyPanel from "$lib/components/EnergyPanel.svelte";
  import QuickInfoPanel from "$lib/components/QuickInfoPanel.svelte";
</script>

<svelte:head>
  <title>翡翠湾智慧社区 · 管理大屏</title>
</svelte:head>

<div class="w-screen h-screen flex flex-col bg-[#020b1a] overflow-hidden">
  <!-- 顶部标题栏 -->
  <Header />

  <!-- 背景装饰 -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden">
    <div class="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"></div>
    <div class="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]"></div>
  </div>

  <!-- 主体内容: 三栏布局 -->
  <div class="flex-1 grid grid-cols-[280px_1fr_280px] gap-3 p-3 relative z-10 min-h-0">
    <!-- 左栏 -->
    <div class="flex flex-col gap-3 min-h-0">
      <div class="flex-1 min-h-0">
        <StatsPanel />
      </div>
      <div class="flex-1 min-h-0">
        <QuickInfoPanel />
      </div>
    </div>

    <!-- 中栏: 视频区 -->
    <div class="min-h-0">
      <VideoPanel />
    </div>

    <!-- 右栏 -->
    <div class="flex flex-col gap-3 min-h-0">
      <div class="flex-1 min-h-0">
        <NoticePanel />
      </div>
      <div class="flex-1 min-h-0">
        <VisitorPanel />
      </div>
      <div class="flex-1 min-h-0">
        <EnergyPanel />
      </div>
    </div>
  </div>

  <!-- 底部信息栏 -->
  <footer class="flex items-center justify-between px-8 py-2 text-[10px] text-text-secondary/40 border-t border-panel-border">
    <span>翡翠湾智慧社区管理平台 v1.0</span>
    <span>数据更新时间: 实时</span>
    <span>技术支持: 智慧社区解决方案</span>
  </footer>
</div>
