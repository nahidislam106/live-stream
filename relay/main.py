import asyncio
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_frame = b""
last_frame_time = 0

@app.get("/")
def read_root():
    return {"message": "ESP32-CAM Relay Server is running. Endpoints: /health, /stream, /upload"}

@app.get("/health")
def health_check():
    # Considering the stream "down" if no frame received in the last 5 seconds
    is_active = (time.time() - last_frame_time) < 5.0
    return {"status": "ok", "stream_active": is_active}

@app.post("/upload")
async def upload_frame(request: Request):
    global latest_frame, last_frame_time
    latest_frame = await request.body()
    last_frame_time = time.time()
    return {"status": "success"}

async def frame_generator():
    global latest_frame
    while True:
        if latest_frame:
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + latest_frame + b"\r\n"
            )
        await asyncio.sleep(0.1)

@app.get("/stream")
def stream_video():
    return StreamingResponse(
        frame_generator(), 
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
