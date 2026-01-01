import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "九星気学 方位吉凶計算",
  description: "九星気学による方位吉凶計算",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
