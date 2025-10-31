
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircle, Clock, DollarSign, Users, Award, Zap } from "lucide-react";

const TrustIndicators = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: CheckCircle,
      title: "Quality Guaranteed",
      description: "Every project undergoes rigorous testing and quality assurance to ensure excellence.",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "We pride ourselves on rapid development without compromising on quality.",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Competitive rates with transparent pricing and no hidden fees.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled developers and designers with years of industry experience.",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Successful track record of delivered projects across various industries.",
    },
    {
      icon: Zap,
      title: "Cutting-Edge Tech",
      description: "We use the latest technologies and best practices for optimal performance.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Us</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We deliver exceptional results that exceed expectations and drive business growth
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
