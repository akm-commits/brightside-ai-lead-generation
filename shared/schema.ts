import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Email Templates
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: varchar("category").notNull(), // 'first-outreach', 'follow-up', 'specialized'
  subCategory: text("sub_category"), // 'decision-maker', 'problem-solution', etc.
  subjectLine: text("subject_line").notNull(),
  subjectVariations: json("subject_variations").$type<string[]>(), // Alternative subject lines
  emailBody: text("email_body").notNull(),
  personalizationTips: text("personalization_tips"),
  industryFocus: varchar("industry_focus"), // 'saas', 'agency', 'ecommerce', 'general'
  openRate: decimal("open_rate", { precision: 5, scale: 2 }), // Success metrics
  replyRate: decimal("reply_rate", { precision: 5, scale: 2 }),
  pipelineGenerated: integer("pipeline_generated"), // Dollar amount
  useCase: text("use_case"), // When to use this template
  bestPractices: text("best_practices"),
  successStory: text("success_story"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Audit Submissions
export const auditSubmissions = pgTable("audit_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  industry: varchar("industry").notNull(),
  companySize: varchar("company_size").notNull(), // '1-10', '11-50', etc.
  currentRevenue: varchar("current_revenue").notNull(),
  targetRevenue: varchar("target_revenue").notNull(),
  currentLeadGenMethods: json("current_leadgen_methods").$type<string[]>(),
  monthlyLeadGenSpend: varchar("monthly_leadgen_spend"),
  currentAppointmentsPerMonth: integer("current_appointments_per_month"),
  averageDealSize: integer("average_deal_size"),
  salesCycleLength: varchar("sales_cycle_length"), // 'days', 'weeks', 'months'
  closingRate: decimal("closing_rate", { precision: 5, scale: 2 }),
  biggestChallenges: json("biggest_challenges").$type<string[]>(),
  currentTools: json("current_tools").$type<string[]>(),
  hasEmailSequences: boolean("has_email_sequences").default(false),
  hasCRM: boolean("has_crm").default(false),
  currentEmailVolume: integer("current_email_volume"),
  
  // Target Audience Analysis
  targetCompanySizes: json("target_company_sizes").$type<string[]>(), // ['1-10', '11-50', etc.]
  targetDecisionMakers: json("target_decision_makers").$type<string[]>(), // ['CEO', 'Marketing Director', etc.]
  targetIndustries: json("target_industries").$type<string[]>(), // Industries they sell to
  geographicFocus: json("geographic_focus").$type<string[]>(), // ['North America', 'Europe', etc.]
  idealCustomerProfile: text("ideal_customer_profile"), // Description of ICP
  
  // Conversion Metrics
  websiteTrafficPerMonth: integer("website_traffic_per_month"),
  leadToCustomerRate: decimal("lead_to_customer_rate", { precision: 5, scale: 2 }), // %
  currentCAC: integer("current_cac"), // Customer Acquisition Cost
  costPerLeadByChannel: json("cost_per_lead_by_channel").$type<Record<string, number>>(), // {"email": 25, "ads": 50}
  conversionRateByStage: json("conversion_rate_by_stage").$type<Record<string, number>>(), // {"visitor_to_lead": 2.5, "lead_to_sql": 15}
  
  // Content & Messaging Strategy
  currentValueProps: json("current_value_props").$type<string[]>(), // Main value propositions
  contentProductionVolume: varchar("content_production_volume"), // 'Daily', 'Weekly', 'Monthly', 'Rarely'
  contentThemes: json("content_themes").$type<string[]>(), // ['Thought Leadership', 'Case Studies', etc.]
  messagingTestingFrequency: varchar("messaging_testing_frequency"), // 'Weekly', 'Monthly', 'Quarterly', 'Never'
  primaryContentFormats: json("primary_content_formats").$type<string[]>(), // ['Blog Posts', 'Videos', 'Podcasts', etc.]
  
  // Competitive Intelligence
  mainCompetitors: json("main_competitors").$type<string[]>(), // List of competitor names
  competitiveAdvantages: json("competitive_advantages").$type<string[]>(), // What makes them better
  marketDifferentiators: json("market_differentiators").$type<string[]>(), // How they stand out
  competitorAnalysisFrequency: varchar("competitor_analysis_frequency"), // 'Monthly', 'Quarterly', 'Annually', 'Never'
  
  // Technical & Process Maturity
  marketingAutomationPlatform: varchar("marketing_automation_platform"), // 'HubSpot', 'Marketo', 'Pardot', 'None'
  analyticsSetup: json("analytics_setup").$type<string[]>(), // ['Google Analytics', 'Mixpanel', 'Amplitude', etc.]
  abTestingFrequency: varchar("ab_testing_frequency"), // 'Weekly', 'Monthly', 'Quarterly', 'Never'
  leadScoringSystem: boolean("lead_scoring_system").default(false),
  attributionModelUsed: varchar("attribution_model"), // 'First Touch', 'Last Touch', 'Multi-Touch', 'None'
  
  // Sales Process Details
  salesTeamSize: integer("sales_team_size"),
  salesQualificationProcess: text("sales_qualification_process"), // Description of qualification
  followUpCadence: varchar("follow_up_cadence"), // 'Daily', '3 days', 'Weekly', 'No system'
  winLossTracking: boolean("win_loss_tracking").default(false),
  salesEnablementTools: json("sales_enablement_tools").$type<string[]>(), // ['Gong', 'Chorus', 'Outreach', etc.]
  
  // Historical Performance & Insights
  previousSuccessfulCampaigns: text("previous_successful_campaigns"), // Description of what worked
  biggestFailuresLessons: text("biggest_failures_lessons"), // What didn't work and why
  seasonalTrends: text("seasonal_trends"), // Any seasonal patterns
  growthBottlenecks: json("growth_bottlenecks").$type<string[]>(), // Main constraints to growth
  
  // Website/Landing Page Audit (Optional)
  enableWebsiteAudit: boolean("enable_website_audit").default(false),
  landingPageUrls: json("landing_page_urls").$type<string[]>(), // URLs to analyze
  conversionGoals: json("conversion_goals").$type<string[]>(), // ['Lead Generation', 'Demo Requests', etc.]
  currentWebsiteConversionRate: decimal("current_website_conversion_rate", { precision: 5, scale: 2 }), // %
  mobileOptimizationScore: integer("mobile_optimization_score"), // 1-10 self-rating
  pagespeedConcerns: boolean("pagespeed_concerns").default(false),
  
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Audit Reports
export const auditReports = pgTable("audit_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").notNull().references(() => auditSubmissions.id),
  overallScore: integer("overall_score").notNull(), // 1-100
  currentEfficiencyScore: integer("current_efficiency_score"),
  potentialImprovementScore: integer("potential_improvement_score"),
  estimatedROI: integer("estimated_roi"), // Percentage
  projectedAppointmentIncrease: integer("projected_appointment_increase"), // Percentage
  projectedRevenueIncrease: integer("projected_revenue_increase"), // Dollar amount
  recommendations: json("recommendations").$type<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    timeToImplement: string;
    estimatedImpact: string;
    tools: string[];
  }[]>(),
  implementationPlan: json("implementation_plan").$type<{
    phase: number;
    title: string;
    duration: string;
    tasks: string[];
    expectedResults: string;
  }[]>(),
  benchmarkData: json("benchmark_data").$type<{
    metric: string;
    currentValue: number;
    industryAverage: number;
    topPerformers: number;
  }[]>(),
  websiteAuditResults: json("website_audit_results").$type<{
    url: string;
    pageLoadTime: number;
    mobileResponsive: boolean;
    hasContactForm: boolean;
    ctaCount: number;
    ctaQuality: 'poor' | 'good' | 'excellent';
    hasPhoneNumber: boolean;
    hasEmailAddress: boolean;
    contentLength: number;
    hasValueProp: boolean;
    seoScore: number;
    recommendations: string[];
    conversionScore: number;
  }[]>(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditSubmissionSchema = createInsertSchema(auditSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertAuditReportSchema = createInsertSchema(auditReports).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type AuditSubmission = typeof auditSubmissions.$inferSelect;
export type InsertAuditSubmission = z.infer<typeof insertAuditSubmissionSchema>;
export type AuditReport = typeof auditReports.$inferSelect;
export type InsertAuditReport = z.infer<typeof insertAuditReportSchema>;
