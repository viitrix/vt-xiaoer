<script lang="ts">
  import { communityStats, parkingInfo } from "$lib/data/mock";
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">社区概况</div>

  <div class="flex-1 p-4 grid grid-cols-2 gap-4">
    <!-- 总户数 -->
    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5">
      <span class="text-text-secondary text-xs mb-1">总户数</span>
      <span class="num-highlight text-3xl">{communityStats.totalHouseholds}</span>
      <span class="text-text-secondary text-xs mt-1">户</span>
    </div>

    <!-- 总人数 -->
    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5">
      <span class="text-text-secondary text-xs mb-1">总人数</span>
      <span class="num-highlight text-3xl">{communityStats.totalResidents}</span>
      <span class="text-text-secondary text-xs mt-1">人</span>
    </div>

    <!-- 入住率 -->
    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5">
      <span class="text-text-secondary text-xs mb-1">入住率</span>
      <div class="relative w-16 h-16">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,212,255,0.15)" stroke-width="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00d4ff" stroke-width="3"
            stroke-dasharray="{communityStats.occupancyRate} {100 - communityStats.occupancyRate}"
            stroke-linecap="round" />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center num-highlight text-sm">
          {communityStats.occupancyRate}%
        </span>
      </div>
    </div>

    <!-- 车位使用率 -->
    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5">
      <span class="text-text-secondary text-xs mb-1">车位使用</span>
      <div class="w-full px-2">
        <div class="flex justify-between text-xs text-text-secondary mb-1">
          <span>空闲 {parkingInfo.free}</span>
          <span>总计 {parkingInfo.total}</span>
        </div>
        <div class="h-3 rounded-full bg-white/10 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 transition-all"
            style="width: {parkingInfo.used / parkingInfo.total * 100}%"></div>
        </div>
        <div class="text-center num-highlight text-sm mt-1">{parkingInfo.used}/{parkingInfo.total}</div>
      </div>
    </div>
  </div>
</div>
