
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo-transparent.png"
                alt="Kreative Intelligence Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base lg:text-lg text-slate-900">
                Kreative Intelligence
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 -mt-0.5">
                by <span className="text-blue-600 font-medium">Divitiae Innovations</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <a 
              href="tel:984-400-9443" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-green-600 transition-colors duration-200 group ml-2"
            >
              <Phone className="h-4 w-4 group-hover:animate-pulse" />
              <span className="font-semibold">(984) 400-9443</span>
            </a>
            <Button 
              asChild 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white ml-2"
            >
              <Link href="/pricing">Get Started</Link>
            </Button>
          </div>

          {/* Mobile - Phone and Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <a 
              href="tel:984-400-9443" 
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 hover:text-green-600 transition-colors duration-200 group"
            >
              <Phone className="h-4 w-4 group-hover:animate-pulse" />
            </a>
            <Button 
              asChild 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3"
            >
              <Link href="/pricing">Get Started</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 hover:bg-slate-100"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200 rounded-b-xl shadow-lg"
          >
            <div className="px-4 py-5 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-200">
                <a 
                  href="tel:984-400-9443" 
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-green-600 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  <Phone className="h-4 w-4" />
                  <span>(984) 400-9443</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
