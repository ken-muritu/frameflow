"use client";

import { useState } from "react";
import {
  Search, SlidersHorizontal, Star, Clock, Download,
  LayoutGrid, List, CheckSquare, X, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

const allFrames = [
  { id: "1", jobTitle: "Lex Fridman #421", platform: "YouTube", timestamp: 754, caption: '"The most powerful thing you can do is develop a craft that compounds."', score: 9.6, selected: false },
  { id: "2", jobTitle: "Lex Fridman #421", platform: "YouTube", timestamp: 1234, caption: '"Consistency is not about perfection. It\'s about showing up."', score: 9.1, selected: false },
  { id: "3", jobTitle: "Modern Wisdom #756", platform: "YouTube", timestamp: 2045, caption: '"The secret to getting ahead is getting started."', score: 8.8, selected: false },
  { id: "4", jobTitle: "Modern Wisdom #756", platform: "YouTube", timestamp: 3312, caption: '"Focus is more valuable than intelligence."', score: 8.5, selected: false },
  { id: "5", jobTitle: "Naval on X", platform: "X", timestamp: 45, caption: '"Specific knowledge is knowledge you can\'t be trained for."', score: 9.6, selected: false },
  { id: "6", jobTitle: "Naval on X", platform: "X", timestamp: 102, caption: '"Earn with your mind, not your time."', score: 9.2, selected: false },
  { id: "7", jobTitle: "Huberman Lab — Sleep", platform: "YouTube", timestamp: 4567, caption: '"Sleep is the foundation of all mental and physical health."', score: 8.9, selected: false },
  { id: "8", jobTitle: "Huberman Lab — Sleep", platform: "YouTube", timestamp: 5892, caption: '"The first 90 minutes of sleep determines your night."', score: 8.4, selected: false },
  { id: "9", jobTitle: "Huberman Lab — Sleep", platform: "YouTube", timestamp: 7234, caption: '"Non-sleep deep rest can replace 20% of your sleep need."', score: 7.9, selected: false },
];

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"score" | "newest">("score");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = allFrames
    .filter(
      (f) =>
        f.caption.toLowerCase().includes(search.toLowerCase()) ||
        f.jobTitle.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sort === "score" ? b.score - a.score : b.timestamp - a.timestamp);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Frame Gallery</h1>
          <p className="text-white/40 text-sm mt-0.5">{allFrames.length} frames across {4} extractions</p>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">{selected.size} selected</span>
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())}>
              <X className="w-3.5 h-3.5 mr-1" />Clear
            </Button>
            <Button variant="gradient" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download ({selected.size})
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Search frames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
        <Button
          variant={sort === "score" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSort("score")}
          className={sort === "score" ? "bg-violet-600/20 text-violet-400 border border-violet-500/30" : ""}
        >
          <Star className="w-3.5 h-3.5 mr-1.5" />AI Score
        </Button>
        <Button
          variant={sort === "newest" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSort("newest")}
          className={sort === "newest" ? "bg-violet-600/20 text-violet-400 border border-violet-500/30" : ""}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />Newest
        </Button>
        <Button variant="ghost" size="sm">
          <Filter className="w-3.5 h-3.5 mr-1.5" />Filter
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setView("grid")}
            className={cn("p-1.5 rounded transition-colors", view === "grid" ? "text-white bg-white/10" : "text-white/30 hover:text-white")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-1.5 rounded transition-colors", view === "list" ? "text-white bg-white/10" : "text-white/30 hover:text-white")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((frame) => {
            const isSelected = selected.has(frame.id);
            return (
              <div
                key={frame.id}
                onClick={() => toggleSelect(frame.id)}
                className={cn(
                  "group relative rounded-xl overflow-hidden cursor-pointer transition-all",
                  isSelected
                    ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#08080F]"
                    : "hover:ring-1 hover:ring-white/20"
                )}
              >
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-3">
                  <p className="text-[10px] text-white/50 text-center leading-relaxed line-clamp-3">{frame.caption}</p>
                </div>
                <div className="p-2.5 bg-[#0F0F1B] border-t border-white/[0.04]">
                  <p className="text-[10px] text-white/40 truncate mb-1">{frame.jobTitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30">{formatTimestamp(frame.timestamp)}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] text-yellow-400 font-semibold">{frame.score}</span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                      <CheckSquare className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <Badge
                  variant={frame.platform === "YouTube" ? "destructive" : "info"}
                  className="absolute top-2 left-2 text-[9px] px-1.5 py-0"
                >
                  {frame.platform}
                </Badge>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((frame) => {
            const isSelected = selected.has(frame.id);
            return (
              <div
                key={frame.id}
                onClick={() => toggleSelect(frame.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all",
                  isSelected
                    ? "bg-violet-600/10 border border-violet-500/30"
                    : "bg-[#0F0F1B] border border-white/[0.06] hover:border-white/10"
                )}
              >
                <div className={cn("w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0", isSelected ? "bg-violet-600 border-violet-600" : "border-white/20")}>
                  {isSelected && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <div className="w-20 h-12 bg-slate-800 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">{frame.caption}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-white/30">{frame.jobTitle}</span>
                    <span className="text-xs text-white/20">·</span>
                    <span className="text-xs text-white/30">{formatTimestamp(frame.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-yellow-400 font-semibold">{frame.score}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
