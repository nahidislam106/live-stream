<div align="center">
  <h1>📷 ESP32-CAM Live Streaming System</h1>
  <p>A modern, full-stack live streaming solution using ESP32-CAM, Python FastAPI, and Next.js</p>
  
  ![Arduino](https://img.shields.io/badge/Firmware-Arduino%20C%2B%2B-00979D?style=for-the-badge&logo=arduino)
  ![FastAPI](https://img.shields.io/badge/Relay-FastAPI-009688?style=for-the-badge&logo=fastapi)
  ![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js)
</div>

---

## 🚀 Demo & Screenshots

<details open>
<summary><b>Live Stream Dashboard</b></summary>
<br>
<img src="Video%20and%20Screenshot/Screenshot%20from%202026-03-30%2003-37-44.png" alt="Next.js Web App View" width="100%">
</details>

<details>
<summary><b>Relay Server Logs (Railway)</b></summary>
<br>
<img src="Video%20and%20Screenshot/Screenshot%20from%202026-03-30%2003-36-17.png" alt="Railway Production Logs" width="100%">
</details>

<details open>
<summary><b>Live Video Demo</b></summary>
<br>

https://github.com/nahidislam106/live-stream/raw/main/Video%20and%20Screenshot/Screencast%20from%202026-03-30%2003-38-22.mp4

*(Note: GitHub natively renders `.mp4` links as video players. If it doesn't play directly, you can access the video from the [Video and Screenshot folder](Video%20and%20Screenshot/).)*

</details>

---

## 🏗️ Architecture

1. **ESP32-CAM**: Connects to Wi-Fi and continuously `POST`s JPEG frames to the relay server.
2. **Python Relay Server (FastAPI)**: Receives the frames and streams them out as a continuous MJPEG (Multipart JPEG) stream. Hosted on Railway.
3. **Next.js Web App**: Fetches the MJPEG stream and displays it in a modern, responsive UI with auto-reconnect and health status checks. Hosted on Vercel.

---

## 🛠️ Components & Setup

### 1. Relay Server (Python FastAPI)

The relay server acts as a middleman between the ESP32-CAM and the web application.

**Local Development:**
```bash
cd relay
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Deployment (Railway):**
1. Push this repository to GitHub.
2. Import the repo as a new project on [Railway.app](https://railway.app/).
3. Ensure your Start Command is `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Generate a public domain in Railway settings and copy the URL.

---

### 2. Firmware (Arduino C++)

The firmware captures JPEGs and uploads them continuously to the Relay Server.

**Setup:**
1. Open `esp32.ino` in the Arduino IDE.
2. Install the **ESP32** board package and select "AI Thinker ESP32-CAM".
3. Update the following variables in `esp32.ino`:
   - `ssid` and `password`: Your Wi-Fi credentials.
   - `serverUrl`: Your Railway Relay Server URL appended with `/upload`. *(e.g., `https://live-stream-production-db92.up.railway.app/upload`)*.
4. Connect your ESP32-CAM via an FTDI programmer and upload the code.

---

### 3. Web App (Next.js)

The frontend dashboard fetching the stream.

**Local Development:**
```bash
cd webapp
npm install
# Set NEXT_PUBLIC_RELAY_URL in .env.local to your live Railway server
npm run dev
```

**Deployment (Vercel):**
1. Import the `webapp` folder to [Vercel.com](https://vercel.com).
2. Add the Environment Variable `NEXT_PUBLIC_RELAY_URL` pointing to your Railway URL.
3. Click Deploy!
