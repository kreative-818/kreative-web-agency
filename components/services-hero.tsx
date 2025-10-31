
"use client";

import { motion } from "framer-motion";
import { Code, Settings, Smartphone } from "lucide-react";

const ServicesHero = () => {
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
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive digital solutions designed to elevate your business and drive measurable results
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: Code, title: "Web Development", count: "50+" },
            { icon: Smartphone, title: "Web Applications", count: "25+" },
            { icon: Settings, title: "Automation Projects", count: "15+" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 text-center"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl w-fit mx-auto mb-4">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.count}</h3>
              <p className="text-gray-400">{item.title}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHero;
