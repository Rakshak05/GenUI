import { ReactNode } from "react";

interface TodoAppLayoutProps {
  chat: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panel: (onClose: () => void) => ReactNode;
}

export function TodoAppLayout({
  chat,
  open,
  onOpenChange,
  panel,
}: TodoAppLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50/50">
      {/* Main Chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-bold text-gray-800 text-lg tracking-tight">Antigravity GenUI Assistant</h1>
          </div>
          <button
            onClick={() => onOpenChange(!open)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            {open ? "Hide Checklist" : "Show Checklist"}
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-50">{chat}</div>
      </div>

      {/* Slide-in panel for todos checklist */}
      <div
        className={`border-l border-gray-100 bg-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out z-20 h-full ${
          open ? "w-96 translate-x-0" : "w-0 translate-x-full overflow-hidden"
        }`}
      >
        {open && panel(() => onOpenChange(false))}
      </div>
    </div>
  );
}
