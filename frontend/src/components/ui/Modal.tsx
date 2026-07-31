"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: string;
  maxWidth?: string;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  zIndex = "z-[999999]",
  maxWidth = "max-w-2xl" 
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="modal-wrapper-div" className={`fixed inset-0 ${zIndex} overflow-y-auto bg-black/85 backdrop-blur-xl p-4 flex items-center justify-center min-h-screen`}>
          {/* Backdrop Click Dismiss */}
          <div
            key="modal-backdrop"
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="fixed inset-0 z-0 cursor-pointer"
          />

          {/* Modal Card - Scrollable */}
          <motion.div
            key="modal-card-body"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`relative z-10 w-full ${maxWidth} max-h-[88vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-white/15 text-left shadow-2xl text-white my-auto p-1`}
          >
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                onClose();
              }}
              className="absolute top-3 right-3 z-30 bg-black/80 hover:bg-black p-2.5 rounded-full text-white hover:text-orange-400 border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
