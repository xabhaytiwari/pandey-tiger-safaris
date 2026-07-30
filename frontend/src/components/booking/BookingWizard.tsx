"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBooking } from "../../lib/api";
import { Calendar, CheckCircle2 } from "lucide-react";

export default function BookingWizard({ packages = [], cars = [], availability = [] }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    package_id: packages[0]?.id || 1,
    car_id: cars[0]?.id || 1,
    booking_date: availability[0]?.date || "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    guests_count: 2,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking(formData);
    setSubmitted(true);
  };

  return (
    <section id="booking" className="py-20 bg-zinc-900 text-white px-4">
      <div className="max-w-3xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-amber-500 mb-2">Guided Booking Wizard</h2>
        <p className="text-zinc-400 text-center mb-8">Reserve your Bandhavgarh safari slot in 3 easy steps</p>

        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4 text-sm font-medium">
          <span className={step >= 1 ? "text-amber-500" : "text-zinc-600"}>1. Package & Vehicle</span>
          <span className={step >= 2 ? "text-amber-500" : "text-zinc-600"}>2. Pick Date</span>
          <span className={step >= 3 ? "text-amber-500" : "text-zinc-600"}>3. Guest Details</span>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-bold">Booking Request Sent!</h3>
            <p className="text-zinc-400">Dinesh Pandey&apos;s team at Bandhavgarh HQ will contact you shortly to confirm permits.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Choose Tour Package</label>
                    <select
                      value={formData.package_id}
                      onChange={(e) => setFormData({ ...formData, package_id: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500"
                    >
                      {packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>{pkg.title} (${pkg.price})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Choose Vehicle (Car)</label>
                    <select
                      value={formData.car_id}
                      onChange={(e) => setFormData({ ...formData, car_id: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500"
                    >
                      {cars.map((car: any) => (
                        <option key={car.id} value={car.id}>{car.name} ({car.category})</option>
                      ))}
                    </select>
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-lg transition-all">
                    Next: Calendar Availability &rarr;
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <label className="block text-sm font-semibold mb-2">Select Available Date</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availability.map((item: any) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, booking_date: item.date })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.booking_date === item.date
                            ? "bg-amber-500 text-zinc-950 font-bold border-amber-500"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <Calendar className="w-4 h-4 mx-auto mb-1" />
                        {item.date}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/2 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg">Back</button>
                    <button type="button" onClick={() => setStep(3)} disabled={!formData.booking_date} className="w-1/2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-lg disabled:opacity-50">
                      Next: Contact Info &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3"
                  />
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="w-1/2 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg">Back</button>
                    <button type="submit" className="w-1/2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-lg">Confirm Safari</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </div>
    </section>
  );
}
