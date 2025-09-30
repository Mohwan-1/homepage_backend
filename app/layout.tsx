import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homepage",
  description: "Professional business homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}