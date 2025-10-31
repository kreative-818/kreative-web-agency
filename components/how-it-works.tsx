
"use client";

import { motion } from "framer-motion";
import { Phone, FileText, Rocket } from "lucide-react";

const steps = [
  {
    icon: Phone,
    title: "Quick Chat",
    description:
      "We chat for 10 minutes, figure out exactly what you need, and give you a ballpark price right on the spot.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Simple Questionnaire",
    description:
      "Just a few quick questions about colors, vibe, and features. Nothing crazy—we make it painless.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "Build & Launch",
    description:
      "We build it, you review it, we tweak it together, and boom—you're live in 7-14 days. Need it faster? We offer rush delivery!",
    color: "from-orange-500 to-red-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No confusing proposals. No back-and-forth for weeks. Just fast,
            clean, and done.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {index + 1}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full relative overflow-hidden group">
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 relative z-10`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-y-1/2 z-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/get-started"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Started Now
            <Rocket className="w-5 h-5" />
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            First consultation is free. No commitment required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
