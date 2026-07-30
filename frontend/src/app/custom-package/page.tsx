"use client";

export const dynamic = "force-dynamic";

import CustomPackage from "../../components/sections/CustomPackage";

export default function CustomPackagePage() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <CustomPackage />
    </main>
  );
}
