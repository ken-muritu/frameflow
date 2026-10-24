import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function detectPlatform(url: string): string {
  if (!url) return "unknown";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "x";
  if (url.includes("facebook.com")) return "facebook";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("twitch.tv")) return "twitch";
  if (url.includes("rumble.com")) return "rumble";
  if (url.includes("loom.com")) return "loom";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) return "direct";
  return "unknown";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: "#FF0000",
    instagram: "#E1306C",
    tiktok: "#69C9D0",
    x: "#1DA1F2",
    facebook: "#1877F2",
    linkedin: "#0A66C2",
    spotify: "#1DB954",
    twitch: "#9146FF",
    rumble: "#85C742",
    loom: "#FF5B5E",
    vimeo: "#1AB7EA",
    direct: "#8B5CF6",
  };
  return colors[platform] || "#8B5CF6";
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: "YouTube",
    instagram: "Instagram",
    tiktok: "TikTok",
    x: "X (Twitter)",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    spotify: "Spotify",
    twitch: "Twitch",
    rumble: "Rumble",
    loom: "Loom",
    vimeo: "Vimeo",
    direct: "Direct URL",
    unknown: "Unknown",
  };
  return labels[platform] || "Unknown";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CROP_PRESETS = [
  { label: "Square", value: "1:1", width: 1080, height: 1080 },
  { label: "Portrait", value: "9:16", width: 1080, height: 1920 },
  { label: "Landscape", value: "16:9", width: 1920, height: 1080 },
  { label: "Instagram", value: "4:5", width: 1080, height: 1350 },
  { label: "Twitter", value: "3:2", width: 1200, height: 800 },
  { label: "LinkedIn", value: "1.91:1", width: 1200, height: 628 },
];

export const PLATFORM_PRESETS: Record<string, { crop: string; label: string }[]> = {
  instagram: [
    { crop: "1:1", label: "Feed Square" },
    { crop: "4:5", label: "Feed Portrait" },
    { crop: "9:16", label: "Stories/Reels" },
  ],
  x: [{ crop: "16:9", label: "Tweet Image" }, { crop: "1:1", label: "Square" }],
  tiktok: [{ crop: "9:16", label: "TikTok Video" }],
  linkedin: [{ crop: "1.91:1", label: "Post Image" }, { crop: "1:1", label: "Square" }],
  facebook: [{ crop: "16:9", label: "Post" }, { crop: "1:1", label: "Square" }],
  whatsapp: [{ crop: "9:16", label: "Status" }, { crop: "1:1", label: "Square" }],
};
