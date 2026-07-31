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

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="modal-root" className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 sm:p-6 overflow-y-auto`}>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`relative z-10 w-full ${maxWidth} max-h-[88vh] overflow-y-auto bg-zinc-950 border border-white/15 rounded-3xl text-left shadow-2xl text-white my-auto`}
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
