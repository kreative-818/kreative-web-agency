"use client";

import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          Privacy Policy
        </h1>
        <div className="max-w-none">
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong>{" "}October 20, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                Kreative Web Agency (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address, phone number, business name, and other contact details you provide when submitting forms or contacting us.
                </li>
                <li>
                  <strong>Project Information:</strong> Details about your website or web application requirements, budget, timeline, and preferences.
                </li>
                <li>
                  <strong>Technical Information:</strong> IP address, browser type, device information, and website usage data collected through cookies and similar technologies.
                </li>
                <li>
                  <strong>Communication Data:</strong> Records of your communications with us, including emails, phone calls, and text messages.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>To provide, maintain, and improve our services</li>
                <li>To communicate with you about your projects and service requests</li>
                <li>To send you updates, newsletters, and marketing communications (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To analyze website usage and improve user experience</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who assist us in providing services (e.g., hosting, analytics, payment processing)
                </li>
                <li>
                  <strong>Legal Compliance:</strong> When required by law or to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access and request a copy of your personal information</li>
                <li>Correct or update your information</li>
                <li>Request deletion of your information (subject to legal obligations)</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to or restrict certain processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Email:</strong> support@kreativewebagency.com
                </p>
                <p>
                  <strong>Phone:</strong> 984-400-9443
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
