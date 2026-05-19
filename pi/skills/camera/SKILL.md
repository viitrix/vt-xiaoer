---
name: camera
description: 抓取监控摄像头图像，用于监控安防场景，监控图像保存到本地。
---

抓取图像：

```bash
#获取照片：
curl http://host.docker.internal:4000/camera/snapshot -o snapshot.jpg
# 或指定分辨率
curl "http://host.docker.internal:4000/camera/snapshot?w=640&h=480" -o snap.jpg
```


注意图像要保存到自己的工作目录里面，不要保存到其他位置。
