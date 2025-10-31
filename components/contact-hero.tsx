
"use client";

import { motion } from "framer-motion";
import { MessageSquare, Phone, Mail } from "lucide-react";

const ContactHero = () => {
  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Grow Your Business?</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            Call us now or fill out the form below. We'll have your professional website live in 7-14 days.
          </p>
          <div className="flex justify-center">
            <a 
              href="tel:+19844009443" 
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold text-2xl px-8 py-4 rounded-lg transition-all duration-200 shadow-xl shadow-green-600/30"
            >
              <Phone className="w-6 h-6 animate-pulse" />
              (984) 400-9443
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { 
              icon: MessageSquare, 
              title: "Live 24/7 Support", 
              description: "AI phone system + human support when you need it" 
            },
            { 
              icon: Phone, 
              title: "Fast Turnaround", 
              description: "Your website live in 7-14 days, guaranteed" 
            },
            { 
              icon: Mail, 
              title: "Real Results", 
              description: "Built to generate leads and grow your business" 
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 text-center"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl w-fit mx-auto mb-4">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHero;
