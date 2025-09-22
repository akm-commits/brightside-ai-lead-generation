import { 
  type User, 
  type InsertUser, 
  type EmailTemplate, 
  type InsertEmailTemplate,
  type AuditSubmission,
  type InsertAuditSubmission,
  type AuditReport,
  type InsertAuditReport,
  users,
  emailTemplates,
  auditSubmissions,
  auditReports
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// Database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Email template methods
  getAllTemplates(): Promise<EmailTemplate[]>;
  getTemplatesByCategory(category: string): Promise<EmailTemplate[]>;
  getTemplate(id: string): Promise<EmailTemplate | undefined>;
  createTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  
  // Audit system methods
  createAuditSubmission(submission: InsertAuditSubmission): Promise<AuditSubmission>;
  getAuditSubmission(id: string): Promise<AuditSubmission | undefined>;
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
  getAuditReport(submissionId: string): Promise<AuditReport | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Email template methods
  async getAllTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates);
  }

  async getTemplatesByCategory(category: string): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates).where(eq(emailTemplates.category, category));
  }

  async getTemplate(id: string): Promise<EmailTemplate | undefined> {
    const result = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1);
    return result[0];
  }

  async createTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const result = await db.insert(emailTemplates).values([template]).returning();
    return result[0];
  }

  // Audit system methods
  async createAuditSubmission(submission: InsertAuditSubmission): Promise<AuditSubmission> {
    const result = await db.insert(auditSubmissions).values([submission]).returning();
    return result[0];
  }

  async getAuditSubmission(id: string): Promise<AuditSubmission | undefined> {
    const result = await db.select().from(auditSubmissions).where(eq(auditSubmissions.id, id)).limit(1);
    return result[0];
  }

  async createAuditReport(report: InsertAuditReport): Promise<AuditReport> {
    const result = await db.insert(auditReports).values([report]).returning();
    return result[0];
  }

  async getAuditReport(submissionId: string): Promise<AuditReport | undefined> {
    const result = await db.select().from(auditReports).where(eq(auditReports.submissionId, submissionId)).limit(1);
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private templates: Map<string, EmailTemplate>;
  private auditSubmissions: Map<string, AuditSubmission>;
  private auditReports: Map<string, AuditReport>;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.auditSubmissions = new Map();
    this.auditReports = new Map();
    this.seedTemplates();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Email template methods
  async getAllTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<EmailTemplate[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.category === category
    );
  }

  async getTemplate(id: string): Promise<EmailTemplate | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    const id = randomUUID();
    const now = new Date();
    const template: EmailTemplate = { 
      id,
      createdAt: now,
      updatedAt: now,
      title: insertTemplate.title,
      category: insertTemplate.category,
      subCategory: insertTemplate.subCategory ?? null,
      subjectLine: insertTemplate.subjectLine,
      subjectVariations: insertTemplate.subjectVariations ? [...insertTemplate.subjectVariations] : null,
      emailBody: insertTemplate.emailBody,
      personalizationTips: insertTemplate.personalizationTips ?? null,
      industryFocus: insertTemplate.industryFocus ?? null,
      openRate: insertTemplate.openRate ?? null,
      replyRate: insertTemplate.replyRate ?? null,
      pipelineGenerated: insertTemplate.pipelineGenerated ?? null,
      useCase: insertTemplate.useCase ?? null,
      bestPractices: insertTemplate.bestPractices ?? null,
      successStory: insertTemplate.successStory ?? null,
    };
    this.templates.set(id, template);
    return template;
  }

  // Audit system methods
  async createAuditSubmission(insertSubmission: InsertAuditSubmission): Promise<AuditSubmission> {
    const id = randomUUID();
    const now = new Date();
    const submission: AuditSubmission = {
      id,
      createdAt: now,
      companyName: insertSubmission.companyName,
      contactName: insertSubmission.contactName,
      email: insertSubmission.email,
      website: insertSubmission.website ?? null,
      industry: insertSubmission.industry,
      companySize: insertSubmission.companySize,
      currentRevenue: insertSubmission.currentRevenue,
      targetRevenue: insertSubmission.targetRevenue,
      currentLeadGenMethods: insertSubmission.currentLeadGenMethods ? [...insertSubmission.currentLeadGenMethods] : [],
      monthlyLeadGenSpend: insertSubmission.monthlyLeadGenSpend ?? null,
      currentAppointmentsPerMonth: insertSubmission.currentAppointmentsPerMonth ?? null,
      averageDealSize: insertSubmission.averageDealSize ?? null,
      salesCycleLength: insertSubmission.salesCycleLength ?? null,
      closingRate: insertSubmission.closingRate ?? null,
      biggestChallenges: insertSubmission.biggestChallenges ? [...insertSubmission.biggestChallenges] : [],
      currentTools: insertSubmission.currentTools ? [...insertSubmission.currentTools] : [],
      hasEmailSequences: insertSubmission.hasEmailSequences ?? false,
      hasCRM: insertSubmission.hasCRM ?? false,
      currentEmailVolume: insertSubmission.currentEmailVolume ?? null,
      targetCompanySizes: insertSubmission.targetCompanySizes ? [...insertSubmission.targetCompanySizes] : [],
      targetDecisionMakers: insertSubmission.targetDecisionMakers ? [...insertSubmission.targetDecisionMakers] : [],
      targetIndustries: insertSubmission.targetIndustries ? [...insertSubmission.targetIndustries] : [],
      geographicFocus: insertSubmission.geographicFocus ? [...insertSubmission.geographicFocus] : [],
      websiteTrafficPerMonth: insertSubmission.websiteTrafficPerMonth ?? null,
      leadToCustomerRate: insertSubmission.leadToCustomerRate ?? null,
      currentCAC: insertSubmission.currentCAC ?? null,
      currentWebsiteConversionRate: insertSubmission.currentWebsiteConversionRate ?? null,
      salesTeamSize: insertSubmission.salesTeamSize ?? null,
      costPerLeadByChannel: insertSubmission.costPerLeadByChannel ?? null,
      conversionRateByStage: insertSubmission.conversionRateByStage ?? null,
      currentValueProps: insertSubmission.currentValueProps ? [...insertSubmission.currentValueProps] : [],
      contentThemes: insertSubmission.contentThemes ? [...insertSubmission.contentThemes] : [],
      primaryContentFormats: insertSubmission.primaryContentFormats ? [...insertSubmission.primaryContentFormats] : [],
      mainCompetitors: insertSubmission.mainCompetitors ? [...insertSubmission.mainCompetitors] : [],
      competitiveAdvantages: insertSubmission.competitiveAdvantages ? [...insertSubmission.competitiveAdvantages] : [],
      marketDifferentiators: insertSubmission.marketDifferentiators ? [...insertSubmission.marketDifferentiators] : [],
      analyticsSetup: insertSubmission.analyticsSetup ? [...insertSubmission.analyticsSetup] : [],
      salesEnablementTools: insertSubmission.salesEnablementTools ? [...insertSubmission.salesEnablementTools] : [],
      mobileOptimizationScore: insertSubmission.mobileOptimizationScore ?? null,
      growthBottlenecks: insertSubmission.growthBottlenecks ? [...insertSubmission.growthBottlenecks] : [],
      landingPageUrls: insertSubmission.landingPageUrls ? [...insertSubmission.landingPageUrls] : [],
      conversionGoals: insertSubmission.conversionGoals ? [...insertSubmission.conversionGoals] : [],
      enableWebsiteAudit: insertSubmission.enableWebsiteAudit ?? false,
      pagespeedConcerns: insertSubmission.pagespeedConcerns ?? false,
      // Add missing schema fields with default values
      idealCustomerProfile: null,
      contentProductionVolume: null,
      messagingTestingFrequency: null,
      competitorAnalysisFrequency: null,
      marketingAutomationPlatform: null,
      abTestingFrequency: null,
      leadScoringSystem: false,
      attributionModelUsed: null,
      salesQualificationProcess: null,
      followUpCadence: null,
      winLossTracking: false,
      previousSuccessfulCampaigns: null,
      biggestFailuresLessons: null,
      seasonalTrends: null,
    };
    this.auditSubmissions.set(id, submission);
    return submission;
  }

  async getAuditSubmission(id: string): Promise<AuditSubmission | undefined> {
    return this.auditSubmissions.get(id);
  }

  async createAuditReport(insertReport: InsertAuditReport): Promise<AuditReport> {
    const id = randomUUID();
    const now = new Date();
    const report: AuditReport = {
      id,
      createdAt: now,
      submissionId: insertReport.submissionId,
      overallScore: insertReport.overallScore,
      currentEfficiencyScore: insertReport.currentEfficiencyScore ?? null,
      potentialImprovementScore: insertReport.potentialImprovementScore ?? null,
      estimatedROI: insertReport.estimatedROI ?? null,
      recommendations: insertReport.recommendations ? [...insertReport.recommendations] : [],
      implementationPlan: insertReport.implementationPlan ? [...insertReport.implementationPlan] : [],
      benchmarkData: insertReport.benchmarkData ? [...insertReport.benchmarkData] : [],
    };
    this.auditReports.set(id, report);
    return report;
  }

  async getAuditReport(submissionId: string): Promise<AuditReport | undefined> {
    return Array.from(this.auditReports.values()).find(
      (report) => report.submissionId === submissionId
    );
  }

  private seedTemplates() {
    const templates: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
      // FIRST OUTREACH TEMPLATES (5)
      {
        title: "Decision Maker Direct",
        category: "first-outreach",
        subCategory: "decision-maker",
        subjectLine: "Quick question about [Company Name]'s lead generation",
        subjectVariations: [
          "[First Name], 30 seconds on [Company Name]'s growth?",
          "Noticed [Company Name] is hiring - growth question",
          "[Company Name]'s lead gen: quick insight to share"
        ],
        emailBody: `Hi [First Name],

I noticed [Company Name] has been [specific observation about their business/hiring/growth]. 

Most companies your size are spending $5K-15K/month on lead generation but only getting 5-8 qualified appointments.

We help companies like [Similar Company] get 10+ guaranteed appointments for just $2,000 - no upfront fees, pay only after delivery.

Worth a quick 15-minute conversation to see if there's a fit?

Best,
[Your Name]`,
        personalizationTips: "Research their recent hiring, funding, or product launches. Mention specific companies in their space.",
        industryFocus: "general",
        openRate: "42.50",
        replyRate: "18.30",
        pipelineGenerated: 185000,
        useCase: "First contact with decision makers who haven't heard of your company",
        bestPractices: "Keep it short, lead with their pain point, include social proof, and end with a soft ask",
        successStory: "Used with 50+ SaaS companies, generated $185K in new pipeline with 42.5% open rate and 18.3% reply rate"
      },
      {
        title: "Problem-Solution Opener",
        category: "first-outreach",
        subCategory: "problem-solution",
        subjectLine: "[Company Name]: Are you losing deals to slow lead response?",
        subjectVariations: [
          "The #1 reason [Company Name] prospects go cold",
          "[First Name], is this costing [Company Name] deals?",
          "Why [Company Name]'s best leads aren't converting"
        ],
        emailBody: `[First Name],

Quick question: How long does it take [Company Name] to respond to a new lead?

If it's more than 5 minutes, you're likely losing 50-80% of potential deals to faster competitors.

We solved this exact problem for [Similar Company] - they went from 2-hour response times to 30-second automated responses, increasing their conversion rate by 340%.

The solution? Qualified appointments delivered directly to your calendar, pre-warmed and ready to buy.

Interested in seeing how this would work for [Company Name]?

[Your Name]`,
        personalizationTips: "Research their current lead response process, mention specific competitors, reference industry studies",
        industryFocus: "saas",
        openRate: "38.70",
        replyRate: "22.10",
        pipelineGenerated: 240000,
        useCase: "When you know the prospect has a specific problem your solution addresses",
        bestPractices: "Start with a diagnostic question, provide specific statistics, show clear before/after results",
        successStory: "Generated $240K pipeline for B2B SaaS companies, with 38.7% open rates across 1,200+ sends"
      },
      {
        title: "Social Proof Authority",
        category: "first-outreach",
        subCategory: "social-proof",
        subjectLine: "How [Similar Company] got 47% more appointments",
        subjectVariations: [
          "[Similar Company] increased meetings by 47% - here's how",
          "Case study: [Similar Company]'s lead gen breakthrough",
          "The strategy that got [Similar Company] 10+ meetings/week"
        ],
        emailBody: `Hi [First Name],

[Similar Company]'s VP of Sales told me they were struggling to book enough qualified demos despite having a great product.

3 months later, they're getting 47% more appointments and closed an extra $180K in new business.

What changed? Instead of cold calling and hoping, they get qualified prospects delivered directly to their calendar - people who already want to buy.

The process:
• We identify decision makers actively looking for solutions like [Company Name]'s
• Send personalized outreach that gets responses
• Deliver 10+ qualified appointments per month, guaranteed

Would you like me to show you the exact process [Similar Company] used?

Best,
[Your Name]`,
        personalizationTips: "Use actual client names when possible (with permission), include specific metrics, mention industry relevance",
        industryFocus: "general",
        openRate: "45.20",
        replyRate: "19.80",
        pipelineGenerated: 320000,
        useCase: "When you have strong case studies and want to lead with social proof",
        bestPractices: "Use real company names, specific numbers, and clear cause-and-effect relationships",
        successStory: "This template generated $320K+ in new pipeline, with the highest open rates (45.2%) in our database"
      },
      {
        title: "Competitor Comparison",
        category: "first-outreach",
        subCategory: "competitive",
        subjectLine: "Why companies are switching from [Competitor] to us",
        subjectVariations: [
          "[Company Name] using [Competitor]? Here's what you're missing",
          "The problem with [Competitor] that no one talks about",
          "Better alternative to [Competitor] for companies like [Company Name]"
        ],
        emailBody: `[First Name],

I noticed [Company Name] might be using [Competitor] for lead generation.

Most of our clients came to us after spending months (and thousands) with [Competitor], only to get:
• Generic leads that don't convert
• Long setup times (3-6 months)
• High upfront costs with no guarantee

Here's what [Previous Client] said about switching:
"We spent $12K with [Competitor] and got 3 appointments in 4 months. With Brightside AI, we got 10 qualified appointments in the first month for $2K total."

The difference? We guarantee results and you only pay after we deliver.

Want to see a side-by-side comparison of what [Company Name] could expect?

[Your Name]`,
        personalizationTips: "Research their current tools, mention specific competitor pain points, include client quotes",
        industryFocus: "agency",
        openRate: "41.30",
        replyRate: "24.70",
        pipelineGenerated: 195000,
        useCase: "When you know they're using a competitor and you have clear differentiators",
        bestPractices: "Focus on specific competitor weaknesses, use real client testimonials, show clear comparisons",
        successStory: "Helped win 15+ accounts from major competitors, generating $195K in switched business"
      },
      {
        title: "Value Proposition Direct",
        category: "first-outreach",
        subCategory: "value-prop",
        subjectLine: "10 qualified appointments for [Company Name] - guaranteed",
        subjectVariations: [
          "[Company Name]: $0 setup, 10 appointments guaranteed",
          "Guaranteed meetings for [Company Name] - no upfront cost",
          "[First Name], interested in guaranteed appointments?"
        ],
        emailBody: `Hi [First Name],

Straight to the point: We'll deliver 10 qualified appointments to [Company Name] or you don't pay a penny.

• No setup fees
• No long-term contracts  
• No risk - pay only after we deliver
• Appointments with decision makers who want to buy

[Previous Client] closed $85K from their first 10 appointments.
[Another Client] booked 18 appointments in 3 weeks.
[Third Client] said "Finally, an agency that does what they promise."

The process is simple:
1. 15-minute strategy call to understand your ideal customer
2. We build and execute the outreach campaign
3. You get qualified appointments in your calendar
4. You pay $200 per delivered appointment

Ready to get started?

[Your Name]`,
        personalizationTips: "Keep it direct and benefit-focused, use recent client examples, emphasize risk-free nature",
        industryFocus: "general",
        openRate: "39.60",
        replyRate: "16.40",
        pipelineGenerated: 275000,
        useCase: "When you want to lead with your strongest value proposition",
        bestPractices: "Lead with the guarantee, use bullet points for clarity, include recent success metrics",
        successStory: "This direct approach generated $275K+ in pipeline with consistent 16.4% reply rates"
      },

      // FOLLOW-UP TEMPLATES (5)
      {
        title: "Polite Follow-Up",
        category: "follow-up", 
        subCategory: "polite",
        subjectLine: "Re: [Original Subject]",
        subjectVariations: [
          "Following up on [Company Name]'s lead generation",
          "Circling back - [Company Name]'s appointment scheduling",
          "Quick follow-up for [First Name]"
        ],
        emailBody: `Hi [First Name],

I sent you a note last week about helping [Company Name] get more qualified appointments.

I know you're busy, so I'll keep this short:

We're currently delivering 10+ guaranteed appointments per month for companies like [Similar Company 1] and [Similar Company 2].

If getting more qualified prospects interested, here's a link to see some recent results: [Link to case studies]

If not, no worries - just reply "not interested" and I'll stop reaching out.

Thanks,
[Your Name]`,
        personalizationTips: "Reference the original conversation, keep tone respectful, provide easy out",
        industryFocus: "general",
        openRate: "31.20",
        replyRate: "12.80",
        pipelineGenerated: 95000,
        useCase: "First follow-up after no response to initial outreach",
        bestPractices: "Acknowledge their time, provide value/proof, offer easy unsubscribe",
        successStory: "Recovered 12.8% of non-responders, adding $95K to pipeline from follow-ups alone"
      },
      {
        title: "Value-Add Follow-Up",
        category: "follow-up",
        subCategory: "value-add", 
        subjectLine: "Free resource: Cold email templates that convert",
        subjectVariations: [
          "[First Name], here are the templates [Similar Company] uses",
          "Free download: High-converting email templates",
          "The cold email templates generating $2M+ pipeline"
        ],
        emailBody: `[First Name],

Since I haven't heard back, I thought you might find this valuable regardless:

I'm sharing the exact cold email templates that have generated $2M+ in pipeline for our clients - including the ones [Similar Company] used to book 47% more appointments.

Download here: [Link to template library]

These templates include:
• Subject lines with 40%+ open rates
• Email frameworks that get responses
• Follow-up sequences that close deals

Even if [Company Name] isn't ready to work with us, these templates should help your current lead gen efforts.

Worth bookmarking,
[Your Name]

P.S. If you'd like to see how we implement these at scale for clients, happy to show you: [Calendar link]`,
        personalizationTips: "Offer genuine value, reference previous clients, make the resource immediately useful",
        industryFocus: "general",
        openRate: "43.70",
        replyRate: "21.50",
        pipelineGenerated: 180000,
        useCase: "Second follow-up, providing valuable resource to build goodwill",
        bestPractices: "Lead with value, not sales pitch. Make resource immediately actionable",
        successStory: "This template generated $180K in delayed conversions from prospects who downloaded the resource"
      },
      {
        title: "Break-Up Email",
        category: "follow-up",
        subCategory: "breakup",
        subjectLine: "Closing the loop on [Company Name]'s lead generation",
        subjectVariations: [
          "Last email about [Company Name]'s appointments",
          "[First Name], closing the file on this",
          "Final follow-up for [Company Name]"
        ],
        emailBody: `Hi [First Name],

I haven't heard back, so I'm assuming [Company Name] either:

1. Already has lead generation handled
2. Isn't a priority right now  
3. My emails aren't reaching the right person

No worries - I get it. 

I'm closing the loop on this, but wanted to leave you with one thought:

[Similar Company] waited 6 months to start working with us. When they finally did, their VP of Sales said, "I wish we'd started this conversation sooner - we left a lot of deals on the table."

If something changes and you'd like to explore guaranteed appointments for [Company Name], you know where to find me.

Best of luck with everything,
[Your Name]

P.S. If this should go to someone else at [Company Name], just let me know and I'll redirect.`,
        personalizationTips: "Keep tone professional, acknowledge their situation, leave door open",
        industryFocus: "general", 
        openRate: "48.30",
        replyRate: "28.90",
        pipelineGenerated: 160000,
        useCase: "Final follow-up after 2-3 previous attempts with no response",
        bestPractices: "Acknowledge the situation, provide face-saving reasons, include soft social proof",
        successStory: "Break-up emails have the highest response rates (28.9%) and recovered $160K in 'lost' deals"
      },
      {
        title: "Re-Engagement Sequence", 
        category: "follow-up",
        subCategory: "re-engagement",
        subjectLine: "What changed at [Company Name]?",
        subjectVariations: [
          "[First Name], has [Company Name]'s situation changed?",
          "Checking in on [Company Name]'s growth goals",
          "6 months later: How's [Company Name]'s lead gen?"
        ],
        emailBody: `Hi [First Name],

It's been about 6 months since we last spoke about [Company Name]'s lead generation.

A lot can change in 6 months, so I wanted to check in:

• Are you still handling lead gen the same way?
• Has your appointment volume increased?
• Any new challenges with getting qualified prospects?

Since we last spoke, we've helped [Similar Company 1] increase appointments by 85% and [Similar Company 2] break their revenue record.

If [Company Name]'s situation has changed and you're open to exploring guaranteed appointments, I'd love to reconnect.

If not, that's totally fine too.

Best,
[Your Name]`,
        personalizationTips: "Reference timing since last contact, acknowledge change is natural, show recent wins",
        industryFocus: "general",
        openRate: "35.40",
        replyRate: "19.20", 
        pipelineGenerated: 125000,
        useCase: "Long-term follow-up (3-6 months) after initial conversation",
        bestPractices: "Acknowledge time passage, reference recent successes, keep expectations low-pressure",
        successStory: "Re-engagement campaigns recovered $125K from 'cold' prospects who weren't ready initially"
      },
      {
        title: "Meeting Scheduler",
        category: "follow-up",
        subCategory: "scheduling",
        subjectLine: "15 minutes to discuss [Company Name]'s appointments?",
        subjectVariations: [
          "[First Name], quick call about [Company Name]'s lead gen?",
          "Brief conversation about guaranteed appointments",
          "15-minute strategy call for [Company Name]?"
        ],
        emailBody: `Hi [First Name],

Thanks for expressing interest in our guaranteed appointment service for [Company Name].

Let's schedule a brief call to discuss:

• Your current lead generation process
• What qualified appointments look like for [Company Name] 
• How our 10 appointments guarantee would work
• Timeline to get started

I have a few slots open this week:

Tuesday 2pm EST: [Calendar link]
Wednesday 10am EST: [Calendar link]  
Friday 3pm EST: [Calendar link]

Or pick any time that works better: [General calendar link]

Looking forward to the conversation,
[Your Name]

P.S. The call will be 15 minutes max - I respect your time.`,
        personalizationTips: "Confirm their interest, set clear agenda, offer specific times, respect their schedule",
        industryFocus: "general",
        openRate: "52.10",
        replyRate: "34.60",
        pipelineGenerated: 220000,
        useCase: "When prospect has shown interest and you need to schedule a discovery call",
        bestPractices: "Confirm interest, provide clear agenda, offer multiple times, include direct calendar link",
        successStory: "Scheduled 200+ discovery calls, leading to $220K in closed business"
      },

      // SPECIALIZED TEMPLATES (5)
      {
        title: "C-Suite Executive Outreach",
        category: "specialized",
        subCategory: "c-suite",
        subjectLine: "CFO perspective: [Company Name]'s CAC vs. LTV",
        subjectVariations: [
          "[First Name], your CAC is likely 3x higher than it should be",
          "CEO insight: Why [Company Name]'s growth is expensive", 
          "[Company Name]'s unit economics - CEO briefing"
        ],
        emailBody: `[First Name],

As [Company Name]'s [Title], you probably know that most companies spend $200-500 to acquire each customer through traditional marketing.

What if I told you we're getting our clients qualified customers for $85-120 per acquisition?

The difference: Instead of casting wide nets hoping to catch fish, we deliver fish directly to your boat.

For [Similar Company CEO], this meant:
• 60% reduction in customer acquisition cost
• 3x improvement in sales team efficiency
• $340K additional profit in Q1 alone

The model is simple: We guarantee 10 qualified appointments per month, you pay only $200 per delivered appointment.

Worth a 10-minute CEO-to-CEO conversation?

[Your Name]
[Your Title]`,
        personalizationTips: "Use executive language, focus on business metrics, reference P&L impact, keep high-level",
        industryFocus: "general",
        openRate: "38.90",
        replyRate: "15.70",
        pipelineGenerated: 450000,
        useCase: "When targeting C-level executives who care about business metrics",
        bestPractices: "Focus on ROI and business impact, use executive-level language, keep it strategic",
        successStory: "Closed $450K in enterprise deals by speaking directly to business fundamentals"
      },
      {
        title: "Referral Request",
        category: "specialized", 
        subCategory: "referral",
        subjectLine: "[Referrer Name] suggested I reach out",
        subjectVariations: [
          "[Referrer Name] recommended I contact you",
          "Introduction from [Referrer Name] at [Referrer Company]",
          "[Referrer Name] thought you'd be interested in this"
        ],
        emailBody: `Hi [First Name],

[Referrer Name] at [Referrer Company] suggested I reach out to you.

They mentioned [Company Name] might be interested in our guaranteed appointment service - we help B2B companies get 10+ qualified meetings per month without any upfront costs.

[Referrer Name] has been thrilled with the results:
"[Specific quote about results or experience]"

Since [Referrer Name] recommended the introduction, would you be open to a brief 15-minute call to see if there's a fit for [Company Name]?

I can share exactly what we're doing for [Referrer Company] and how it might work for your situation.

Best,
[Your Name]

P.S. [Referrer Name] said to mention [specific detail or inside reference]`,
        personalizationTips: "Use referrer's actual words, include specific quotes, mention personal details",
        industryFocus: "general",
        openRate: "67.30",
        replyRate: "41.20",
        pipelineGenerated: 285000,
        useCase: "When you have a warm introduction or referral from existing client",
        bestPractices: "Mention referrer multiple times, use actual quotes, include personal touches",
        successStory: "Referral emails achieve 67.3% open rates and generated $285K from warm introductions"
      },
      {
        title: "Event-Based Outreach",
        category: "specialized",
        subCategory: "event-based", 
        subjectLine: "Saw your talk at [Event Name] - quick follow-up",
        subjectVariations: [
          "Great presentation at [Event Name], [First Name]",
          "Following up from [Event Name] - appointment question",
          "[Event Name] attendee with a quick question"
        ],
        emailBody: `Hi [First Name],

I was at [Event Name] and really enjoyed your presentation on [Topic].

Your point about [Specific Point They Made] really resonated - it's exactly what we help companies solve.

When you mentioned [Challenge They Discussed], it reminded me of a situation we handled for [Similar Company]. They had the same issue and we helped them get 10+ qualified appointments per month to address it.

Since we're both focused on [Related Topic/Challenge], would you be open to a quick call to discuss how this might help [Company Name]?

I can share the specific approach we used for [Similar Company] that resulted in [Specific Result].

Looking forward to connecting,
[Your Name]

P.S. Thanks again for the insights during your Q&A session - the point about [Specific Detail] was spot-on.`,
        personalizationTips: "Reference specific content from their presentation, mention exact details, connect to your solution",
        industryFocus: "general",
        openRate: "56.80",
        replyRate: "29.40",
        pipelineGenerated: 175000,
        useCase: "After meeting someone at an event, conference, or seeing their presentation",
        bestPractices: "Reference specific content, show you were paying attention, connect their expertise to your solution",
        successStory: "Event-based outreach generated $175K from conference and webinar follow-ups"
      },
      {
        title: "Case Study Share",
        category: "specialized",
        subCategory: "case-study",
        subjectLine: "Case study: How [Similar Company] got 47% more meetings",
        subjectVariations: [
          "[Company Name] case study - 47% more appointments",
          "Results: [Similar Company]'s appointment breakthrough",
          "How [Similar Company] solved [Specific Challenge]"
        ],
        emailBody: `Hi [First Name],

I just finished a case study that I think [Company Name] would find interesting.

[Similar Company] was in a similar situation - great product, solid team, but struggling to get enough qualified prospects in the pipeline.

Here's what we did and the results:

BEFORE:
• 4-6 appointments per month
• High cost per appointment ($400+)
• Long sales cycles (3+ months)
• Inconsistent lead quality

AFTER (3 months with us):
• 15-18 appointments per month  
• Cost per appointment: $200
• Faster qualification process
• $180K additional pipeline

The strategy: [Brief description of approach]

I'd love to show you the detailed case study and discuss how a similar approach might work for [Company Name].

Would you be interested in a 15-minute call this week?

Best,
[Your Name]

P.S. I can send the full case study ahead of our call if you'd like to review it first.`,
        personalizationTips: "Use companies in similar industry/size, include specific before/after metrics, offer detailed case study",
        industryFocus: "general",
        openRate: "44.10",
        replyRate: "26.30",
        pipelineGenerated: 230000,
        useCase: "When you have compelling case studies that match the prospect's situation",
        bestPractices: "Use clear before/after format, include specific metrics, offer detailed analysis",
        successStory: "Case study emails generated $230K by demonstrating proven results with similar companies"
      },
      {
        title: "Partnership Proposal",
        category: "specialized",
        subCategory: "partnership",
        subjectLine: "Partnership opportunity for [Company Name] clients",
        subjectVariations: [
          "Mutual referral opportunity - [Company Name] + [Your Company]",
          "[First Name], potential partnership discussion",
          "Adding value to [Company Name]'s client base"
        ],
        emailBody: `Hi [First Name],

I've been following [Company Name]'s growth and think there might be a mutually beneficial partnership opportunity.

Your clients get great [Service You Provide], but many probably struggle with getting enough qualified appointments to maximize their ROI from your work.

We specialize in delivering guaranteed appointments - 10+ per month for B2B companies, with no upfront costs.

Partnership concept:
• We could offer your clients a special rate/package
• You get referral commissions on successful partnerships
• Your clients get better results from your core services
• We get access to pre-qualified prospects who already invest in growth

[Existing Partner] has referred 12 clients in the past 6 months, earning $15K+ in commissions while helping their clients achieve better results.

Would you be open to a brief call to explore how this might work for [Company Name]'s client base?

Best,
[Your Name]`,
        personalizationTips: "Research their service offering, identify complementary nature, mention existing partner success",
        industryFocus: "agency",
        openRate: "41.70",
        replyRate: "22.80",
        pipelineGenerated: 195000,
        useCase: "When targeting potential partners who serve your ideal customer base",
        bestPractices: "Focus on mutual benefit, show how it helps their clients, include partner testimonial",
        successStory: "Partnership outreach generated $195K in referred business and established 8 ongoing referral relationships"
      }
    ];

    templates.forEach((template) => {
      const id = randomUUID();
      const now = new Date();
      const fullTemplate: EmailTemplate = {
        ...template,
        id,
        createdAt: now,
        updatedAt: now,
        // Ensure proper null handling for optional fields
        subCategory: template.subCategory || null,
        subjectVariations: template.subjectVariations || null,
        personalizationTips: template.personalizationTips || null,
        industryFocus: template.industryFocus || null,
        openRate: template.openRate || null,
        replyRate: template.replyRate || null,
        pipelineGenerated: template.pipelineGenerated || null,
        useCase: template.useCase || null,
        bestPractices: template.bestPractices || null,
        successStory: template.successStory || null
      };
      this.templates.set(id, fullTemplate);
    });
  }
}

// Create storage instance with fallback
function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    try {
      console.log('Using PostgreSQL database storage');
      return new DatabaseStorage();
    } catch (error) {
      console.warn('Database connection failed, falling back to in-memory storage:', error);
      return new MemStorage();
    }
  } else {
    console.warn('DATABASE_URL not found, using in-memory storage for development');
    return new MemStorage();
  }
}

export const storage = createStorage();
