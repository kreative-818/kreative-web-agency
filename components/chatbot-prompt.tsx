
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function ChatbotPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed
    const dismissed = localStorage.getItem("chatbotPromptDismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show prompt after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("chatbotPromptDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-24 right-6 z-40 max-w-sm"
        >
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-5 pr-12 relative">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Losing customers to Google?</h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  Chat with our AI assistant 24/7 to see how we can help you show up on Google and stop losing money to competitors!
                </p>
              </div>
            </div>

            {/* Animated Pulse */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
