"use client";

import { useState, useEffect } from "react";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <div className="max-w-none">
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800 space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong>{" "}October 20, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the services provided by Kreative Web Agency (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Services</h2>
              <p>
                Kreative Web Agency provides web development, web application development, and automation services. The specific scope of work will be defined in separate project agreements or proposals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Project Agreements</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All projects require a signed agreement or written acceptance of a proposal</li>
                <li>Project scope, timeline, and pricing will be outlined in the project agreement</li>
                <li>Changes to the project scope may result in additional fees and timeline adjustments</li>
                <li>Client approval is required at designated milestones before proceeding</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment terms will be specified in the project agreement</li>
                <li>A deposit may be required before work begins</li>
                <li>Final payment is due upon project completion or as specified in the agreement</li>
                <li>Late payments may incur additional fees</li>
                <li>All prices are in USD unless otherwise specified</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Client Responsibilities</h2>
              <p>Clients agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide necessary content, materials, and information in a timely manner</li>
                <li>Respond to requests for feedback and approvals within agreed timeframes</li>
                <li>Ensure all provided content is original or properly licensed</li>
                <li>Maintain confidentiality of login credentials and access information</li>
                <li>Pay all fees according to the payment terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upon full payment, clients receive ownership of the final deliverables as specified in the project agreement</li>
                <li>We retain the right to display completed work in our portfolio unless otherwise agreed</li>
                <li>Third-party components, plugins, or tools may have separate licensing terms</li>
                <li>Clients warrant that all materials provided do not infringe on third-party rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Revisions and Support</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>The number of included revisions will be specified in the project agreement</li>
                <li>Additional revisions beyond the agreed scope may incur extra charges</li>
                <li>Post-launch support terms will be outlined in the project agreement</li>
                <li>Ongoing maintenance and hosting may require separate agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Timeline and Delays</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Project timelines are estimates and may be affected by client responsiveness and unforeseen circumstances</li>
                <li>Delays caused by client (late content, delayed approvals) may extend the project timeline</li>
                <li>We will make reasonable efforts to meet agreed deadlines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Warranties and Disclaimers</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We provide services using reasonable skill and care</li>
                <li>Services are provided &quot;as is&quot; without warranties of any kind</li>
                <li>We do not guarantee specific results, rankings, or traffic from our services</li>
                <li>Website performance may vary based on hosting, content, and external factors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Kreative Web Agency shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Either party may terminate a project agreement as specified in the agreement</li>
                <li>Client remains responsible for payment for work completed up to termination date</li>
                <li>We reserve the right to refuse service to anyone for any lawful reason</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Confidentiality</h2>
              <p>
                Both parties agree to keep confidential information disclosed during the project confidential and not to use it for any purpose other than fulfilling the project obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of North Carolina, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us:</p>
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
