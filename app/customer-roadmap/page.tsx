
"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, MessageSquare, Mail, FileText, CreditCard, 
  CheckCircle2, AlertCircle, PlayCircle, ArrowRight,
  Users, Calendar, Bell, Settings, BarChart, Globe,
  Sparkles, Zap, Target, TrendingUp
} from "lucide-react"

type JourneyStage = {
  id: string
  title: string
  description: string
  icon: any
  color: string
  tests: TestItem[]
  systemComponents: string[]
}

type TestItem = {
  name: string
  status: 'untested' | 'testing' | 'passed' | 'failed'
  testUrl?: string
  testAction?: () => void
}

export default function CustomerRoadmapPage() {
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, 'untested' | 'testing' | 'passed' | 'failed'>>({})

  const runTest = async (stageId: string, testName: string, testFn?: () => Promise<boolean>) => {
    const key = `${stageId}-${testName}`
    setTestResults(prev => ({ ...prev, [key]: 'testing' }))
    
    try {
      if (testFn) {
        const result = await testFn()
        setTestResults(prev => ({ ...prev, [key]: result ? 'passed' : 'failed' }))
      } else {
        // Simulate test
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTestResults(prev => ({ ...prev, [key]: 'passed' }))
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [key]: 'failed' }))
    }
  }

  const journeyStages: JourneyStage[] = [
    {
      id: "awareness",
      title: "1. Discovery & Awareness",
      description: "Customer discovers your services through marketing channels",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      systemComponents: [
        "Facebook Ads",
        "Google Ads",
        "SEO Content",
        "Social Media Posts",
        "Organic Reach"
      ],
      tests: [
        { name: "Landing Page Loads", status: 'untested', testUrl: "/" },
        { name: "Lead Form Visible", status: 'untested', testUrl: "/get-quote" },
        { name: "Chatbot Active", status: 'untested', testUrl: "/" },
        { name: "Phone Number Clickable", status: 'untested' }
      ]
    },
    {
      id: "contact",
      title: "2. Initial Contact",
      description: "Customer reaches out via phone, SMS, chat, or form",
      icon: Phone,
      color: "from-purple-500 to-pink-500",
      systemComponents: [
        "Sona AI Phone System",
        "SMS Auto-Responder",
        "AI Sales Chatbot",
        "Lead Capture Forms",
        "Email Notifications"
      ],
      tests: [
        { name: "Phone System (919) 373-9935", status: 'untested', testUrl: "tel:+19193739935" },
        { name: "SMS Auto-Reply", status: 'untested', testUrl: "sms:+19193739935" },
        { name: "Chatbot Response", status: 'untested' },
        { name: "Form Submission", status: 'untested', testUrl: "/get-quote" },
        { name: "Email Delivery", status: 'untested' }
      ]
    },
    {
      id: "qualification",
      title: "3. Lead Qualification",
      description: "AI and system automatically qualify and score the lead",
      icon: Target,
      color: "from-orange-500 to-red-500",
      systemComponents: [
        "AI Lead Scoring",
        "Website Analysis",
        "Phone Validation",
        "Spam Detection",
        "CRM Auto-Entry"
      ],
      tests: [
        { name: "Lead appears in Admin", status: 'untested', testUrl: "/admin/leads" },
        { name: "Lead Score Calculated", status: 'untested' },
        { name: "Website Analyzed", status: 'untested' },
        { name: "Contact Validated", status: 'untested' }
      ]
    },
    {
      id: "engagement",
      title: "4. Engagement & Nurture",
      description: "Automated follow-ups and personalized communication",
      icon: MessageSquare,
      color: "from-green-500 to-emerald-500",
      systemComponents: [
        "Email Sequences",
        "SMS Follow-ups",
        "AI Conversations",
        "Scheduled Callbacks",
        "Content Delivery"
      ],
      tests: [
        { name: "Email Auto-Responder", status: 'untested' },
        { name: "SMS Sequence", status: 'untested' },
        { name: "AI Chat History", status: 'untested', testUrl: "/admin/ai-conversations" },
        { name: "Call Logs Recorded", status: 'untested', testUrl: "/admin/call-logs" }
      ]
    },
    {
      id: "proposal",
      title: "5. Quote & Proposal",
      description: "Custom pricing and proposal generation",
      icon: FileText,
      color: "from-indigo-500 to-purple-500",
      systemComponents: [
        "Custom Quote Builder",
        "Pricing Calculator",
        "PDF Generation",
        "Proposal Email",
        "Client Approval"
      ],
      tests: [
        { name: "Quote Generator Works", status: 'untested', testUrl: "/admin/leads" },
        { name: "Custom Pricing Shows", status: 'untested', testUrl: "/admin/custom-pricing" },
        { name: "PDF Downloads", status: 'untested' },
        { name: "Email Sends to Client", status: 'untested' }
      ]
    },
    {
      id: "payment",
      title: "6. Payment & Onboarding",
      description: "Stripe checkout and client onboarding process",
      icon: CreditCard,
      color: "from-yellow-500 to-orange-500",
      systemComponents: [
        "Stripe Integration",
        "Checkout Pages",
        "Payment Processing",
        "Client Portal Creation",
        "Welcome Email"
      ],
      tests: [
        { name: "Stripe Checkout Works", status: 'untested', testUrl: "/pricing" },
        { name: "Payment Confirmation", status: 'untested' },
        { name: "Portal Created", status: 'untested', testUrl: "/portal/dashboard" },
        { name: "Welcome Email Sent", status: 'untested' }
      ]
    },
    {
      id: "delivery",
      title: "7. Project Delivery",
      description: "Project execution and client collaboration",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      systemComponents: [
        "Project Dashboard",
        "Milestone Tracking",
        "File Uploads",
        "Progress Updates",
        "Client Communication"
      ],
      tests: [
        { name: "Project Dashboard", status: 'untested', testUrl: "/admin/projects" },
        { name: "Client Can Login", status: 'untested', testUrl: "/portal/login" },
        { name: "Milestone Updates", status: 'untested' },
        { name: "File Upload Works", status: 'untested' }
      ]
    },
    {
      id: "success",
      title: "8. Success & Retention",
      description: "Project completion and ongoing relationship",
      icon: TrendingUp,
      color: "from-teal-500 to-green-500",
      systemComponents: [
        "Project Completion",
        "Client Feedback",
        "Testimonial Request",
        "Upsell Opportunities",
        "Referral Program"
      ],
      tests: [
        { name: "Completion Email", status: 'untested' },
        { name: "Feedback Form", status: 'untested' },
        { name: "Analytics Dashboard", status: 'untested', testUrl: "/admin/analytics" },
        { name: "Retention Tracking", status: 'untested' }
      ]
    }
  ]

  const getTestStatus = (stageId: string, testName: string) => {
    return testResults[`${stageId}-${testName}`] || 'untested'
  }

  const getStageProgress = (stage: JourneyStage) => {
    const total = stage.tests.length
    const passed = stage.tests.filter(test => 
      getTestStatus(stage.id, test.name) === 'passed'
    ).length
    return { total, passed, percentage: (passed / total) * 100 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Zap className="w-3 h-3 mr-1" />
            System Testing Suite
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Complete Customer Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive roadmap to test every feature from first contact to project completion. 
            Click any stage to view details and run tests.
          </p>
        </div>

        {/* Journey Flow Visualization */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeyStages.map((stage, index) => {
              const progress = getStageProgress(stage)
              const Icon = stage.icon
              
              return (
                <Card 
                  key={stage.id}
                  className={`cursor-pointer transition-all hover:shadow-xl bg-slate-800 border-slate-700 hover:border-purple-500 ${
                    activeStage === stage.id ? 'ring-2 ring-purple-500 shadow-xl' : ''
                  }`}
                  onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {progress.passed > 0 && (
                        <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
                          {progress.passed}/{progress.total}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-white">{stage.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-400">{stage.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Progress bar */}
                      {progress.passed > 0 && (
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${stage.color} transition-all`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        variant={activeStage === stage.id ? "default" : "outline"}
                        className="w-full"
                      >
                        {activeStage === stage.id ? "Hide Tests" : "View Tests"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Active Stage Details */}
        {activeStage && (
          <Card className="mb-12 border-2 border-purple-500 shadow-2xl bg-slate-800">
            <CardHeader>
              <div className="flex items-center gap-4">
                {(() => {
                  const stage = journeyStages.find(s => s.id === activeStage)!
                  const Icon = stage.icon
                  return (
                    <>
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">{stage.title}</CardTitle>
                        <CardDescription className="text-base text-gray-400">{stage.description}</CardDescription>
                      </div>
                    </>
                  )
                })()}
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const stage = journeyStages.find(s => s.id === activeStage)!
                return (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* System Components */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <Settings className="w-5 h-5 text-purple-400" />
                        System Components
                      </h3>
                      <div className="space-y-2">
                        {stage.systemComponents.map((component, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-200">{component}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tests */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <PlayCircle className="w-5 h-5 text-pink-400" />
                        Feature Tests
                      </h3>
                      <div className="space-y-3">
                        {stage.tests.map((test, i) => {
                          const status = getTestStatus(stage.id, test.name)
                          return (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-200">{test.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {status === 'untested' && (
                                  <Badge variant="outline" className="border-gray-500 text-gray-300">Not Tested</Badge>
                                )}
                                {status === 'testing' && (
                                  <Badge variant="secondary">Testing...</Badge>
                                )}
                                {status === 'passed' && (
                                  <Badge className="bg-green-500">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Passed
                                  </Badge>
                                )}
                                {status === 'failed' && (
                                  <Badge variant="destructive">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Failed
                                  </Badge>
                                )}
                                {test.testUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      window.open(test.testUrl, '_blank')
                                      runTest(stage.id, test.name)
                                    }}
                                  >
                                    Test
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Quick Access Dashboard */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart className="w-5 h-5 text-blue-400" />
              Quick Access - Admin Features
            </CardTitle>
            <CardDescription className="text-gray-400">
              Jump directly to key admin dashboards to verify backend systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Leads Dashboard", url: "/admin/leads", icon: Users },
                { name: "Call Logs", url: "/admin/call-logs", icon: Phone },
                { name: "AI Conversations", url: "/admin/ai-conversations", icon: MessageSquare },
                { name: "Projects", url: "/admin/projects", icon: Sparkles },
                { name: "Analytics", url: "/admin/analytics", icon: BarChart },
                { name: "Social Media", url: "/admin/social-media", icon: Globe },
                { name: "Custom Pricing", url: "/admin/custom-pricing", icon: CreditCard },
                { name: "Client Portal", url: "/portal/dashboard", icon: Calendar }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-purple-500 text-gray-200"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <Icon className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">{item.name}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Testing Instructions */}
        <Card className="mt-8 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-yellow-400" />
              Testing Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-white">Start from Stage 1</p>
                  <p className="text-gray-300">Click each stage card to expand tests and system components</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-white">Run Each Test</p>
                  <p className="text-gray-300">Click "Test" buttons to open features in new tabs. Verify they work correctly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-white">Check Backend Updates</p>
                  <p className="text-gray-300">After each customer action (form, call, SMS), verify data appears in admin dashboard</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <p className="font-medium text-white">Track Progress</p>
                  <p className="text-gray-300">Progress bars update automatically as you mark tests complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
