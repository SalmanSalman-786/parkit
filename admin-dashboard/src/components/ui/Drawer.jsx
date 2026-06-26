import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ isOpen, onClose, title, children }) {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform duration-300 ease-out bg-slate-900/95 backdrop-blur-lg border-l border-slate-850 text-slate-100 shadow-2xl flex flex-col h-full animate-slide-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-855 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
