import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Finance Analyzer",
  description: "Finance Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="pl-4 pt-3 pb-3 text-3xl font-extrabold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-700">
              Finance Analyzer
          </span>
        </div>
        <hr />
        {children}
      </body>
    </html>
  );
}
