<script lang="ts">
  import { videoSources } from "$lib/data/mock";

  let activeVideo = $state(0);
  let streams: (MediaStream | null)[] = $state([]);
  let videoRef: HTMLVideoElement | undefined = $state();

  async function openCamera(index: number) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === "videoinput");

      let constraints: MediaStreamConstraints = { video: true };
      const src = videoSources[index];
      if (src.deviceId) {
        constraints = { video: { deviceId: { exact: src.deviceId } } };
      } else if (videoDevices.length > index) {
        constraints = { video: { deviceId: { exact: videoDevices[index].deviceId } } };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streams[index] = stream;
      streams = streams;
      return stream;
    } catch (err) {
      console.error(`摄像头${index + 1}打开失败:`, err);
      return null;
    }
  }

  async function switchTo(index: number) {
    activeVideo = index;
    if (!streams[index]) {
      const stream = await openCamera(index);
      if (stream && videoRef) {
        videoRef.srcObject = stream;
      }
    } else if (videoRef) {
      videoRef.srcObject = streams[index];
    }
  }

  $effect(() => {
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
    <!-- bind:this doesn't work on media elements in some Svelte versions, use action instead -->
    <!-- svelte-ignore binding_property_non_reactive -->
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
