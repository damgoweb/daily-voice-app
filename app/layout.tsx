import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "よむ日和 - 毎日の朗読習慣",
  description: "毎日新鮮な情報を朗読して、脳を活性化しましょう",
  keywords: ["朗読", "ボケ防止", "認知機能", "習慣化"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}