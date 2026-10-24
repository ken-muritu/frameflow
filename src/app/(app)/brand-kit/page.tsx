"use client";

import { useState } from "react";
import { Palette, Upload, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export default function BrandKitPage() {
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [secondaryColor, setSecondaryColor] = useState("#06B6D4");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#000000");
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>("bottom-right");
  const [showWatermark, setShowWatermark] = useState(true);
  const [saved, setSaved] = useState(false);

  const positions: { value: WatermarkPosition; label: string }[] = [
    { value: "top-left", label: "↖" },
    { value: "top-right", label: "↗" },
    { value: "center", label: "⊙" },
    { value: "bottom-left", label: "↙" },
    { value: "bottom-right", label: "↘" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Brand Kit</h1>
          <p className="text-white/40 text-sm mt-0.5">Your logo, colors, and watermark applied to every frame</p>
        </div>
        <Button variant="gradient" onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Brand Kit"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Settings */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" />
              Logo
            </h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-violet-500/40 transition-colors cursor-pointer group">
              <Upload className="w-6 h-6 text-white/20 mx-auto mb-2 group-hover:text-violet-400 transition-colors" />
              <p className="text-sm text-white/40">Drag & drop your logo here</p>
              <p className="text-xs text-white/20 mt-1">PNG, SVG, WebP · Max 2MB</p>
              <Button variant="outline" size="sm" className="mt-3">Browse Files</Button>
            </div>
          </div>

          {/* Colors */}
          <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Color Palette
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Primary Color", value: primaryColor, set: setPrimaryColor },
                { label: "Secondary Color", value: secondaryColor, set: setSecondaryColor },
                { label: "Text Color", value: textColor, set: setTextColor },
                { label: "Background", value: bgColor, set: setBgColor },
              ].map(({ label, value, set }) => (
                <div key={label} className="space-y-1.5">
                  <Label className="text-xs">{label}</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                    />
                    <Input value={value} onChange={(e) => set(e.target.value)} className="font-mono text-xs h-9" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watermark */}
          <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Watermark</h3>
              <Switch checked={showWatermark} onCheckedChange={setShowWatermark} />
            </div>
            {showWatermark && (
              <>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Opacity: {watermarkOpacity}%</Label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Position</Label>
                    <div className="grid grid-cols-5 gap-1">
                      {positions.map((pos) => (
                        <button
                          key={pos.value}
                          onClick={() => setWatermarkPosition(pos.value)}
                          className={`h-9 rounded-lg text-lg transition-all ${
                            watermarkPosition === pos.value
                              ? "bg-violet-600/30 border border-violet-500/50 text-violet-400"
                              : "bg-white/5 border border-white/[0.06] text-white/40 hover:bg-white/10"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-[#0F0F1B] border border-white/[0.06]">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-400" />
              Preview
            </h3>
            <div className="relative rounded-xl overflow-hidden aspect-video" style={{ backgroundColor: bgColor }}>
              {/* Mock frame content */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <p className="text-center font-semibold leading-relaxed" style={{ color: textColor }}>
                  &quot;The most powerful thing you can do is develop a craft that compounds over time.&quot;
                </p>
              </div>
              {/* Watermark */}
              {showWatermark && (
                <div
                  className={`absolute text-xs font-medium px-2 py-1 rounded ${
                    watermarkPosition === "top-left" ? "top-2 left-2" :
                    watermarkPosition === "top-right" ? "top-2 right-2" :
                    watermarkPosition === "bottom-left" ? "bottom-2 left-2" :
                    watermarkPosition === "bottom-right" ? "bottom-2 right-2" :
                    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  }`}
                  style={{ color: primaryColor, opacity: watermarkOpacity / 100 }}
                >
                  Made with FrameFlow
                </div>
              )}
              {/* Brand color accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-3">
              {["1:1 Square", "9:16 Stories", "16:9 Landscape", "4:5 Instagram"].map((preset) => (
                <div key={preset} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-white/40 text-center cursor-pointer hover:border-violet-500/30 hover:text-white/60 transition-colors">
                  {preset}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-xs text-violet-300 leading-relaxed">
              💡 Your brand kit is automatically applied when you download frames. 
              Upgrade to Pro to save multiple brand kits and use custom fonts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
