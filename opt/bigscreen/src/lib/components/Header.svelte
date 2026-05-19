<script lang="ts">
  import { communityName, weatherInfo } from "$lib/data/mock";
  import { formatTime, formatDate, getGreeting } from "$lib/utils/time";

  let currentTime = $state(formatTime(new Date()));
  let currentDate = $state(formatDate(new Date()));
  let greeting = $state(getGreeting());

  $effect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      currentTime = formatTime(now);
      currentDate = formatDate(now);
      greeting = getGreeting();
    }, 1000);
    return () => clearInterval(timer);
  });
</script>

<header class="relative flex items-center justify-between px-8 py-4 bg-gradient-to-r from-primary via-primary-light to-primary">
  <!-- 装饰线条 -->
  <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>

  <!-- 左侧: 日期 & 天气 -->
  <div class="flex items-center gap-6 text-sm text-text-secondary">
    <span>{currentDate}</span>
    <span class="text-lg">{weatherInfo.icon}</span>
    <span>{weatherInfo.temp}°C</span>
    <span>{weatherInfo.weather}</span>
    <span>湿度 {weatherInfo.humidity}%</span>
  </div>

  <!-- 中间: 标题 -->
  <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
    <h1 class="text-2xl font-bold tracking-[8px] text-white drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
      欢迎业主会欢迎业主
    </h1>
  </div>

  <!-- 右侧: 时间 & 问候 -->
  <div class="flex items-center gap-6">
    <span class="text-text-secondary text-sm">{greeting}</span>
    <span class="num-highlight text-3xl tracking-wider">{currentTime}</span>
  </div>
</header>
