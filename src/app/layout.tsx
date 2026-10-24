import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "FrameFlow — Video Intelligence & Frame Extraction Platform",
    template: "%s | FrameFlow",
  },
  description:
    "Paste any video URL and FrameFlow's AI instantly extracts your most shareable frames — captioned, branded, and formatted for every platform.",
  keywords: [
    "video frame extraction",
    "AI video frames",
    "YouTube screenshot",
    "content repurposing",
    "creator tools",
    "video to image",
    "social media content",
    "frame capture",
  ],
  authors: [{ name: "Kennedy Muritu", url: "https://www.muritu.top" }],
  creator: "Kennedy Muritu",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://frameflow.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://frameflow.io",
    title: "FrameFlow — Video Intelligence & Frame Extraction",
    description:
      "Paste any video URL and FrameFlow's AI instantly extracts your most shareable frames.",
    siteName: "FrameFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameFlow — Video Intelligence & Frame Extraction",
    description:
      "Paste any video URL and FrameFlow's AI instantly extracts your most shareable frames.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
