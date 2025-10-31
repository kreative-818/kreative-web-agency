
"use client";

import { motion } from "framer-motion";
import { Eye, Github, ExternalLink } from "lucide-react";

const PortfolioHero = () => {
  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Portfolio</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Explore our collection of successful projects showcasing innovative web solutions across various industries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: Eye, title: "Projects Completed", count: "100+" },
            { icon: Github, title: "Lines of Code", count: "500K+" },
            { icon: ExternalLink, title: "Happy Clients", count: "50+" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl w-fit mx-auto mb-4">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.count}</h3>
              <p className="text-slate-600">{item.title}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioHero;
