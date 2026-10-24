export type Platform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "x"
  | "facebook"
  | "linkedin"
  | "spotify"
  | "twitch"
  | "rumble"
  | "loom"
  | "vimeo"
  | "direct"
  | "unknown";

export type ExtractionMode = "ai" | "interval" | "timestamp";

export type JobStatus =
  | "queued"
  | "downloading"
  | "extracting"
  | "analyzing"
  | "ranking"
  | "captioning"
  | "complete"
  | "failed";

export type SubscriptionTier = "free" | "pro" | "business" | "api";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  subscription: SubscriptionTier;
  usage: {
    extractions_today: number;
    extractions_this_month: number;
    total_frames_downloaded: number;
  };
}

export interface ExtractionJob {
  id: string;
  user_id: string;
  url: string;
  platform: Platform;
  title?: string;
  thumbnail?: string;
  duration?: number;
  mode: ExtractionMode;
  options: ExtractionOptions;
  status: JobStatus;
  progress: number;
  progress_message?: string;
  frame_count?: number;
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface ExtractionOptions {
  mode: ExtractionMode;
  interval_seconds?: number;
  timestamps?: number[];
  max_frames?: number;
  ai_threshold?: number;
  include_captions?: boolean;
  apply_brand_kit?: boolean;
}

export interface Frame {
  id: string;
  job_id: string;
  user_id: string;
  timestamp: number;
  url: string;
  thumbnail_url?: string;
  caption?: string;
  ai_score: number;
  scene_score: number;
  face_detected: boolean;
  text_detected: boolean;
  width: number;
  height: number;
  file_size: number;
  created_at: string;
  metadata?: FrameMetadata;
}

export interface FrameMetadata {
  visual_score: number;
  transcript_alignment_score: number;
  scene_novelty_score: number;
  composite_score: number;
  detected_text?: string;
  emotion?: string;
}

export interface BrandKit {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  background_color: string;
  watermark_position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  watermark_opacity: number;
  watermark_style: "subtle" | "visible";
  font_family?: string;
  created_at: string;
}

export interface CropPreset {
  label: string;
  value: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  job_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  id: SubscriptionTier;
  name: string;
  price_monthly: number;
  price_annual: number;
  description: string;
  features: string[];
  limits: {
    extractions_per_day?: number;
    frames_per_extraction?: number;
    platforms: number;
    team_seats?: number;
    api_calls_per_month?: number;
  };
  highlighted: boolean;
  cta: string;
  badge?: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used?: string;
  usage_count: number;
}

export interface WebhookEndpoint {
  id: string;
  user_id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
}
