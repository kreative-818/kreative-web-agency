
import { pgTable, serial, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const intentLeads = pgTable("intent_leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  businessName: varchar("business_name", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  currentWebsite: text("current_website"),
  projectType: varchar("project_type", { length: 100 }).notNull(),
  projectDescription: text("project_description").notNull(),
  features: jsonb("features").default([]),
  budgetRange: varchar("budget_range", { length: 50 }).notNull(),
  timeline: varchar("timeline", { length: 50 }).notNull(),
  landingPage: varchar("landing_page", { length: 255 }),
  timeToComplete: integer("time_to_complete"),
  contacted: boolean("contacted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scrapedLeads = pgTable("scraped_leads", {
  id: serial("id").primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  website: text("website"),
  rating: varchar("rating", { length: 10 }),
  reviewCount: integer("review_count"),
  category: varchar("category", { length: 100 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  placeId: varchar("place_id", { length: 255 }).unique(),
  source: varchar("source", { length: 50 }).notNull(),
  leadScore: integer("lead_score"),
  contacted: boolean("contacted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const outreachCampaigns = pgTable("outreach_campaigns", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  leadType: varchar("lead_type", { length: 50 }).notNull(),
  channel: varchar("channel", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  message: text("message"),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  businessName: varchar("business_name", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }).notNull(),
  basePrice: integer("base_price").notNull(),
  upgradesTotal: integer("upgrades_total").default(0),
  finalTotal: integer("final_total").notNull(),
  upgrades: jsonb("upgrades").default([]),
  status: varchar("status", { length: 50 }).default("pending"),
  paypalEmail: varchar("paypal_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const onboardingForms = pgTable("onboarding_forms", {
  id: serial("id").primaryKey(),
  businessDescription: text("business_description").notNull(),
  targetAudience: text("target_audience").notNull(),
  brandColors: text("brand_colors"),
  competitorWebsites: text("competitor_websites"),
  servicesOffered: text("services_offered").notNull(),
  specialRequests: text("special_requests"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  businessName: varchar("business_name", { length: 255 }),
  projectType: varchar("project_type", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  source: varchar("source", { length: 50 }).notNull(),
  score: integer("score").default(0),
  status: varchar("status", { length: 50 }).default("new"),
  stage: varchar("stage", { length: 50 }).default("new"), // Pipeline stage: new, contacted, qualified, proposal, won, lost
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client Management & Subscriptions for White-Label Reselling
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  businessName: varchar("business_name", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active"), // active, suspended, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  packageName: varchar("package_name", { length: 100 }).notNull(), // bronze, silver, gold, custom
  packageType: varchar("package_type", { length: 50 }).notNull(), // monthly, annual, one-time
  setupFee: integer("setup_fee").default(0), // one-time setup fee in cents
  monthlyRate: integer("monthly_rate").default(0), // recurring monthly rate in cents
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, active, past_due, cancelled
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  services: jsonb("services").default([]), // array of service strings
  metadata: jsonb("metadata"), // custom fields, limits, features
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clientInvoices = pgTable("client_invoices", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  amount: integer("amount").notNull(), // amount in cents
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, failed
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientUsage = pgTable("client_usage", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  serviceType: varchar("service_type", { length: 100 }).notNull(), // chatbot, ai-agent, automation, etc.
  usageAmount: integer("usage_amount").default(1), // count of usage
  creditsCost: integer("credits_cost").default(0), // estimated platform credits used
  metadata: jsonb("metadata"), // additional tracking data
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  visitorId: varchar("visitor_id", { length: 255 }).notNull(),
  messages: jsonb("messages").default([]),
  intent: varchar("intent", { length: 100 }),
  leadCaptured: boolean("lead_captured").default(false),
  leadData: jsonb("lead_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Call logs from Quo/Sona AI
export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  callId: varchar("call_id", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
  fromNumber: varchar("from_number", { length: 50 }),
  toNumber: varchar("to_number", { length: 50 }),
  direction: varchar("direction", { length: 20 }), // inbound, outbound
  status: varchar("status", { length: 50 }), // completed, missed, voicemail, transferred
  duration: integer("duration"), // in seconds
  transcript: text("transcript"),
  recording: text("recording"), // URL to recording
  recordingUrl: text("recording_url"),
  transcription: text("transcription"),
  summary: text("summary"),
  customerType: varchar("customer_type", { length: 50 }), // new, existing, unknown
  isExistingCustomer: boolean("is_existing_customer").default(false),
  transferredToHuman: boolean("transferred_to_human").default(false),
  conversationId: integer("conversation_id").references(() => aiConversations.id),
  intent: varchar("intent", { length: 100 }),
  sentiment: varchar("sentiment", { length: 50 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Automated follow-up tracking
export const followUps = pgTable("follow_ups", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id),
  sequence: integer("sequence").notNull(), // 1-6 (which touchpoint in the sequence)
  channel: varchar("channel", { length: 50 }).notNull(), // email or sms
  status: varchar("status", { length: 50 }).default("pending"), // pending, sent, delivered, opened, clicked, replied, failed
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  repliedAt: timestamp("replied_at"),
  subject: varchar("subject", { length: 255 }),
  content: text("content"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CLIENT PORTAL SYSTEM - Pizza Tracker
export const clientPortalUsers = pgTable("client_portal_users", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hashed
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 50 }).default("client"), // client, admin
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  projectType: varchar("project_type", { length: 100 }).notNull(), // website, web_app, automation, etc.
  status: varchar("status", { length: 50 }).default("in_progress"), // not_started, in_progress, review, completed, cancelled
  progress: integer("progress").default(0), // 0-100 percentage
  startDate: timestamp("start_date"),
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  completionDate: timestamp("completion_date"),
  budget: integer("budget"), // in cents
  metadata: jsonb("metadata"), // custom fields
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectMilestones = pgTable("project_milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").notNull(), // 1, 2, 3, etc. for display order
  status: varchar("status", { length: 50 }).default("pending"), // pending, in_progress, completed
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectNotes = pgTable("project_notes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  authorId: integer("author_id"), // references clientPortalUsers.id
  authorType: varchar("author_type", { length: 50 }).notNull(), // client, admin
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false), // true = visible only to admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectFiles = pgTable("project_files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  uploadedBy: integer("uploaded_by"), // references clientPortalUsers.id
  uploaderType: varchar("uploader_type", { length: 50 }).notNull(), // client, admin
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 100 }), // mime type
  fileSize: integer("file_size"), // in bytes
  cloudStoragePath: text("cloud_storage_path").notNull(), // S3 key or URL
  description: text("description"),
  category: varchar("category", { length: 100 }), // design, content, contract, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// AI SALES AGENT SYSTEM
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  channel: varchar("channel", { length: 50 }).default("chat"), // chat, sms, phone
  visitorName: varchar("visitor_name", { length: 255 }),
  visitorEmail: varchar("visitor_email", { length: 255 }),
  visitorPhone: varchar("visitor_phone", { length: 50 }),
  leadId: integer("lead_id").references(() => leads.id),
  status: varchar("status", { length: 50 }).default("active"), // active, closed, escalated, converted
  aiConfidence: integer("ai_confidence").default(100), // 0-100, drops when AI needs help
  conversionIntent: varchar("conversion_intent", { length: 50 }).default("unknown"), // high, medium, low, unknown
  estimatedValue: integer("estimated_value"), // estimated deal value in cents
  humanTookOver: boolean("human_took_over").default(false),
  humanTookOverAt: timestamp("human_took_over_at"),
  humanTookOverBy: varchar("human_took_over_by", { length: 255 }),
  closedReason: varchar("closed_reason", { length: 100 }),
  dealClosed: boolean("deal_closed").default(false),
  dealValue: integer("deal_value"), // actual deal value in cents if closed
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversationMessages = pgTable("conversation_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiConversations.id),
  role: varchar("role", { length: 50 }).notNull(), // user, assistant, system
  content: text("content").notNull(),
  isHuman: boolean("is_human").default(false), // true if message from human agent
  intent: varchar("intent", { length: 100 }),
  sentiment: varchar("sentiment", { length: 50 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const escalations = pgTable("escalations", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiConversations.id),
  reason: varchar("reason", { length: 255 }).notNull(),
  urgency: varchar("urgency", { length: 50 }).default("medium"), // low, medium, high, critical
  resolved: boolean("resolved").default(false),
  resolvedBy: varchar("resolved_by", { length: 255 }),
  resolvedAt: timestamp("resolved_at"),
  notes: text("notes"),
  notificationSent: boolean("notification_sent").default(false),
  notificationSentAt: timestamp("notification_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiAgentPerformance = pgTable("ai_agent_performance", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 50 }).notNull(), // YYYY-MM-DD
  totalConversations: integer("total_conversations").default(0),
  conversationsClosed: integer("conversations_closed").default(0),
  conversionsCompleted: integer("conversions_completed").default(0),
  escalationsRequired: integer("escalations_required").default(0),
  averageConfidence: integer("average_confidence").default(100),
  totalRevenue: integer("total_revenue").default(0), // in cents
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});
