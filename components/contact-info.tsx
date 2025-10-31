
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, MapPin, MessageCircle, ArrowRight } from "lucide-react";

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="space-y-8"
    >
      {/* Contact Header */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
        <p className="text-gray-300 mb-6">
          We're here to help bring your digital vision to life. Reach out through any of these channels and we'll get back to you quickly.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Email Us</h3>
              <a 
                href="mailto:admin@creativewebagency.com" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                admin@creativewebagency.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl border border-green-600/30 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="text-[10px] font-bold text-green-400 bg-green-900/50 px-2 py-0.5 rounded-full border border-green-600/30">
                24/7 AI SUPPORT
              </span>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-lg animate-pulse">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Call Anytime</h3>
              <a 
                href="tel:984-400-9443" 
                className="text-xl font-bold text-green-400 hover:text-green-300 transition-colors duration-200"
              >
                (984) 400-9443
              </a>
              <p className="text-xs text-gray-400 mt-0.5">Answered by Sona AI - Always available</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Office Hours</h3>
              <p className="text-gray-300">Mon-Fri: 9AM-6PM EST</p>
              <p className="text-xs text-gray-400 mt-1">Phone answered 24/7 by AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button asChild className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-white group relative overflow-hidden">
            <a href="tel:984-400-9443">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Phone className="mr-3 w-5 h-5 relative z-10" />
              <div className="flex-1 text-left relative z-10">
                <div className="font-semibold">Call or Text - AI Answers</div>
                <div className="text-xs text-gray-400">Available 24/7, No voicemail</div>
              </div>
              <ArrowRight className="ml-auto w-4 h-4 relative z-10" />
            </a>
          </Button>
          <Button asChild className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-white">
            <a href="mailto:admin@creativewebagency.com?subject=Project Inquiry">
              <Mail className="mr-3 w-4 h-4" />
              Send Email Directly
              <ArrowRight className="ml-auto w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">What Happens Next?</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mt-1">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white">Initial Consultation</h4>
              <p className="text-gray-400 text-sm">We'll discuss your project requirements and goals within 24 hours.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mt-1">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white">Custom Proposal</h4>
              <p className="text-gray-400 text-sm">Receive a detailed proposal with timeline and transparent pricing.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mt-1">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white">Project Kickoff</h4>
              <p className="text-gray-400 text-sm">We begin development with regular updates and feedback sessions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-600/30">
        <div className="text-center">
          <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <blockquote className="text-gray-300 italic mb-4">
            "Crave Intelligence delivered exceptional results - a premium, AI-powered solution that perfectly represents our brand and drives extraordinary growth."
          </blockquote>
          <cite className="text-blue-400 font-semibold">- Sarah Johnson, Local Business Owner</cite>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
