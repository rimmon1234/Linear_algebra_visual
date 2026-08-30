"use client";

import { useState } from "react";
import { getAllModules } from "@/features/curriculum/queries";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Menu } from "lucide-react";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getAllModules();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)]">
      {/* Mobile drawer toggle bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <span className="font-semibold text-slate-300">Curriculum Navigation</span>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700"
          aria-label="Open curriculum menu"
        >
          <Menu className="h-3.5 w-3.5" />
          <span>Modules</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        modules={modules}
      />

      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        <Sidebar modules={modules} />
      </div>

      {/* Main Content Area: Expansive widescreen layout with balanced padding */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-[1560px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
