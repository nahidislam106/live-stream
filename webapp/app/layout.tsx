import "./globals.css";

export const metadata = {
  title: "ESP32-CAM Stream",
  description: "Live camera stream from ESP32",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
