<script lang="ts">
  // 模拟物业服务快捷面板
  const services = [
    { icon: "🔧", label: "报修工单", count: 3, color: "#4fc3f7" },
    { icon: "🛡️", label: "安保巡逻", count: 2, color: "#81c784" },
    { icon: "🧹", label: "保洁任务", count: 5, color: "#ffb74d" },
    { icon: "🌿", label: "绿化养护", count: 1, color: "#4db6ac" },
  ];
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">物业服务</div>

  <div class="flex-1 p-4 grid grid-cols-2 gap-3">
    {#each services as service}
      <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors cursor-default">
        <span class="text-2xl mb-2">{service.icon}</span>
        <span class="text-sm text-text-primary">{service.label}</span>
        <span class="num-highlight text-xl mt-1">{service.count}</span>
        <span class="text-[10px] text-text-secondary">进行中</span>
      </div>
    {/each}
  </div>
</div>
