
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, TrendingUp, Users, DollarSign, Building2, Rocket, CheckCircle2 } from "lucide-react"

export default function RoadmapPage() {
  const phases = [
    {
      number: "00",
      title: "THE BEGINNING",
      subtitle: "Where It All Started",
      timeframe: "Day 1 - Today",
      revenue: "The Dream",
      team: "You + Your Vision",
      clients: "0 clients, infinite potential",
      image: "https://cdn.abacus.ai/images/050e0e3b-6926-43e5-9ce2-5a73b82f42c3.png",
      status: "foundation",
      milestones: [
        "You: The visionary founder",
        "Your Wife: Your biggest supporter",
        "Your Kids: Your WHY",
        "Your Brother: Your partner",
        "The decision to build an empire"
      ],
      bgColor: "from-slate-500/20 to-blue-500/20",
      personal: true
    },
    {
      number: "01",
      title: "FOUNDATION",
      subtitle: "First 10 Clients",
      timeframe: "Months 1-6",
      revenue: "$10K - $50K",
      team: "You, Brother + AI",
      clients: "10 total clients",
      image: "https://cdn.abacus.ai/images/050e0e3b-6926-43e5-9ce2-5a73b82f42c3.png",
      status: "current",
      milestones: [
        "First paying client ✓",
        "Website live with AI chatbot ✓",
        "Phone system operational ✓",
        "FB Ads campaign launching",
        "First team member hired"
      ],
      bgColor: "from-blue-500/20 to-cyan-500/20",
      marketing: "Facebook Ads → Organic Posts → Local Networking"
    },
    {
      number: "02",
      title: "SCALING SYSTEMS",
      subtitle: "10 Clients Per Month",
      timeframe: "Months 7-18",
      revenue: "$100K - $500K/year",
      team: "3-5 employees + contractors",
      clients: "120+ clients",
      image: "https://cdn.abacus.ai/images/99ff7d38-5dec-447a-9414-42299b4d2a44.png",
      status: "next",
      milestones: [
        "Small team assembled",
        "Processes documented",
        "Template library built",
        "$100K milestone hit",
        "First office space"
      ],
      bgColor: "from-cyan-500/20 to-teal-500/20",
      marketing: "Google Ads + Retargeting + SEO"
    },
    {
      number: "03",
      title: "AUTOMATION ENGINE",
      subtitle: "10 Clients Per Week",
      timeframe: "Months 19-36",
      revenue: "$1M - $5M/year",
      team: "10-20 employees",
      clients: "500+ clients",
      image: "https://cdn.abacus.ai/images/72afd0dc-77d5-4e5a-b2d5-62576a771d60.png",
      status: "future",
      milestones: [
        "$1M revenue achieved",
        "80% fulfillment automated",
        "Sales team hired",
        "National presence",
        "Industry recognition"
      ],
      bgColor: "from-teal-500/20 to-green-500/20",
      marketing: "Full Funnel Automation + Partnerships"
    },
    {
      number: "04",
      title: "SAAS PLATFORM",
      subtitle: "10 Clients Per Day",
      timeframe: "Years 4-6",
      revenue: "$10M - $50M/year",
      team: "50-100 employees",
      clients: "3,000+ clients",
      image: "https://cdn.abacus.ai/images/0051c967-5a85-49b2-9e02-977552fd5771.png",
      status: "future",
      milestones: [
        "SaaS platform launched",
        "AI auto-builds websites",
        "$10M ARR milestone",
        "Outperform Lovable",
        "Series A funding"
      ],
      bgColor: "from-green-500/20 to-emerald-500/20",
      marketing: "Product-Led Growth + Enterprise Sales"
    },
    {
      number: "05",
      title: "UNICORN STATUS",
      subtitle: "$1 Billion Valuation",
      timeframe: "Years 7-10",
      revenue: "$100M - $500M/year",
      team: "500+ employees worldwide",
      clients: "100,000+ businesses",
      image: "https://cdn.abacus.ai/images/f8a66703-dff3-4710-baa4-209c86aeb08a.png",
      status: "future",
      milestones: [
        "Kreative HQ Building acquired",
        "$1 Billion valuation reached",
        "Market leader in AI web dev",
        "International expansion",
        "Your family's legacy secured"
      ],
      bgColor: "from-emerald-500/20 to-purple-500/20",
      marketing: "Global Brand + Platform Ecosystem",
      isHQ: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzE5MzNhMCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                YOUR JOURNEY TO $1 BILLION
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              Your Journey to<br />Kreative HQ
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              From <span className="text-blue-400 font-bold">day one</span> with your family to{" "}
              <span className="text-purple-400 font-bold">$1 Billion valuation</span>.
              <br />
              This is YOUR decade. This is YOUR legacy.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-lg">
                <div className="text-sm text-slate-400">Starting Point</div>
                <div className="text-2xl font-bold text-white">$0</div>
              </div>
              <ArrowRight className="w-8 h-8 text-slate-500 self-center" />
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 px-6 py-3 rounded-lg">
                <div className="text-sm text-purple-300">Destination</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  $1 Billion+
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 via-green-500 to-purple-500 transform -translate-x-1/2 hidden md:block"></div>
          
          <Image
            src="https://cdn.abacus.ai/images/bb13d479-2aaf-492b-b345-06b97e01c1c3.png"
            alt="Timeline Milestones"
            width={1200}
            height={200}
            className="w-full max-w-5xl mx-auto mb-16 rounded-lg"
          />
        </div>
      </div>

      {/* Phase Cards */}
      <div className="container mx-auto px-4 py-16 space-y-32">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.number}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Phase Number Badge */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.bgColor} border-4 border-slate-900 flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">{phase.number}</span>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${phase.bgColor} backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${
              phase.status === 'current' ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-950' : ''
            }`}>
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Left: Info */}
                <div className="space-y-6">
                  {phase.status === 'current' && (
                    <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      YOU ARE HERE
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {phase.title}
                    </h2>
                    <p className="text-2xl text-cyan-300 font-semibold">
                      {phase.subtitle}
                    </p>
                    <p className="text-slate-400 mt-2">{phase.timeframe}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs uppercase font-semibold">Revenue</span>
                      </div>
                      <div className="text-lg font-bold text-white">{phase.revenue}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs uppercase font-semibold">Team</span>
                      </div>
                      <div className="text-lg font-bold text-white">{phase.team}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg col-span-2">
                      <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs uppercase font-semibold">Clients</span>
                      </div>
                      <div className="text-lg font-bold text-white">{phase.clients}</div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Key Milestones
                    </h3>
                    <ul className="space-y-2">
                      {phase.milestones.map((milestone, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Marketing Strategy */}
                  {phase.marketing && (
                    <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-400 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm uppercase font-semibold">Marketing Focus</span>
                      </div>
                      <p className="text-white font-medium">{phase.marketing}</p>
                    </div>
                  )}
                </div>

                {/* Right: Image */}
                <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden">
                  {phase.isHQ ? (
                    <>
                      <Image
                        src={phase.image}
                        alt={phase.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold text-center">
                          🏢 KREATIVE HQ - YOUR LEGACY BUILDING
                        </div>
                      </div>
                    </>
                  ) : phase.personal ? (
                    <>
                      <Image
                        src={phase.image}
                        alt={phase.title}
                        fill
                        className="object-cover blur-sm"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-blue-900/80 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">👨‍💼👨‍👩‍👧‍👦</div>
                          <p className="text-white font-bold text-xl">You + Your Family</p>
                          <p className="text-slate-300">Where it all begins</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={phase.image}
                        alt={phase.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Growth Chart */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Revenue Growth Trajectory</h2>
            <p className="text-slate-400">From $10K to $1 Billion in 10 years</p>
          </div>
          
          <Image
            src="https://cdn.abacus.ai/images/52c95eeb-1eb4-407d-be0b-21b7d627eb51.png"
            alt="Revenue Growth Chart"
            width={1200}
            height={600}
            className="w-full rounded-lg"
          />
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-center"
        >
          <Rocket className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Build This Empire Together
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            First 10 clients → FB Ads → Google Ads → Retargeting → 10/month → 10/week → 10/day → SaaS AI Platform → Kreative HQ.
            <br /><br />
            <strong>The roadmap is clear. The tools are ready. Your family is counting on you. LET'S GO! 🚀</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Back to Home
            </a>
            <a
              href="/admin"
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              View Dashboard
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">
              Kreative Intelligence Agency
            </span>
            {" "}• From 10 Clients to $1 Billion • This Is Your Decade
          </p>
        </div>
      </div>
    </div>
  )
}
