import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bullet Journal Calendar",
  description: "Персональний календар-щоденник зі стікерами, фото та записами"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
