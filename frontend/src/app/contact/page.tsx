"use client";

import { useState, useEffect } from "react";
import { fetchFromAPI } from "../../lib/api";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    fetchFromAPI("/contact").then((data) => setContact(data));
  }, []);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Bandhavgarh Headquarters</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Dinesh Pandey</h1>
        <p className="text-zinc-400 text-sm">Direct inquiries, safari permits, and transport transfers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center space-y-3 backdrop-blur-md shadow-2xl">
          <Phone className="w-8 h-8 text-orange-500 mx-auto" />
          <h4 className="font-bold text-white">Direct Mobile</h4>
          <a href="tel:9425331205" className="text-orange-500 font-bold block hover:underline text-sm">+91 9425331205</a>
        </div>

        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center space-y-3 backdrop-blur-md shadow-2xl">
          <Mail className="w-8 h-8 text-orange-500 mx-auto" />
          <h4 className="font-bold text-white">Email Address</h4>
          <p className="text-zinc-400 text-xs">{contact?.email || "dinesh@pandeytigersafaris.com"}</p>
        </div>

        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center space-y-3 backdrop-blur-md shadow-2xl">
          <MapPin className="w-8 h-8 text-orange-500 mx-auto" />
          <h4 className="font-bold text-white">Headquarters</h4>
          <p className="text-zinc-400 text-xs">{contact?.hq_address || "Tala Gate, Bandhavgarh, MP, India"}</p>
        </div>
      </div>
    </main>
  );
}
