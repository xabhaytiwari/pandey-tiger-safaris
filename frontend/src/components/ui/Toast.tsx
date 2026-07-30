"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = "success", isOpen, onClose }: ToastProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] px-4 pointer-events-none w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="pointer-events-auto bg-zinc-900/90 border border-white/15 backdrop-blur-2xl text-white px-4 py-3 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            {type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {type === "error" && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            {type === "info" && <Info className="w-4 h-4 text-orange-400 flex-shrink-0" />}
            <span className="font-medium text-zinc-200 leading-snug">{message}</span>
          </div>

          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
