
'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Play, AlertCircle, Clock, User, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Stage = {
  id: number;
  title: string;
  icon: string;
  color: string;
  timing: string;
  customerView: {
    title: string;
    steps: string[];
    screenshot?: string;
  };
  backendView: {
    title: string;
    steps: string[];
    automation: string[];
  };
  troubleshooting: string[];
  testAction: {
    label: string;
    endpoint: string;
    description: string;
  };
};

const stages: Stage[] = [
  {
    id: 1,
    title: '🔍 DISCOVERY',
    icon: '🔍',
    color: 'from-blue-500 to-blue-600',
    timing: '30 seconds - 2 minutes',
    customerView: {
      title: 'Customer Experience',
      steps: [
        'Sees Facebook/Instagram ad',
        'Clicks ad link',
        'Lands on kreativeaiagency.com',
        'Watches hero video',
        'Scrolls through services',
        'Sees trust indicators & portfolio',
        'Clicks "Get Free Quote" or "Get Started"'
      ]
    },
    backendView: {
      title: 'What You See',
      steps: [
        'Google Analytics tracks page visit',
        'Source tracking fires (Facebook Pixel)',
        'Visitor appears in /admin/analytics',
        'Chatbot engagement tracked',
        'Page scroll depth recorded'
      ],
      automation: [
        'Automatic visitor tracking',
        'Source attribution logging',
        'Engagement scoring starts'
      ]
    },
    troubleshooting: [
      'If analytics not showing: Check Google Analytics ID in .env',
      'If pixel not firing: Verify Facebook Pixel ID',
      'If chatbot not appearing: Check chatbot script in layout.tsx'
    ],
    testAction: {
      label: 'Visit Homepage',
      endpoint: '/',
      description: 'Opens homepage in new tab'
    }
  },
  {
    id: 2,
    title: '💬 INQUIRY',
    icon: '💬',
    color: 'from-green-500 to-green-600',
    timing: '2-5 minutes',
    customerView: {
      title: 'Customer Takes Action',
      steps: [
        'Fills out "Get Free Quote" form',
        'OR calls (984) 400-9443',
        'OR texts (984) 400-9443',
        'OR uses chatbot',
        'Provides: Name, Email, Phone, Project Type, Budget'
      ]
    },
    backendView: {
      title: 'What Happens Automatically',
      steps: [
        'Lead created in database instantly',
        'Appears in /admin/leads dashboard',
        'Email notification sent to you',
        'Lead assigned initial score',
        'Source & timestamp recorded'
      ],
      automation: [
        'Sona AI answers phone calls 24/7',
        'SMS auto-responder sends instant confirmation',
        'Chatbot captures info & creates lead',
        'All channels feed into one dashboard'
      ]
    },
    troubleshooting: [
      'If lead not appearing: Check database connection in .env',
      'If email not received: Verify RESEND_API_KEY',
      'If Sona not answering: Check Quo.ai webhook status',
      'If SMS not sending: Verify OpenPhone US Carrier Registration + payment'
    ],
    testAction: {
      label: 'Submit Test Lead',
      endpoint: '/get-quote',
      description: 'Opens quote form to submit test inquiry'
    }
  },
  {
    id: 3,
    title: '✅ QUALIFICATION',
    icon: '✅',
    color: 'from-purple-500 to-purple-600',
    timing: '5-15 minutes',
    customerView: {
      title: 'Customer Gets Responses',
      steps: [
        'Receives instant SMS: "Thanks! We received your inquiry..."',
        'If called: Sona AI asks qualifying questions',
        'Gets follow-up email with next steps',
        'Receives custom quote link (if budget matches)',
        'Can reply via SMS/Email with questions'
      ]
    },
    backendView: {
      title: 'AI Qualification Process',
      steps: [
        'AI analyzes lead data (budget, urgency, fit)',
        'Lead score calculated (0-100)',
        'Assigned to pipeline stage: "New Lead"',
        'Intent analysis runs (high/medium/low)',
        'You get notification in /admin/leads',
        'Call recording saved (if phone inquiry)',
        'Conversation history logged'
      ],
      automation: [
        'Sona AI extracts: budget, timeline, pain points',
        'Auto-scoring based on 15+ factors',
        'High-value leads flagged for immediate attention',
        'SMS/Email sequences triggered based on intent'
      ]
    },
    troubleshooting: [
      'If Sona not asking questions: Check call flow in Quo.ai dashboard',
      'If scoring wrong: Review scoring logic in /lib/lead-scoring.ts',
      'If SMS replies not working: Check SMS webhook endpoint',
      'If no email follow-up: Verify email template & Resend API'
    ],
    testAction: {
      label: 'Test Sona AI Call',
      endpoint: 'tel:9844009443',
      description: 'Calls your Sona AI number to test qualification flow'
    }
  },
  {
    id: 4,
    title: '📋 PROPOSAL',
    icon: '📋',
    color: 'from-yellow-500 to-yellow-600',
    timing: '15 minutes - 1 hour (your action required)',
    customerView: {
      title: 'Customer Reviews Offer',
      steps: [
        'Receives custom quote link via email/SMS',
        'Opens quote page (kreativeaiagency.com/checkout/[id])',
        'Reviews services included',
        'Sees pricing breakdown',
        'Sees monthly retainer option',
        'Can click "Get Started" to pay'
      ]
    },
    backendView: {
      title: 'You Create the Quote',
      steps: [
        'Review lead in /admin/leads or /admin/pipeline',
        'Click "Create Quote" button',
        'Select package (Basic/Pro/Premium) or Custom',
        'Set pricing (one-time + monthly retainer)',
        'System generates unique checkout link',
        'Quote saved to database',
        'Link automatically sent to customer',
        'Track in pipeline: "Proposal Sent"'
      ],
      automation: [
        'Checkout link auto-generated',
        'Email/SMS sent with link automatically',
        'Quote expiration tracking',
        'Reminder emails if not opened'
      ]
    },
    troubleshooting: [
      'If quote link broken: Check Stripe configuration',
      'If email not sending: Verify Resend API key',
      'If pricing wrong: Review /admin/custom-pricing settings',
      'If checkout not loading: Check database quote record'
    ],
    testAction: {
      label: 'Create Test Quote',
      endpoint: '/admin/pipeline',
      description: 'Opens pipeline to create a test quote'
    }
  },
  {
    id: 5,
    title: '💳 PURCHASE',
    icon: '💳',
    color: 'from-red-500 to-red-600',
    timing: '5-10 minutes',
    customerView: {
      title: 'Customer Completes Payment',
      steps: [
        'Clicks "Get Started" on quote page',
        'Redirected to Stripe Checkout',
        'Enters payment information',
        'Reviews order summary',
        'Completes payment',
        'Receives confirmation email instantly',
        'Gets portal login credentials'
      ]
    },
    backendView: {
      title: 'Payment Processing',
      steps: [
        'Stripe processes payment securely',
        'Webhook fires to /api/webhooks/stripe',
        'Purchase record created in database',
        'Client account activated automatically',
        'Client portal access enabled',
        'Project created in /admin/projects',
        'Payment shows in Stripe Dashboard',
        'Lead moved to "Won" in pipeline'
      ],
      automation: [
        'Client portal auto-created',
        'Welcome email sent with login link',
        'Onboarding form link included',
        'Project kickoff triggered',
        'Monthly retainer subscription setup (if selected)'
      ]
    },
    troubleshooting: [
      'If payment not processing: Check Stripe API keys (publishable + secret)',
      'If webhook not firing: Verify webhook URL in Stripe Dashboard',
      'If portal not created: Check /api/webhooks/stripe logs',
      'If email not sent: Verify Resend API key',
      'Test mode: Use Stripe test card 4242 4242 4242 4242'
    ],
    testAction: {
      label: 'Test Checkout',
      endpoint: '/pricing',
      description: 'Opens pricing page to test payment flow with test card'
    }
  },
  {
    id: 6,
    title: '🚀 ONBOARDING',
    icon: '🚀',
    color: 'from-indigo-500 to-indigo-600',
    timing: '30 minutes - 2 hours (customer completes form)',
    customerView: {
      title: 'Customer Gets Started',
      steps: [
        'Receives welcome email with portal link',
        'Logs into kreativeaiagency.com/portal/login',
        'Sees their project dashboard',
        'Fills out project intake form',
        'Provides: Brand colors, content, images, preferences',
        'Submits form',
        'Sees "Your project is in progress" status'
      ]
    },
    backendView: {
      title: 'Project Initiation',
      steps: [
        'Client logs in: /portal/login',
        'Portal authenticates via JWT token',
        'Client sees project in /portal/dashboard',
        'Intake form appears automatically',
        'When submitted: appears in /admin/projects',
        'You see all project details',
        'Client info saved to project record',
        'Project status: "In Progress"'
      ],
      automation: [
        'Portal access automatically granted on payment',
        'Intake form pre-populated with lead data',
        'Form submissions trigger notification to you',
        'File uploads saved to cloud storage',
        'Client can upload logos, images, docs'
      ]
    },
    troubleshooting: [
      'If portal login fails: Check JWT secret in .env (NEXTAUTH_SECRET)',
      'If form not saving: Check database connection',
      'If files not uploading: Verify AWS S3 credentials',
      'If client not seeing project: Check client_id in database',
      'Test login: Use test accounts created via /api/admin/create-test-clients'
    ],
    testAction: {
      label: 'Test Portal Login',
      endpoint: '/portal/login',
      description: 'Opens client portal login (use test accounts)'
    }
  },
  {
    id: 7,
    title: '🎨 DELIVERY',
    icon: '🎨',
    color: 'from-pink-500 to-pink-600',
    timing: '1-4 weeks (project timeline)',
    customerView: {
      title: 'Customer Tracks Progress',
      steps: [
        'Logs into portal anytime',
        'Sees project status updates',
        'Views milestones completed',
        'Receives email when updates posted',
        'Downloads deliverables',
        'Reviews work',
        'Provides feedback via portal',
        'Approves final delivery'
      ]
    },
    backendView: {
      title: 'You Manage the Project',
      steps: [
        'Work on project using intake form data',
        'Update project status in /admin/projects/[id]',
        'Upload files: designs, code, assets',
        'Mark milestones complete',
        'Add notes for client',
        'Client sees updates in real-time',
        'Track time spent',
        'Mark project as "Completed"'
      ],
      automation: [
        'Client gets email when you add updates',
        'File uploads automatically saved to cloud',
        'Download links generated for client',
        'Timeline tracking automatic',
        'Status changes trigger notifications'
      ]
    },
    troubleshooting: [
      'If client not seeing updates: Check project_id match in database',
      'If files not uploading: Check cloud storage configuration',
      'If emails not sending: Verify Resend API',
      'If status not updating: Check database write permissions',
      'File size limit: 10MB per file (configurable in S3 settings)'
    ],
    testAction: {
      label: 'Manage Test Project',
      endpoint: '/admin/projects',
      description: 'Opens projects dashboard to test updates'
    }
  },
  {
    id: 8,
    title: '🔄 RETENTION',
    icon: '🔄',
    color: 'from-teal-500 to-teal-600',
    timing: 'Ongoing',
    customerView: {
      title: 'Customer Relationship Continues',
      steps: [
        'Receives monthly retainer invoice (if subscribed)',
        'Gets upsell offers: SEO, AI features, hosting',
        'Sees new service announcements',
        'Can book additional work via portal',
        'Refers friends (future: referral program)',
        'Leaves review/testimonial'
      ]
    },
    backendView: {
      title: 'Revenue Growth & Upsells',
      steps: [
        'Track client lifetime value in /admin/clients',
        'See all projects per client',
        'Monthly retainer auto-bills via Stripe',
        'Send targeted upsell campaigns',
        'Track referrals',
        'Monitor client health score',
        'Re-engage inactive clients'
      ],
      automation: [
        'Monthly invoices sent automatically',
        'Payment failures trigger reminder emails',
        'Upsell sequences based on project type',
        'Birthday/anniversary emails',
        'NPS surveys sent post-project',
        'Referral tracking (coming soon)'
      ]
    },
    troubleshooting: [
      'If subscription not billing: Check Stripe subscription status',
      'If upsell emails not sending: Verify campaign settings',
      'If client LTV wrong: Review purchase history in database',
      'Cancellation handling: Stripe dashboard → Subscriptions'
    ],
    testAction: {
      label: 'View Client Dashboard',
      endpoint: '/admin/clients',
      description: 'Opens client management dashboard'
    }
  }
];

export default function CustomerJourneyPage() {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [testingStage, setTestingStage] = useState<number | null>(null);

  const toggleStage = (stageId: number) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  const markComplete = (stageId: number) => {
    if (completedStages.includes(stageId)) {
      setCompletedStages(completedStages.filter(id => id !== stageId));
    } else {
      setCompletedStages([...completedStages, stageId]);
    }
  };

  const runTest = (stage: Stage) => {
    setTestingStage(stage.id);
    
    // Open endpoint in new tab with full URL
    if (stage.testAction.endpoint.startsWith('tel:')) {
      window.location.href = stage.testAction.endpoint;
    } else {
      const fullUrl = stage.testAction.endpoint.startsWith('http') 
        ? stage.testAction.endpoint 
        : `https://kreativeaiagency.com${stage.testAction.endpoint}`;
      window.open(fullUrl, '_blank');
    }
    
    setTimeout(() => {
      setTestingStage(null);
    }, 2000);
  };

  const openCustomerView = (stage: Stage) => {
    // Open the customer-facing page
    const urls: Record<number, string> = {
      1: 'https://kreativeaiagency.com', // Homepage
      2: 'https://kreativeaiagency.com/get-quote', // Quote form
      3: 'tel:9844009443', // Phone call
      4: 'https://kreativeaiagency.com/pricing', // Pricing page
      5: 'https://kreativeaiagency.com/pricing', // Checkout
      6: 'https://kreativeaiagency.com/portal/login', // Portal login
      7: 'https://kreativeaiagency.com/portal/dashboard', // Portal dashboard
      8: 'https://kreativeaiagency.com/pricing' // Retention offers
    };
    
    const url = urls[stage.id];
    if (url?.startsWith('tel:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  const openBackendView = (stage: Stage) => {
    // Open the admin dashboard relevant to this stage
    const urls: Record<number, string> = {
      1: 'https://kreativeaiagency.com/admin/analytics', // Analytics
      2: 'https://kreativeaiagency.com/admin/leads', // Leads dashboard
      3: 'https://kreativeaiagency.com/admin/pipeline', // Pipeline
      4: 'https://kreativeaiagency.com/admin/pipeline', // Create quote
      5: 'https://stripe.com/dashboard', // Stripe dashboard
      6: 'https://kreativeaiagency.com/admin/projects', // Projects
      7: 'https://kreativeaiagency.com/admin/projects', // Project management
      8: 'https://kreativeaiagency.com/admin/clients' // Client management
    };
    
    window.open(urls[stage.id], '_blank');
  };

  const expandAll = () => {
    setExpandedStage(-1); // Special value for all expanded
  };

  const collapseAll = () => {
    setExpandedStage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎯 Customer Journey Training
              </h1>
              <p className="text-gray-400">
                Complete walkthrough from ad to delivery • Test mode enabled
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                Collapse All
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Testing Progress</span>
              <span className="text-sm font-semibold text-gray-300">
                {completedStages.length} / {stages.length} stages tested
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(completedStages.length / stages.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-teal-500" />

          {/* Stages */}
          <div className="space-y-8">
            {stages.map((stage, index) => {
              const isExpanded = expandedStage === stage.id || expandedStage === -1;
              const isCompleted = completedStages.includes(stage.id);
              const isTesting = testingStage === stage.id;

              return (
                <div key={stage.id} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-4 top-6 w-9 h-9 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all ${
                      isCompleted
                        ? 'bg-green-500 ring-4 ring-green-500/30'
                        : 'bg-gray-700 ring-4 ring-gray-700/30 hover:ring-gray-600/50'
                    }`}
                    onClick={() => markComplete(stage.id)}
                  >
                    {isCompleted ? '✓' : stage.icon}
                  </div>

                  {/* Stage Card */}
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all">
                    <CardContent className="p-6">
                      {/* Stage Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleStage(stage.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">
                              {stage.title}
                            </h2>
                            <Badge
                              className={`bg-gradient-to-r ${stage.color} text-white`}
                            >
                              Stage {stage.id}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{stage.timing}</span>
                            </div>
                            {isCompleted && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                ✓ Tested
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              runTest(stage);
                            }}
                            disabled={isTesting}
                            className={`bg-gradient-to-r ${stage.color} hover:opacity-90 text-white`}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            {isTesting ? 'Running...' : 'Test This'}
                          </Button>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-6 space-y-6 animate-in slide-in-from-top-4">
                          {/* Customer vs Backend Views */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Customer View */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <User className="w-5 h-5 text-blue-400" />
                                  <h3 className="text-lg font-semibold text-blue-400">
                                    {stage.customerView.title}
                                  </h3>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => openCustomerView(stage)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                                >
                                  Open →
                                </Button>
                              </div>
                              <ul className="space-y-2">
                                {stage.customerView.steps.map((step, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-gray-300"
                                  >
                                    <span className="text-blue-400 mt-0.5">→</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Backend View */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Cog className="w-5 h-5 text-green-400" />
                                  <h3 className="text-lg font-semibold text-green-400">
                                    {stage.backendView.title}
                                  </h3>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => openBackendView(stage)}
                                  className="bg-green-500 hover:bg-green-600 text-white text-xs"
                                >
                                  Open →
                                </Button>
                              </div>
                              <ul className="space-y-2 mb-4">
                                {stage.backendView.steps.map((step, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-gray-300"
                                  >
                                    <span className="text-green-400 mt-0.5">→</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>

                              {stage.backendView.automation.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-green-500/30">
                                  <p className="text-xs font-semibold text-green-400 mb-2">
                                    🤖 AUTOMATED:
                                  </p>
                                  <ul className="space-y-1">
                                    {stage.backendView.automation.map((auto, i) => (
                                      <li
                                        key={i}
                                        className="text-xs text-gray-400 flex items-start gap-1"
                                      >
                                        <span className="text-green-400">✓</span>
                                        <span>{auto}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Troubleshooting */}
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="w-5 h-5 text-yellow-400" />
                              <h3 className="text-lg font-semibold text-yellow-400">
                                Troubleshooting Tips
                              </h3>
                            </div>
                            <ul className="space-y-2">
                              {stage.troubleshooting.map((tip, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-gray-300"
                                >
                                  <span className="text-yellow-400 mt-0.5">⚠</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Test Action */}
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-purple-400 mb-1">
                                  Test Mode
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {stage.testAction.description}
                                </p>
                              </div>
                              <Button
                                onClick={() => runTest(stage)}
                                disabled={isTesting}
                                className={`bg-gradient-to-r ${stage.color} hover:opacity-90 text-white`}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {stage.testAction.label}
                              </Button>
                            </div>
                          </div>

                          {/* Mark Complete */}
                          <div className="flex justify-center pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markComplete(stage.id)}
                              className={
                                isCompleted
                                  ? 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30'
                                  : 'border-gray-600 text-gray-400 hover:bg-gray-700'
                              }
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Stage Tested ✓
                                </>
                              ) : (
                                <>
                                  <Circle className="w-4 h-4 mr-2" />
                                  Mark as Tested
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Message */}
        {completedStages.length === stages.length && (
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 animate-in zoom-in">
              <h2 className="text-3xl font-bold text-white mb-2">
                🎉 Journey Complete!
              </h2>
              <p className="text-white/90">
                You've tested all 8 stages. You're ready to launch! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔗 Quick Access</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/admin/leads"
              target="_blank"
              className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <span>📊</span>
              <span className="text-sm font-medium">Leads Dashboard</span>
            </a>
            <a
              href="/admin/pipeline"
              target="_blank"
              className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <span>🎯</span>
              <span className="text-sm font-medium">Sales Pipeline</span>
            </a>
            <a
              href="/admin/projects"
              target="_blank"
              className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <span>🎨</span>
              <span className="text-sm font-medium">Projects</span>
            </a>
            <a
              href="/admin/clients"
              target="_blank"
              className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <span>👥</span>
              <span className="text-sm font-medium">Clients</span>
            </a>
            <a
              href="/admin/analytics"
              target="_blank"
              className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <span>📈</span>
              <span className="text-sm font-medium">Analytics</span>
            </a>
            <a
              href="/portal/login"
              target="_blank"
              className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              <span>🔐</span>
              <span className="text-sm font-medium">Client Portal</span>
            </a>
          </div>
        </div>

        {/* Test Account Info */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">
            🧪 Test Account Credentials
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Admin Access:</p>
              <p className="text-white font-mono">Email: admin@kreativeaiagency.com</p>
              <p className="text-gray-500 text-xs">(Set your own password)</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Test Clients:</p>
              <p className="text-white font-mono">Chris Klein & Tess Klein</p>
              <p className="text-gray-500 text-xs">(View in /admin/clients)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
