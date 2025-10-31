
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { Code, Database, Globe, Palette, Search, Shield, Smartphone, Settings, Zap, Cloud, Users, Lock, ArrowRight, Phone } from "lucide-react";

const ServiceDetails = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      title: "Website Development",
      description: "Create stunning, responsive websites that captivate your audience and drive conversions.",
      image: "https://cdn.autonomous.ai/static/upload/images/common/upload/20201015/desk-setup-for-developers-and-programmers_5b681fb881f.jpg",
      features: [
        { icon: Globe, text: "Responsive Design" },
        { icon: Search, text: "SEO Optimization" },
        { icon: Zap, text: "Performance Optimized" },
        { icon: Palette, text: "Custom UI/UX Design" },
        { icon: Shield, text: "Security Best Practices" },
        { icon: Cloud, text: "Cloud Hosting Ready" },
      ],
      deliverables: [
        "Mobile-responsive website",
        "Cross-browser compatibility",
        "SEO-optimized structure",
        "Content management system",
        "Analytics integration",
        "Performance optimization",
      ]
    },
    {
      title: "Web Application Development",
      description: "Build powerful, scalable web applications with advanced functionality tailored to your business needs.",
      image: "https://www.justinmind.com/wp-content/uploads/2018/12/6-best-practices-for-Dashboard-Design-Justinmind-header.png",
      features: [
        { icon: Database, text: "Database Integration" },
        { icon: Users, text: "User Authentication" },
        { icon: Code, text: "Custom Functionality" },
        { icon: Smartphone, text: "Progressive Web App" },
        { icon: Lock, text: "Secure APIs" },
        { icon: Cloud, text: "Scalable Architecture" },
      ],
      deliverables: [
        "Full-stack web application",
        "User management system",
        "Database design & setup",
        "API development",
        "Admin dashboard",
        "Testing & documentation",
      ]
    },
    {
      title: "Automation Services",
      description: "Streamline your business processes with intelligent automation solutions that save time and reduce costs.",
      image: "https://www.auxiliobits.com/wp-content/uploads/2022/09/robotic-process-automation-concept-with-bright-light-scaled-1.jpg",
      features: [
        { icon: Settings, text: "Workflow Automation" },
        { icon: Database, text: "Data Processing" },
        { icon: Code, text: "Custom Scripts" },
        { icon: Cloud, text: "API Integration" },
        { icon: Zap, text: "Real-time Processing" },
        { icon: Shield, text: "Error Handling" },
      ],
      deliverables: [
        "Automated workflows",
        "Integration setup",
        "Custom scripts & tools",
        "Data processing pipelines",
        "Monitoring dashboard",
        "Documentation & training",
      ]
    },
  ];

  return (
    <section className="py-20 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Detailed <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Service</span> Breakdown
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about our comprehensive service offerings
          </p>
        </motion.div>

        <div className="space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Content */}
              <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <h3 className="text-3xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 text-lg mb-8">{service.description}</p>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-4">Key Features</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-4">What You Get</h4>
                  <ul className="space-y-2">
                    {service.deliverables.map((deliverable, deliverableIndex) => (
                      <li key={deliverableIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 flex-shrink-0" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/pricing" 
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group"
                  >
                    View Pricing
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="tel:+17048068682" 
                    className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 group"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Call or Text Us
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} showcase`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
