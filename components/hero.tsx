
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle, Zap, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950">
        <div className="relative w-full h-full">
          <Image
            src="https://thumbs.dreamstime.com/b/modern-workspace-computer-screen-displaying-code-vibrant-lighting-showing-stylish-colorful-ambiance-lit-warm-red-368956212.jpg"
            alt="Modern tech workspace"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-slate-900/60 to-slate-950/80" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-6">
            <span className="bg-blue-500/20 border border-blue-400/50 rounded-full px-6 py-2 text-sm font-semibold text-blue-300">
              🚀 Professional Web Development & Marketing
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Build a Website That <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Actually Brings Customers</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto leading-relaxed">
            Professional websites, AI automation, and marketing services built for NC businesses. Get found on Google, capture more leads, and grow faster.
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            <span className="text-blue-400 font-bold">Starting at $997</span> — Built in 7-14 days with rush options available
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-4 justify-center items-center mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-10 py-6 group shadow-2xl shadow-blue-500/50">
              <Link href="/quote/index.html">
                Get Your Free Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-lg px-10 py-6 transition-all duration-300">
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10 text-base">
              <a href="tel:+19844009443">
                <Phone className="mr-2 w-4 h-4" />
                Or Call/Text: (984) 400-9443
              </a>
            </Button>
            <p className="text-gray-500 text-sm">💬 AI chat available 24/7 below ↘</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-8 text-sm text-gray-300 mb-16 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>✓ Currently serving 13+ active clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>✓ Built in 7-14 Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>✓ Rush Delivery Available</span>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
            <div className="bg-blue-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">Fast Turnaround</h3>
            <p className="text-gray-400 text-sm">7-14 day delivery with rush options. No months-long waits.</p>
          </div>
          
          <div className="bg-cyan-900/30 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30">
            <div className="bg-cyan-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">100% Satisfaction</h3>
            <p className="text-gray-400 text-sm">30-day money-back guarantee. We stand behind our work.</p>
          </div>
          
          <div className="bg-teal-900/30 backdrop-blur-lg rounded-xl p-6 border border-teal-500/30">
            <div className="bg-teal-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">Full-Service Support</h3>
            <p className="text-gray-400 text-sm">From design to deployment, we handle everything for you.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
