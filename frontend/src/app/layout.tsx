import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pandey Tiger Safaris | Bandhavgarh National Park",
  description: "Official tiger safari booking in Bandhavgarh with Dinesh Pandey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}