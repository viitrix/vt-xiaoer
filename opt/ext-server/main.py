import argparse
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from loguru import logger

from config import server_port, tts_config
from tts.aliyun import TTSProvider as AliyunTTS

# --- CLI args parsed before app starts ---
_parser = argparse.ArgumentParser()
_parser.add_argument("--camera", default=os.getenv("CAMERA_DEVICE", ""),
                     help="Camera device path, e.g. /dev/video0")
cli_args, _ = _parser.parse_known_args()
CAMERA_DEVICE = cli_args.camera


app = FastAPI(title="Claw Extension Server")
_tts_providers: dict[str, AliyunTTS] = {}

def _load_tts_config():
    # For simplicity, we only support Aliyun TTS currently.
    aliyun_tts = AliyunTTS(tts_config)
    _tts_providers["default"] = aliyun_tts
    _tts_providers["aliyun"] = aliyun_tts
    logger.info("TTS providers loaded: {}", list(_tts_providers.keys()))
    if CAMERA_DEVICE:
        logger.info("Camera device: {}", CAMERA_DEVICE)
    
@app.on_event("startup")
async def startup():
    _load_tts_config()


# --- Routes ---
@app.get("/health")
async def health():
    return {"status": "ok"}

class TTSRequest(BaseModel):
    text: str
    provider: str = "default"
    voice: str | None = None

@app.post("/tts")
async def text_to_speech(req: TTSRequest):
    tts = _tts_providers.get(req.provider)
    if not tts:
        raise HTTPException(404, f"TTS provider '{req.provider}' not found")

    if req.voice:
        tts.reConfig({"voice": req.voice})

    output = tts.to_tts(req.text)
    if not output or not os.path.exists(output):
        raise HTTPException(500, "TTS generation failed")

    return FileResponse(
        output,
        media_type="audio/wav",
        filename=Path(output).name,
    )


@app.post("/tts/play")
async def play_tts(req: TTSRequest):
    tts = _tts_providers.get(req.provider)
    if not tts:
        raise HTTPException(404, f"TTS provider '{req.provider}' not found")

    if req.voice:
        tts.reConfig({"voice": req.voice})

    output = tts.to_tts(req.text)
    if not output or not os.path.exists(output):
        raise HTTPException(500, "TTS generation failed")

    subprocess.Popen(
        ["ffplay", "-nodisp", "-autoexit", "-loglevel", "quiet", output],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return {"status": "playing", "file": Path(output).name}


@app.post("/tts/cleanup")
async def cleanup_tts_files():
    """Remove old TTS temp files."""
    output_dir = tts_config["output_dir"]
    count = 0
    for f in Path(output_dir).glob("tts-*"):
        if f.is_file():
            f.unlink()
            count += 1
    return {"deleted": count}


# --- Camera capture ---

def _capture_frame(device: str, width: int = 1280, height: int = 720) -> str | None:
    """Capture a single JPG frame via ffmpeg. Returns path to temp file or None."""
    if not shutil.which("ffmpeg"):
        logger.error("ffmpeg not found")
        return None

    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tmp.close()

    for fmt in ("mjpeg", "yuyv422"):
        cmd = [
            "ffmpeg", "-y",
            "-f", "v4l2",
            "-input_format", fmt,
            "-video_size", f"{width}x{height}",
            "-i", device,
            "-frames:v", "1",
            "-q:v", "2",
            tmp.name,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0 and os.path.isfile(tmp.name) and os.path.getsize(tmp.name) > 0:
            return tmp.name

    os.unlink(tmp.name)
    return None


@app.get("/camera/snapshot")
async def camera_snapshot(
    w: int = Query(1280, description="Width"),
    h: int = Query(720, description="Height"),
):
    if not CAMERA_DEVICE:
        raise HTTPException(400, "No camera device configured. Start with --camera /dev/videoX")
    if not os.path.exists(CAMERA_DEVICE):
        raise HTTPException(400, f"Camera device {CAMERA_DEVICE} not found")

    path = _capture_frame(CAMERA_DEVICE, w, h)
    if not path:
        raise HTTPException(500, "Capture failed")

    return FileResponse(
        path,
        media_type="image/jpeg",
        filename="snapshot.jpg",
        background=None,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=server_port)
