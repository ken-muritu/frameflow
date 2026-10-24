import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandKit, ExtractionJob, Frame, User } from "@/types";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;

  activeJob: ExtractionJob | null;
  setActiveJob: (job: ExtractionJob | null) => void;
  updateJobProgress: (id: string, progress: number, message?: string) => void;

  selectedFrames: Set<string>;
  toggleFrameSelection: (frameId: string) => void;
  selectAllFrames: (frameIds: string[]) => void;
  clearFrameSelection: () => void;

  brandKit: BrandKit | null;
  setBrandKit: (kit: BrandKit | null) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  recentJobs: ExtractionJob[];
  addRecentJob: (job: ExtractionJob) => void;

  galleryView: "grid" | "list";
  setGalleryView: (view: "grid" | "list") => void;

  gallerySort: "ai_score" | "timestamp" | "newest";
  setGallerySort: (sort: "ai_score" | "timestamp" | "newest") => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      activeJob: null,
      setActiveJob: (job) => set({ activeJob: job }),
      updateJobProgress: (id, progress, message) =>
        set((state) => ({
          activeJob:
            state.activeJob?.id === id
              ? { ...state.activeJob, progress, progress_message: message }
              : state.activeJob,
        })),

      selectedFrames: new Set(),
      toggleFrameSelection: (frameId) =>
        set((state) => {
          const next = new Set(state.selectedFrames);
          if (next.has(frameId)) {
            next.delete(frameId);
          } else {
            next.add(frameId);
          }
          return { selectedFrames: next };
        }),
      selectAllFrames: (frameIds) =>
        set({ selectedFrames: new Set(frameIds) }),
      clearFrameSelection: () => set({ selectedFrames: new Set() }),

      brandKit: null,
      setBrandKit: (kit) => set({ brandKit: kit }),

      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      recentJobs: [],
      addRecentJob: (job) =>
        set((state) => ({
          recentJobs: [job, ...state.recentJobs].slice(0, 20),
        })),

      galleryView: "grid",
      setGalleryView: (view) => set({ galleryView: view }),

      gallerySort: "ai_score",
      setGallerySort: (sort) => set({ gallerySort: sort }),
    }),
    {
      name: "frameflow-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        galleryView: state.galleryView,
        gallerySort: state.gallerySort,
        brandKit: state.brandKit,
      }),
    }
  )
);
