
import { Metadata } from "next";
import { Suspense } from "react";
import ProjectIntakeForm from "@/components/project-intake-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Started | Kreative Intelligence",
  description: "Ready to start your project? Fill out our project intake form and we'll reach out to discuss your needs.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50/30 py-16 px-4">
      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Let's Get Started!
          </h1>
          <p className="text-xl text-slate-700">
            Tell us about your project and we'll reach out to discuss next steps
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-slate-900">Loading...</div>}>
          <ProjectIntakeForm />
        </Suspense>
      </div>
    </div>
  );
}
