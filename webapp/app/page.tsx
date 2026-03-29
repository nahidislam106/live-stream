"use client";

import { useEffect, useState } from "react";

// Use environment variable or default to the live Railway server
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "https://live-stream-production-db92.up.railway.app";

export default function Home() {
  const [isOnline, setIsOnline] = useState(false);
  const [streamUrl, setStreamUrl] = useState(`${RELAY_URL}/stream`);

  useEffect(() => {
    // Health check polling
    const checkHealth = async () => {
      try {
        const res = await fetch(`${RELAY_URL}/health`);
        const data = await res.json();
        
        if (data.stream_active && !isOnline) {
          setIsOnline(true);
          // Force stream component to reload by appending timestamp
          setStreamUrl(`${RELAY_URL}/stream?t=${new Date().getTime()}`);
        } else if (!data.stream_active && isOnline) {
          setIsOnline(false);
        }
      } catch (err) {
        setIsOnline(false);
      }
    };

    const intervalId = setInterval(checkHealth, 2000);
    checkHealth(); // Initial check

    return () => clearInterval(intervalId);
  }, [isOnline]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <div className="max-w-3xl w-full flex flex-col items-center gap-6">
        <div className="flex items-center justify-between w-full border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold">ESP32-CAM Live Feed</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Status:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isOnline ? 'LIVE' : 'OFFLINE'}
            </div>
          </div>
        </div>

        <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative flex items-center justify-center">
          {isOnline ? (
            <img 
              src={streamUrl} 
              alt="Live stream" 
              className="w-full h-full object-contain"
              onError={() => setIsOnline(false)}
            />
          ) : (
            <div className="text-center flex flex-col items-center gap-4">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <p className="text-gray-500 font-medium">Camera is currently offline</p>
              <p className="text-sm text-gray-600">Waiting for stream connection...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
