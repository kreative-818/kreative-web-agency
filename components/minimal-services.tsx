
"use client";

import { motion } from "framer-motion";
import { Globe, Code, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "Websites",
    outcome: "A professional online presence that converts visitors into customers",
    features: ["Lead capture built-in", "Mobile-optimized", "Fast & secure", "AI chatbot included"],
    href: "/pricing?tab=websites",
  },
  {
    icon: Code,
    title: "Web Apps",
    outcome: "Custom applications that automate your workflows and scale with you",
    features: ["Tailored to your needs", "User-friendly dashboards", "Secure & scalable", "Ongoing support"],
    href: "/pricing?tab=web-apps",
  },
  {
    icon: Settings,
    title: "Automations",
    outcome: "Smart systems that work 24/7 to qualify leads and grow your business",
    features: ["AI-powered responses", "Multi-channel (SMS, email, chat)", "Lead qualification", "CRM integration"],
    href: "/pricing?tab=automation",
  },
];

export default function MinimalServices() {
  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            What we build for you
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600"
          >
            Three solutions. One goal: Get you more leads.
          </motion.p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.outcome}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Link href={service.href}>
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
