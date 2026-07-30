"use client";

import { useState } from "react";
import { submitCustomPackage } from "../../lib/api";
import { Sparkles, CheckCircle2 } from "lucide-react";

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

  return (
    <section id="custom-package" className="py-20 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="max-w-4xl mx-auto bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold mb-2">
          <Sparkles className="w-5 h-5" /> Tailor-Made Wildlife Experience
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-4">Request a Custom Safari Package</h2>
        <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-8">
          Need a personal Innova Crysta pickup, multi-day photography jeep, or custom resort arrangements? Dinesh Pandey (&nbsp;
          <a href="tel:9425331205" className="text-amber-400 font-bold hover:underline">
            +91 9425331205
          </a>
          &nbsp;) entertains special personal requests.
        </p>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-bold text-white">Custom Request Received!</h3>
            <p className="text-zinc-400">Dinesh Pandey will call you directly at <strong>{formData.phone}</strong> to design your itinerary.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Your Full Name" required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500" />
            <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500" />
            <input type="tel" placeholder="Phone Number (e.g. 9425331205)" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500" />
            <input type="text" placeholder="Preferred Travel Dates" required value={formData.preferred_dates} onChange={(e) => setFormData({...formData, preferred_dates: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500" />
            <input type="number" placeholder="Budget in INR (₹)" required value={formData.budget_inr} onChange={(e) => setFormData({...formData, budget_inr: e.target.value})} className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500" />
            <textarea placeholder="Describe your special requirements (e.g., Innova Crysta, photography permits, group size)" rows={4} required value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-amber-500"></textarea>

            <button type="submit" className="md:col-span-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-4 rounded-lg transition-all shadow-lg shadow-amber-500/20">
              Submit Custom Request to Dinesh Pandey
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
