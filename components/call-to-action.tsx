
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

const CallToAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Digital Presence?</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together. Get started with a free consultation today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-3 group">
            <Link href="/get-started">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-3 group">
            <Link href="/portfolio">
              <MessageSquare className="mr-2 w-5 h-5" />
              View Portfolio
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
