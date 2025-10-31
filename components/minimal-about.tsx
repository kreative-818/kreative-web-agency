
"use client";

import { motion } from "framer-motion";
import { Heart, Target, Zap } from "lucide-react";

export default function MinimalAbout() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            We believe every business
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              deserves to be seen
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            That's why we build websites and apps that don't just look good—they bring you leads.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our story</h2>
          <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
            <p>
              Founded in Raleigh, NC, <strong className="text-slate-900">Kreative Intelligence</strong> (by Divitiae Innovations) started with a simple observation: 
              too many great businesses were invisible online.
            </p>
            <p>
              They had amazing services, passionate teams, and loyal customers—but their websites? 
              Outdated, slow, or nonexistent. They were losing leads to competitors who simply <em>showed up</em> online.
            </p>
            <p>
              We knew we could fix that. Not with flashy gimmicks or empty promises, but with <strong className="text-slate-900">fast, 
              professional websites that actually convert</strong>.
            </p>
            <p>
              Today, we've helped dozens of businesses—from churches to construction companies, restaurants to real estate agents—
              launch sites that bring them real, measurable leads.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Built with care</h3>
              <p className="text-slate-600">
                Every line of code, every design choice—crafted with the same attention we'd give our own business.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Results-focused</h3>
              <p className="text-slate-600">
                Beautiful design is worthless if it doesn't bring you leads. We measure success in conversions, not compliments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fast delivery</h3>
              <p className="text-slate-600">
                We know you can't wait months for a site. Days to weeks, not months to years—that's our promise.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-slate-50 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our mission</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            To help businesses go from invisible to unavoidable—one beautifully simple, high-converting website at a time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
