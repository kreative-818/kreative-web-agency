
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const AboutHero = () => {
  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Crave Intelligence</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We are an elite team of AI specialists, developers, and strategists dedicated to creating intelligent, premium digital solutions that transform businesses and drive extraordinary results.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-1">5+</h3>
                <p className="text-gray-400 text-sm">Years Experience</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-1">100+</h3>
                <p className="text-gray-400 text-sm">Projects Delivered</p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              <Image
                src="https://4e6341d0.delivery.rocketcdn.me/wp-content/uploads/2025/09/Team-of-young-professionals.png.webp"
                alt="Crave Intelligence team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
