

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Kreative Intelligence Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900">Kreative Intelligence</div>
                <div className="text-xs text-slate-500 -mt-1">by Divitiae Innovations</div>
              </div>
            </Link>
            <p className="text-slate-600 text-sm">
              Building digital solutions that help businesses be seen, heard, and remembered.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/services" className="block text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm">
                Services
              </Link>
              <Link href="/portfolio" className="block text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm">
                Portfolio
              </Link>
              <Link href="/pricing" className="block text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm">
                Pricing
              </Link>
              <Link href="/about" className="block text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm">
                About
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Get in touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:support@kreativewebagency.com" className="text-sm">
                  support@kreativewebagency.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 hover:text-green-600 transition-colors duration-200 group">
                <Phone className="w-4 h-4 flex-shrink-0 group-hover:animate-pulse" />
                <a href="tel:984-400-9443" className="text-sm font-semibold">
                  (984) 400-9443
                </a>
              </div>
              <p className="text-xs text-slate-500 ml-6">Call, text, or chat anytime</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 Kreative Intelligence. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-900 text-sm transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-900 text-sm transition-colors duration-200">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

