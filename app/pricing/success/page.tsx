
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Mail, MessageSquare, Calendar, User } from "lucide-react";
import Link from "next/link";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Process the payment and trigger onboarding
      processPayment(sessionId);
    }
  }, [sessionId]);

  const processPayment = async (sessionId: string) => {
    try {
      const response = await fetch("/api/checkout/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const result = await response.json();
      setData(result);
      setSuccess(true);
    } catch (error) {
      console.error("Payment processing error:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white text-xl">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-lg bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-red-500">Payment Processing Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              We encountered an issue processing your payment. Please contact us for assistance.
            </p>
            <Link href="tel:+17048068682">
              <Button className="w-full bg-primary">Call Us: (704) 806-8682</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Welcome to Kreative Intelligence!
          </h1>
          <p className="text-xl text-slate-300">
            Your payment was successful. We're excited to start building your project!
          </p>
        </div>

        {/* What Happens Next */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Check Your Email</h3>
                <p className="text-slate-400">
                  We've sent a welcome email to <strong>{data?.email}</strong> with your project details and portal login credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">SMS Confirmation</h3>
                <p className="text-slate-400">
                  You'll receive a text message at <strong>{data?.phone}</strong> confirming your project start.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Kickoff Call Scheduled</h3>
                <p className="text-slate-400">
                  We'll contact you within 24 hours to schedule your project kickoff meeting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Client Portal Access</h3>
                <p className="text-slate-400">
                  Track your project progress, view updates, and communicate with our team through your dedicated portal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href={data?.portalUrl || "/portal/login"}>
            <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
              Access Your Portal
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full border-slate-700" size="lg">
              Return Home
            </Button>
          </Link>
        </div>

        {/* Project Summary */}
        {data && (
          <Card className="mt-8 bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Business Name:</p>
                  <p className="text-white font-semibold">{data.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Package:</p>
                  <p className="text-white font-semibold">{data.packageName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Investment:</p>
                  <p className="text-white font-semibold">${data.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">Expected Timeline:</p>
                  <p className="text-white font-semibold">{data.timeline || "2-4 weeks"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <div className="mt-8 text-center text-slate-400">
          <p>Questions? Need help?</p>
          <p className="mt-2">
            Call or text us at{" "}
            <a href="tel:+17048068682" className="text-primary font-semibold hover:underline">
              (704) 806-8682
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
