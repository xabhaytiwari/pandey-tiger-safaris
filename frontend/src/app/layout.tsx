import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Pandey Tiger Safaris | Bandhavgarh & MP Reserves",
  description: "Official MP Tiger Safaris operated by business owner Dinesh Pandey (9425331205).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-black text-zinc-100 antialiased selection:bg-orange-500 selection:text-black overflow-x-hidden">
        <Navbar />
        <div className="pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
