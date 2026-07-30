import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppConcierge from "../components/ui/WhatsAppConcierge";
import CursorGlow from "../components/ui/CursorGlow";
import ScrollProgress from "../components/ui/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pandey Tiger Safaris | Bandhavgarh & MP Reserves",
  description: "Official MP Tiger Safaris operated by business owner Dinesh Pandey (9425331205). Complete packages, luxury vehicle fleet, and an army of expert licensed guides.",
  keywords: ["Pandey Tiger Safaris", "Bandhavgarh Tiger Safari", "Dinesh Pandey", "Tala Gate Safari", "Kanha Tiger Reserve", "Innova Crysta Safari Transfer"],
  openGraph: {
    title: "Pandey Tiger Safaris | Bandhavgarh & MP Reserves",
    description: "Book official tiger safaris across Bandhavgarh, Kanha, Pench, Panna & Satpura with Dinesh Pandey (+91 9425331205).",
    url: "https://pandeytigersafaris.com",
    siteName: "Pandey Tiger Safaris",
    images: [
      {
        url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg",
        width: 1200,
        height: 630,
        alt: "Pandey Tiger Safaris Bandhavgarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Pandey Tiger Safaris",
    "image": "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg",
    "telephone": "+919425331205",
    "email": "dinesh@pandeytigersafaris.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tala Gate Road, Near Bandhavgarh National Park",
      "addressLocality": "Umaria",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "484661",
      "addressCountry": "IN"
    },
    "founder": {
      "@type": "Person",
      "name": "Dinesh Pandey"
    }
  };

  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-black text-zinc-100 antialiased selection:bg-orange-500 selection:text-black overflow-x-hidden transform-gpu`}>
        <ScrollProgress />
        <CursorGlow />
        <Navbar />
        <div className="pt-16">{children}</div>
        <WhatsAppConcierge />
        <Footer />
      </body>
    </html>
  );
}
