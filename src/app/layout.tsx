import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canton Hyland — Door Locks & Architectural Hardware",
  description:
    "Internal visual prototype. Layout study only — placeholder content, no production assets.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* [SUB] Archivo via the Google Fonts CDN, replacing the target's licensed
            Trade Gothic Next LT Pro (body) and Traffic (H1). Weights 400/600/700. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
