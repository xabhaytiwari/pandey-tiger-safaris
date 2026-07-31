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
  zIndex = "z-[99999]",
  maxWidth = "max-w-2xl" 
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is active
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
        <div className={`fixed inset-0 ${zIndex} overflow-y-auto`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Centering Wrapper */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-3xl bg-zinc-950 border border-white/15 text-left align-middle shadow-2xl my-8 text-white`}
            >
              {/* Close Button */}
              <button
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
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
