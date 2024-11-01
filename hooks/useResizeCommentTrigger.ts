// store/recipeStore.ts
import { create } from "zustand";

interface ResizeCommentState {
  resizeCommentTrigger: boolean;
  setResizeCommentTrigger: (trigger: boolean) => void;
}

export const useResizeCommentTrigger = create<ResizeCommentState>((set) => ({
  resizeCommentTrigger: false,

  setResizeCommentTrigger: (triggerVal) => set({ resizeCommentTrigger: triggerVal }),
}));
