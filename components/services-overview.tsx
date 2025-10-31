
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, Settings, Smartphone } from "lucide-react";

const ServicesOverview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: Globe,
      title: "Website Development",
      description: "Custom websites that captivate audiences and drive conversions. From simple landing pages to complex e-commerce platforms.",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Modern UI/UX"],
      image: "https://cdn.autonomous.ai/static/upload/images/common/upload/20201015/desk-setup-for-developers-and-programmers_5b681fb881f.jpg"
    },
    {
      icon: Smartphone,
      title: "Web Applications",
      description: "Powerful, scalable web applications built with cutting-edge technologies to streamline your business operations.",
      features: ["Custom Functionality", "Database Integration", "User Authentication", "Cloud Hosting"],
      image: "https://www.justinmind.com/wp-content/uploads/2018/12/6-best-practices-for-Dashboard-Design-Justinmind-header.png"
    },
    {
      icon: Settings,
      title: "Automation Services",
      description: "Intelligent automation solutions that reduce manual work and increase efficiency across your business processes.",
      features: ["Workflow Automation", "API Integration", "Data Processing", "Custom Scripts"],
      image: "https://www.auxiliobits.com/wp-content/uploads/2022/09/robotic-process-automation-concept-with-bright-light-scaled-1.jpg"
    },
  ];

  return (
    <section className="py-20 bg-gray-900" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We provide comprehensive digital solutions to help your business thrive in the modern landscape
          </p>
        </motion.div>

        <div className="grid gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} showcase`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
            <Link href="/services/index.html">Explore All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
