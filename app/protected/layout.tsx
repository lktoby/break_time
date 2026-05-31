import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "シールこうかんアプリ",
  description: "ともだちとシールをこうかんしましょう！",
};

const nicoMoji = localFont({
  src: './NicoMoji-Regular.ttf',
  display: "swap",
  variable: '--font-nico-moji'
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${nicoMoji.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

