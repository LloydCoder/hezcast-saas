import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title:       "HezCast — AI Content Broadcasting System",
  description: "Turn ideas into broadcast-ready content. Script, voice, video, captions, thumbnails — automated.",
  keywords:    ["AI video", "content generation", "TikTok automation", "UGC"],
  authors:     [{ name: "Tinlance Limited" }],
  openGraph: {
    title:       "HezCast — AI Content Broadcasting System",
    description: "Turn ideas into broadcast-ready content.",
    url:         "https://cast.tinlance.com",
    siteName:    "HezCast",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "HezCast",
    description: "AI Content Broadcasting System by Tinlance",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="bg-ink text-txt font-body antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
