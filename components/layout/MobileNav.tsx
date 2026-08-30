"use client";

import { X } from "lucide-react";
import type { Module } from "@/features/curriculum/types";
import { Sidebar } from "./Sidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  modules: Module[];
}

export function MobileNav({ isOpen, onClose, modules }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-950 pt-4 pb-4">
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="font-semibold text-slate-200">Curriculum Navigation</span>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar modules={modules} onTopicClick={onClose} />
        </div>
      </div>
    </div>
  );
}
