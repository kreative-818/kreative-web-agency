
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function MinimalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight"
          >
            Ready to be seen?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto"
          >
            Start your project today. No pressure, no commitments.
            <br />
            Just a conversation about your goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 transition-all"
            >
              <Link href="/get-started">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-slate-300 hover:border-slate-400 text-slate-900 px-8 py-6 text-lg rounded-xl bg-white/80 backdrop-blur-sm"
            >
              <Link href="tel:+19844009443">
                <Phone className="mr-2 w-5 h-5" />
                (984) 400-9443
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
