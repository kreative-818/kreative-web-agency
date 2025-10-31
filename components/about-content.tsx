
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Clock, DollarSign, Heart, Lightbulb, Users } from "lucide-react";

const AboutContent = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We embrace cutting-edge technologies and creative solutions to deliver exceptional results.",
    },
    {
      icon: Users,
      title: "Client-Focused",
      description: "Your success is our success. We work closely with clients to understand and exceed expectations.",
    },
    {
      icon: Award,
      title: "Quality Driven",
      description: "We maintain the highest standards in every project, ensuring excellence in design and functionality.",
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      description: "We respect deadlines and deliver projects on time without compromising quality.",
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description: "Transparent, competitive pricing with no hidden fees. Great value for exceptional work.",
    },
    {
      icon: Heart,
      title: "Passionate Team",
      description: "We love what we do and it shows in every project we deliver.",
    },
  ];

  return (
    <section className="py-20 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Mission</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            To empower businesses with stunning, high-performance digital solutions that drive growth, enhance user experience, and deliver measurable results.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Story</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">How We Started</h4>
              <p className="text-gray-300 mb-6">
                Crave Intelligence was born from a vision: to harness the power of AI and cutting-edge technology to transform businesses. 
                Founded by expert developers and strategists who saw the potential of intelligent automation, 
                we set out to deliver premium, AI-powered solutions that drive extraordinary results for ambitious businesses.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Where We're Going</h4>
              <p className="text-gray-300">
                Today, we're at the forefront of AI-powered web development, combining machine learning, intelligent automation, 
                and premium craftsmanship to create solutions that don't just meet expectations—they exceed them. Our commitment to innovation, 
                strategic thinking, and delivering measurable results defines everything we do.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expertise Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-white !text-white">Our Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Frontend Development",
              "Backend Development", 
              "Database Design",
              "UI/UX Design",
              "E-commerce Solutions",
              "API Integration",
              "Performance Optimization",
              "SEO & Marketing",
            ].map((skill, index) => (
              <div
                key={skill}
                className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-medium text-white !text-white">{skill}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContent;
