<script lang="ts">
  import { onMount } from "svelte";
  import { videoSources } from "$lib/data/mock";

  let activeVideo = $state(0);
  let videoRef: HTMLVideoElement | undefined = $state();
  let mainStream: MediaStream | null = $state(null);

  async function openCamera() {
    try {
      if (mainStream) {
        mainStream.getTracks().forEach(t => t.stop());
      }
      let stream: MediaStream;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === "videoinput");
        if (videoDevices.length > 0 && videoDevices[0].deviceId) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: videoDevices[0].deviceId } }
          });
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      mainStream = stream;
      attachStream(stream);
    } catch (err) {
      console.error("摄像头打开失败:", err);
    }
  }

  function attachStream(stream: MediaStream) {
    if (!videoRef) return;
    videoRef.srcObject = stream;
    videoRef.play().catch(() => {});
  }

  $effect(() => {
    if (mainStream && videoRef) {
      attachStream(mainStream);
    }
  });

  function switchTo(index: number) {
    activeVideo = index;
  }

  onMount(() => {
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
    <video
      bind:this={videoRef}
      autoplay
      playsinline
      muted
      class="w-full h-full object-cover"
    ></video>
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
