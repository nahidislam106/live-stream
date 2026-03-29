# ESP32-CAM Live Streaming System

This project contains three components:
1. **Firmware (`esp32.ino`)**: Runs on the ESP32-CAM, captures frames and POSTs them to the relay server.
2. **Relay Server (`relay/`)**: A Python FastAPI server that receives frames from the ESP32 and serves an MJPEG stream.
3. **Web App (`webapp/`)**: A Next.js 14 application that displays the live stream and connection status.

## 1. Relay Server (Python FastAPI)

The relay server acts as a middleman.

### Local Development
```bash
cd relay
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Deployment (Railway)
1. Initialize a Git repo and push the `relay` folder to GitHub.
2. Go to Railway.app and create a new project from the GitHub repo.
3. Railway will automatically detect the Python environment and run it using Uvicorn if you specify the Start Command in Settings: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Copy the public Railway URL (e.g., `https://my-relay-production.up.railway.app`) to use in your ESP32 firmware and Next.js app.

## 2. Firmware (Arduino C++)

The firmware captures JPEGs and uploads them continuously.

### Setup
1. Open `esp32.ino` in the Arduino IDE.
2. Install the **ESP32** board package in Arduino IDE.
3. Select "AI Thinker ESP32-CAM" in Tools -> Board.
4. Update the following variables in `esp32.ino`:
   - `ssid`: Your WiFi network name.
   - `password`: Your WiFi password.
   - `serverUrl`: The URL of your relay server's `/upload` endpoint (e.g., `http://YOUR_RELAY_URL/upload`).
5. Connect your ESP32-CAM via an FTDI programmer and upload the code.

## 3. Web App (Next.js)

The web app fetches the MJPEG stream and displays it.

### Local Development
```bash
cd webapp
npm install
# Update NEXT_PUBLIC_RELAY_URL in .env or hardcode it in page.tsx if needed
npm run dev
```

### Deployment (Vercel)
1. Push the `webapp` folder to GitHub.
2. Go to Vercel.com and import the `webapp` project.
3. Add the environment variable `NEXT_PUBLIC_RELAY_URL` pointing to your Railway relay server URL.
4. Deploy.
