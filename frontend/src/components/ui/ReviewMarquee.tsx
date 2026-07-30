"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function ReviewMarquee({ reviews = [] }: { reviews?: any[] }) {
  const displayReviews = reviews.length > 0 ? reviews : [
    { id: "1", author: "Ananya Sharma", location: "Delhi, India", rating: 5, comment: "Dinesh Pandey (+91 9425331205) organized our entire package. We spotted 3 tigers at Tala Gate!" },
    { id: "2", author: "Mark Robeson", location: "London, UK", rating: 5, comment: "Top class safari booking. The Innova Crysta pickup was punctual and driver Ramesh is brilliant." },
    { id: "3", author: "Suresh Kothari", location: "Mumbai, India", rating: 5, comment: "Booked a Force Traveller for our family of 10. Seamless experience from station to jungle gates." },
    { id: "4", author: "Dr. Vikram Adani", location: "Bengaluru, India", rating: 5, comment: "Dinesh Pandey's team arranged the best forest guides. Unforgettable Bandhavgarh expedition!" }
  ];

  return (
    <div className="py-12 overflow-hidden bg-zinc-950/60 border-y border-white/10 relative">
      <div className="text-center mb-8 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-orange-500 font-bold">Guest Testimonials</span>
        <h3 className="text-2xl font-bold text-white">What Safari Travelers Say</h3>
      </div>

      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {[...displayReviews, ...displayReviews].map((rev, idx) => (
            <div
              key={idx}
              className="inline-block w-80 md:w-96 bg-black border border-white/10 rounded-2xl p-6 space-y-3 whitespace-normal shadow-xl flex-shrink-0 hover:border-orange-500/40 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-4 h-4 text-orange-500/40" />
              </div>
              <p className="text-zinc-300 italic text-xs leading-relaxed">&quot;{rev.comment}&quot;</p>
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs font-bold text-white">{rev.author}</p>
                <p className="text-[10px] text-zinc-500">{rev.location}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
