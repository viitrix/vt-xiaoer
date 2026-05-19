<script lang="ts">
  import { videoSources } from "$lib/data/mock";

  let activeVideo = $state(0);
  let videoRef: HTMLVideoElement | undefined = $state();
  let mainStream: MediaStream | null = $state(null);

  async function openCamera() {
    try {
      if (mainStream) {
        mainStream.getTracks().forEach(t => t.stop());
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === "videoinput");
      const constraints: MediaStreamConstraints = videoDevices.length > 0
        ? { video: { deviceId: { exact: videoDevices[0].deviceId } } }
        : { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mainStream = stream;
      if (videoRef) videoRef.srcObject = stream;
    } catch (err) {
      console.error("摄像头打开失败:", err);
    }
  }

  function switchTo(index: number) {
    activeVideo = index;
    // 仅摄像头1使用真实WebRTC流，其余路为模拟画面
  }

  $effect(() => {
    openCamera();
    const timer = setInterval(() => {
      const next = (activeVideo + 1) % videoSources.length;
      switchTo(next);
    }, 10000);
    return () => clearInterval(timer);
  });
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">实时监控</div>

  <!-- 主视频区 -->
  <div class="relative flex-1 m-3 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
    {#if activeVideo === 0}
      <video
        bind:this={videoRef}
        autoplay
        playsinline
        muted
        class="w-full h-full object-cover"
      ></video>
    {:else}
      <div class="flex flex-col items-center gap-3 text-text-secondary">
        <svg class="w-16 h-16 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span class="text-sm">{videoSources[activeVideo].title}</span>
      </div>
    {/if}
    <!-- 视频标签 -->
    <div class="absolute top-2 left-2 px-2 py-1 rounded bg-red-600/80 text-xs text-white flex items-center gap-1">
      <span class="w-2 h-2 rounded-full bg-red-400 animate-breathe"></span>
      REC
    </div>
    <div class="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-xs text-text-secondary">
      {videoSources[activeVideo].title}
    </div>
  </div>

  <!-- 缩略图列表 -->
  <div class="flex gap-2 px-3 pb-3">
    {#each videoSources as video, i}
      <button
        class="flex-1 h-14 rounded-md overflow-hidden border-2 transition-all {i === activeVideo ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-80'}"
        onclick={() => switchTo(i)}
      >
        <div class="w-full h-full bg-black/60 flex items-center justify-center text-xs text-text-secondary">
          {video.title}
        </div>
      </button>
    {/each}
  </div>
</div>
