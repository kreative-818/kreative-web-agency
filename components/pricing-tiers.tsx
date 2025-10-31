
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const PricingTiers = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const tiers = [
    {
      name: "Starter Package",
      price: "$299-499",
      description: "Perfect for small businesses and startups",
      features: [
        "5-page responsive website",
        "Mobile-friendly design",
        "Basic SEO optimization",
        "Contact form integration",
        "Social media links",
        "2 rounds of revisions",
        "30-day support",
      ],
      popular: false,
    },
    {
      name: "Professional Package",
      price: "$800-1500",
      description: "Ideal for growing businesses",
      features: [
        "10-page custom website",
        "Advanced UI/UX design",
        "Content management system",
        "SEO optimization",
        "Analytics integration",
        "Custom functionality",
        "E-commerce ready",
        "90-day support",
      ],
      popular: true,
    },
    {
      name: "Premium Package",
      price: "$2000-4000",
      description: "For complex business requirements",
      features: [
        "Unlimited pages",
        "Full custom design",
        "E-commerce platform",
        "Advanced integrations",
        "Database design",
        "User authentication",
        "Custom web application",
        "6-month support",
      ],
      popular: false,
    },
  ];

  const additionalServices = [
    { service: "Website Redesign", price: "$500-2000" },
    { service: "SEO Services", price: "$300-1000/month" },
    { service: "Hosting & Maintenance", price: "$50-200/month" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Transparent <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect package for your business needs. All prices include professional development and testing.
          </p>
        </motion.div>

        {/* Main Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border ${
                tier.popular
                  ? "border-blue-500/50 shadow-2xl shadow-blue-500/20"
                  : "border-gray-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">{tier.price}</div>
                <p className="text-gray-400">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  tier.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Link href="/get-started">Get Started</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">Additional Services</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((item, index) => (
              <div
                key={item.service}
                className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <h4 className="text-lg font-semibold text-white mb-2">{item.service}</h4>
                <div className="text-2xl font-bold text-blue-400">{item.price}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Need a custom solution? Contact us for a personalized quote.
          </p>
          <Button asChild size="lg" variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
            <Link href="/get-started">Request Custom Quote</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingTiers;
