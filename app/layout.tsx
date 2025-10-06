import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "音読日和 - 毎日　声を出して読む",
  description: "毎日新鮮な情報を音読して、脳を活性化しましょう",
  keywords: ["音読", "ボケ防止", "認知機能", "習慣化"],
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