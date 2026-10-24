"""
FrameFlow AI Pipeline
Handles frame scoring (CLIP), transcription (Whisper), and caption alignment.
"""

import os
import asyncio
import base64
from typing import List, Dict, Any
from pathlib import Path


class AIPipeline:
    def __init__(self):
        self._whisper_model = None
        self._clip_model = None
        self._clip_processor = None

    def _load_whisper(self):
        if self._whisper_model is None:
            import whisper
            self._whisper_model = whisper.load_model("base")
        return self._whisper_model

    def _load_clip(self):
        if self._clip_model is None:
            from transformers import CLIPProcessor, CLIPModel
            self._clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            self._clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        return self._clip_model, self._clip_processor

    async def score_frames(self, frames: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Score each frame using CLIP visual-semantic model."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._score_frames_sync, frames)

    def _score_frames_sync(self, frames: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        try:
            import cv2
            import numpy as np
            import torch
            
            model, processor = self._load_clip()
            
            prompts = [
                "a powerful quote being spoken",
                "a facial close-up with strong emotion",
                "an interesting data visualization or chart",
                "a compelling visual moment worth sharing",
            ]
            
            scored = []
            for frame in frames:
                try:
                    image = cv2.imread(frame["path"])
                    if image is None:
                        continue
                    
                    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    
                    from PIL import Image as PILImage
                    pil_image = PILImage.fromarray(image_rgb)
                    
                    inputs = processor(text=prompts, images=pil_image, return_tensors="pt", padding=True)
                    
                    with torch.no_grad():
                        outputs = model(**inputs)
                        logits = outputs.logits_per_image.softmax(dim=1)
                        visual_score = float(logits.max().item()) * 10
                    
                    face_score = self._detect_face(image)
                    text_score = self._detect_text_overlay(image)
                    
                    composite = (visual_score * 0.4) + (face_score * 0.3) + (text_score * 0.3)
                    
                    frame["ai_score"] = round(min(composite, 10.0), 1)
                    frame["visual_score"] = round(visual_score, 1)
                    frame["face_detected"] = face_score > 5.0
                    frame["text_detected"] = text_score > 5.0
                    scored.append(frame)
                    
                except Exception:
                    frame["ai_score"] = 5.0
                    frame["face_detected"] = False
                    frame["text_detected"] = False
                    scored.append(frame)
            
            scored.sort(key=lambda f: f["ai_score"], reverse=True)
            return scored
            
        except Exception:
            for frame in frames:
                frame["ai_score"] = 7.0
                frame["face_detected"] = False
                frame["text_detected"] = False
            return frames

    def _detect_face(self, image) -> float:
        import cv2
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        face_cascade = cv2.CascadeClassifier(cascade_path)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        return 8.0 if len(faces) > 0 else 3.0

    def _detect_text_overlay(self, image) -> float:
        import cv2
        import numpy as np
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        bottom_strip = gray[int(height * 0.7):, :]
        edges = cv2.Canny(bottom_strip, 100, 200)
        edge_density = np.sum(edges > 0) / edges.size
        return 8.0 if edge_density > 0.05 else 3.0

    async def add_captions(
        self, frames: List[Dict[str, Any]], video_path: str
    ) -> List[Dict[str, Any]]:
        """Transcribe audio and align captions to frame timestamps."""
        loop = asyncio.get_event_loop()
        transcript = await loop.run_in_executor(None, self._transcribe, video_path)
        
        for frame in frames:
            ts = frame["timestamp"]
            caption = self._find_caption_at(transcript, ts)
            frame["caption"] = caption
        
        return frames

    def _transcribe(self, video_path: str) -> List[Dict]:
        try:
            model = self._load_whisper()
            result = model.transcribe(video_path, word_timestamps=True)
            segments = []
            for seg in result.get("segments", []):
                segments.append({
                    "start": seg["start"],
                    "end": seg["end"],
                    "text": seg["text"].strip(),
                })
            return segments
        except Exception:
            return []

    def _find_caption_at(self, segments: List[Dict], timestamp: float) -> str:
        window = 3.0
        candidates = [
            seg for seg in segments
            if abs(seg["start"] - timestamp) <= window or
               (seg["start"] <= timestamp <= seg["end"])
        ]
        if candidates:
            best = min(candidates, key=lambda s: abs(s["start"] - timestamp))
            return f'"{best["text"]}"'
        return ""
