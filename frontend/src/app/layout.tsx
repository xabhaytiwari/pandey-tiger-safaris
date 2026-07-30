import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Pandey Tiger Safaris | Bandhavgarh",
  description: "Official Bandhavgarh Tiger Safaris guided by founder Dinesh Pandey (9425331205).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-black text-zinc-100 antialiased selection:bg-amber-500 selection:text-black">
        <Navbar />
        <div className="pt-24">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
