<script lang="ts">
  import { energyData } from "$lib/data/mock";

  const maxElectric = Math.max(...energyData.map(d => d.electric));
  const maxWater = Math.max(...energyData.map(d => d.water));
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">能耗趋势</div>

  <div class="flex-1 p-4 flex flex-col justify-end">
    <!-- 图例 -->
    <div class="flex gap-4 mb-3 text-xs text-text-secondary">
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-sm bg-accent/70"></span> 用电量(kWh)
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-sm bg-accent-warm/70"></span> 用水量(吨)
      </span>
    </div>

    <!-- 柱状图 -->
    <div class="flex items-end gap-3 h-40">
      {#each energyData as item}
        <div class="flex-1 flex flex-col items-center gap-1">
          <div class="flex items-end gap-[2px] w-full justify-center h-full">
            <!-- 用电量柱 -->
            <div class="w-3 rounded-t-sm bg-gradient-to-t from-accent/80 to-accent/40 transition-all"
              style="height: {item.electric / maxElectric * 100}%"></div>
            <!-- 用水量柱 -->
            <div class="w-3 rounded-t-sm bg-gradient-to-t from-accent-warm/80 to-accent-warm/40 transition-all"
              style="height: {item.water / maxWater * 100}%"></div>
          </div>
          <span class="text-[10px] text-text-secondary">{item.label}</span>
        </div>
      {/each}
    </div>

    <!-- 本月汇总 -->
    <div class="flex justify-between mt-4 pt-3 border-t border-panel-border text-xs">
      <div class="text-center">
        <div class="text-text-secondary">本月用电</div>
        <div class="num-highlight text-lg">{energyData[energyData.length - 1].electric.toLocaleString()}</div>
        <div class="text-text-secondary">kWh</div>
      </div>
      <div class="text-center">
        <div class="text-text-secondary">本月用水</div>
        <div class="num-highlight text-lg">{energyData[energyData.length - 1].water.toLocaleString()}</div>
        <div class="text-text-secondary">吨</div>
      </div>
      <div class="text-center">
        <div class="text-text-secondary">环比上月</div>
        <div class="text-green-400 text-lg font-bold">+8.2%</div>
        <div class="text-text-secondary">用电</div>
      </div>
    </div>
  </div>
</div>
