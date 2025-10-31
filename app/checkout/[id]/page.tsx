
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Quote {
  id: string;
  service: string;
  price: string;
  description: string;
  status: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real application, you would:
    // 1. Integrate with Stripe or another payment processor
    // 2. Process the payment
    // 3. Send confirmation email
    // 4. Update database

    setSuccess(true);
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quote Not Found</CardTitle>
            <CardDescription>The quote you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription className="text-base">
                Thank you for choosing Kreative Web Agency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We've received your order and will begin work immediately. 
                You'll receive a confirmation email with next steps shortly.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold">{quote.service}</p>
                <p className="text-2xl font-bold text-primary mt-2">{quote.price}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Complete Your Order</h1>
            <p className="text-muted-foreground">You're one step away from getting started!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-semibold">{quote.service}</p>
                </div>
                {quote.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-sm">{quote.description}</p>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{quote.price}</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>What happens next?</strong><br />
                    After payment, our team will contact you within 24 hours to discuss your project details and timeline.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Payment Information</CardTitle>
                <CardDescription>
                  <Lock className="inline h-4 w-4 mr-1" />
                  Secure checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your Company Inc."
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <Label>Payment Method</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      You'll be able to pay via credit card, PayPal, or bank transfer. 
                      Our team will send you a secure payment link.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Complete Order'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By completing this order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
