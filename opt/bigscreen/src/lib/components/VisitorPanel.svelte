<script lang="ts">
  const DETECT_IMAGE_URL = "http://localhost:4000/camera/detect";
  let imgSrc = $state(`${DETECT_IMAGE_URL}?t=${Date.now()}`);

  $effect(() => {
    const timer = setInterval(() => {
      imgSrc = `${DETECT_IMAGE_URL}?t=${Date.now()}`;
    }, 2000);
    return () => clearInterval(timer);
  });
</script>

<div class="screen-panel flex flex-col h-full">
  <div class="panel-title">目标检测</div>

  <div class="flex-1 min-h-0 p-3">
    <img
      src={imgSrc}
      alt="目标检测结果"
      class="w-full h-full object-contain rounded-lg"
    />
  </div>
</div>
