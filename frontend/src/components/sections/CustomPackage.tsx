"use client";

import { useState } from "react";
import { submitCustomPackage } from "../../lib/api";
import { Sparkles, CheckCircle2, MessageSquare, Phone } from "lucide-react";

export default function CustomPackage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    preferred_dates: "",
    budget_inr: "",
    requirements: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCustomPackage({
      ...formData,
      budget_inr: Number(formData.budget_inr) || 0
    });
    setSubmitted(true);
  };

  const whatsappText = encodeURIComponent(
    `*CUSTOM SAFARI REQUEST*\n\n` +
    `*Guest:* ${formData.customer_name}\n` +
    `*Phone:* ${formData.phone}\n` +
    `*Dates:* ${formData.preferred_dates}\n` +
    `*Budget:* ₹${formData.budget_inr}\n` +
    `*Requirements:* ${formData.requirements}`
  );

  const whatsappUrl = `https://wa.me/919425331205?text=${whatsappText}`;

  return (
    <section id="custom-package" className="py-12 bg-black text-white">
      <div className="max-w-4xl mx-auto bg-zinc-900/40 border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-medium text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" /> Tailor-Made Itinerary
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-3">Request Custom Safari</h2>
        <p className="text-zinc-400 text-center text-sm max-w-xl mx-auto mb-8">
          Personal Innova Crysta pickups, Force Travellers, or multi-day photography jeeps. Dinesh Pandey (+91 9425331205) reviews every custom request.
        </p>

        {submitted ? (
          <div className="text-center py-8 space-y-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Custom Request Saved!</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                Send a copy directly to Dinesh Pandey on WhatsApp to start planning immediately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Dinesh Pandey
              </a>
              <a
                href="tel:9425331205"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm"
              >
                <Phone className="w-4 h-4 text-amber-400" /> Call +91 9425331205
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Your Full Name" required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" />
            <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" />
            <input type="tel" placeholder="Phone Number (e.g. 9876543210)" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" />
            <input type="text" placeholder="Preferred Travel Dates" required value={formData.preferred_dates} onChange={(e) => setFormData({...formData, preferred_dates: e.target.value})} className="bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" />
            <input type="number" placeholder="Estimated Budget in INR (₹)" required value={formData.budget_inr} onChange={(e) => setFormData({...formData, budget_inr: e.target.value})} className="md:col-span-2 bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm" />
            <textarea placeholder="Special requirements (e.g., Innova Crysta, photography jeeps, group size)" rows={4} required value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} className="md:col-span-2 bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm"></textarea>

            <button type="submit" className="md:col-span-2 bg-white text-black font-bold py-4 rounded-xl transition-all text-sm">
              Submit Custom Request
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
