
"use client";

import { Suspense, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Phone, Clock, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageType, setPageType] = useState<"quote" | "payment">("quote");

  useEffect(() => {
    // Determine page type from URL parameter or default to quote
    const type = searchParams?.get("type");
    if (type === "payment") {
      setPageType("payment");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4 py-24">
      <Card className="max-w-3xl w-full bg-white border-2 border-slate-200 text-center shadow-2xl">
        <CardContent className="pt-16 pb-16">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/50">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            {pageType === "payment" ? "🎉 Payment Confirmed!" : "✅ We've Received Your Request!"}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8">
            {pageType === "payment" 
              ? "Welcome to Kreative Intelligence!" 
              : "Our team will reach out within 24 hours. Get ready to launch something amazing."}
          </p>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 mb-12 text-left max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 p-3 rounded-xl flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold text-lg mb-1">Check Your Email</h3>
                  <p className="text-slate-600">
                    {pageType === "payment"
                      ? "We've sent you a confirmation email with your order details and next steps."
                      : "We've sent you a confirmation email with your quote request details."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold text-lg mb-1">We'll Contact You</h3>
                  <p className="text-slate-600">
                    {pageType === "payment"
                      ? "Our team will reach out to discuss your project details and timeline."
                      : "Our team will review your request and contact you within 24 hours with a custom quote."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-xl flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold text-lg mb-1">Then We Build</h3>
                  <p className="text-slate-600">
                    Once everything is confirmed, we'll get to work building your solution. Most projects are delivered in 7-14 days!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg font-bold px-12"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Homepage
            </Button>
            
            {pageType === "quote" && (
              <div>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/portfolio')}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Explore Our Work
                </Button>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm mb-2">
              <strong className="text-slate-700">Questions?</strong> We're here to help!
            </p>
            <p className="text-slate-500 text-sm">
              Email: <a href="mailto:support@kreativewebagency.com" className="text-blue-600 hover:underline font-semibold">support@kreativewebagency.com</a>
              {" "} | {" "}
              Phone: <a href="tel:+19844009443" className="text-blue-600 hover:underline font-semibold">(984) 400-9443</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
      <p className="text-slate-600">Loading...</p>
    </div>}>
      <ThankYouContent />
    </Suspense>
  );
}
