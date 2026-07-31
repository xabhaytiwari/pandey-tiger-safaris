"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus } from "lucide-react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "../../lib/firebase";
import { triggerHaptic } from "../../lib/sound";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: any) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    triggerHaptic(12);
    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
        onAuthSuccess({
          name: name || userCred.user.email?.split("@")[0],
          email: userCred.user.email,
          uid: userCred.user.uid
        });
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess({
          name: userCred.user.displayName || userCred.user.email?.split("@")[0],
          email: userCred.user.email,
          uid: userCred.user.uid
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    triggerHaptic(12);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onAuthSuccess({
        name: user.displayName || user.email?.split("@")[0],
        email: user.email,
        uid: user.uid
      });
      onClose();
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Google popup authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* Highest Z-Index z-[999999] so Sign-In opens in front of all other cards & modals */}
      <div className="fixed inset-0 z-[999999] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={() => {
            triggerHaptic(10);
            onClose();
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl" 
        />

        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="relative z-10 w-full max-w-md bg-zinc-950 border border-white/15 rounded-3xl p-6 md:p-8 text-white shadow-2xl text-left my-8"
          >
            <button 
              onClick={() => {
                triggerHaptic(10);
                onClose();
              }} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-orange-500 mb-1">
              {isSignUp ? "Create Safari Account" : "Sign In"}
            </h3>
            <p className="text-zinc-400 text-xs mb-6">Manage your Bandhavgarh safari bookings</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 leading-snug">
                {error}
              </div>
            )}

            {/* Google Sign-In */}
            <button 
              type="button" 
              onClick={handleGoogleAuth} 
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-xl border border-white/10 flex items-center justify-center gap-3 transition-all mb-4 disabled:opacity-50 active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.23v3.15C3.25 21.32 7.32 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.23C.44 8.18 0 9.99 0 12s.44 3.82 1.23 5.39l4.05-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.68 1.23 6.61l4.05 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              {loading ? "Authenticating..." : "Continue with Google"}
            </button>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase font-mono">Or with Email</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignUp && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-xs" 
                />
              )}
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-xs" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-xs" 
              />

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 active:scale-98"
              >
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => {
                  triggerHaptic(10);
                  setIsSignUp(!isSignUp);
                }} 
                className="text-xs text-zinc-400 hover:text-orange-400"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
