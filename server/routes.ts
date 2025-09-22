import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import twilio from "twilio";
import { z } from "zod";
import puppeteer from "puppeteer";
import { 
  insertAuditSubmissionSchema, 
  type AuditSubmission,
  type EmailTemplate,
  type InsertAuditReport 
} from "@shared/schema";
// import { generateAuditVideoScript, generateVideoSpeechText, generateAvatarVideo } from "./ai-video-service";

// Website Audit Analysis Engine
interface WebsiteAuditResult {
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
}

async function performWebsiteAudit(urls: string[]): Promise<WebsiteAuditResult[]> {
  if (!urls || urls.length === 0) return [];
  
  const results: WebsiteAuditResult[] = [];
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    for (const url of urls.slice(0, 3)) { // Limit to 3 URLs for performance
      try {
        const auditResult = await auditSinglePage(browser, url);
        results.push(auditResult);
      } catch (error) {
        console.error(`Failed to audit ${url}:`, error);
        // Add failed audit with basic data
        results.push({
          url,
          pageLoadTime: 0,
          mobileResponsive: false,
          hasContactForm: false,
          ctaCount: 0,
          ctaQuality: 'poor',
          hasPhoneNumber: false,
          hasEmailAddress: false,
          contentLength: 0,
          hasValueProp: false,
          seoScore: 0,
          recommendations: ['Unable to analyze page - please check URL accessibility'],
          conversionScore: 0
        });
      }
    }
  } catch (error) {
    console.error('Browser launch failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

async function auditSinglePage(browser: any, url: string): Promise<WebsiteAuditResult> {
  const page = await browser.newPage();
  
  try {
    // Set mobile viewport for responsive testing
    await page.setViewport({ width: 375, height: 667 });
    
    // Measure page load time
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    const pageLoadTime = Date.now() - startTime;
    
    // Get page content and analyze
    const content = await page.content();
    const pageText = await page.evaluate(() => document.body.innerText);
    
    // Analyze CTA elements
    const ctaElements = await page.$$eval('button, a[href*="contact"], a[href*="demo"], a[href*="trial"], a[href*="signup"], input[type="submit"]', (elements: Element[]) => {
      return elements.map((el: Element) => ({
        text: el.textContent?.trim() || '',
        visible: (el as HTMLElement).offsetWidth > 0 && (el as HTMLElement).offsetHeight > 0
      }));
    });
    
    const visibleCTAs = ctaElements.filter((cta: {text: string, visible: boolean}) => cta.visible);
    const ctaCount = visibleCTAs.length;
    
    // Analyze CTA quality
    const strongCTAWords = ['get started', 'free trial', 'demo', 'contact', 'book', 'schedule', 'download'];
    const hasStrongCTA = visibleCTAs.some((cta: {text: string, visible: boolean}) => 
      strongCTAWords.some(word => cta.text.toLowerCase().includes(word))
    );
    
    const ctaQuality: 'poor' | 'good' | 'excellent' = 
      ctaCount === 0 ? 'poor' :
      ctaCount > 3 || hasStrongCTA ? 'excellent' : 'good';
    
    // Check for contact forms
    const hasContactForm = await page.$('form') !== null;
    
    // Check for contact information
    const hasPhoneNumber = /\b\d{3}-\d{3}-\d{4}\b|\(\d{3}\)\s*\d{3}-\d{4}/.test(pageText);
    const hasEmailAddress = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(pageText);
    
    // Check mobile responsiveness
    const mobileResponsive = await page.evaluate(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      return viewportMeta !== null;
    });
    
    // Content analysis
    const contentLength = pageText.length;
    
    // Value proposition analysis
    const valueWords = ['save', 'increase', 'improve', 'reduce', 'faster', 'better', 'solution', 'results'];
    const hasValueProp = valueWords.some(word => pageText.toLowerCase().includes(word));
    
    // Basic SEO analysis
    const title = await page.title();
    const metaDescription = await page.$eval('meta[name="description"]', (el: Element) => el.getAttribute('content')).catch(() => '');
    const h1Count = await page.$$eval('h1', (elements: Element[]) => elements.length);
    
    let seoScore = 0;
    if (title && title.length > 10 && title.length < 60) seoScore += 25;
    if (metaDescription && metaDescription.length > 50 && metaDescription.length < 160) seoScore += 25;
    if (h1Count === 1) seoScore += 25;
    if (hasPhoneNumber || hasEmailAddress) seoScore += 25;
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (pageLoadTime > 3000) {
      recommendations.push('Optimize page load speed - currently taking over 3 seconds');
    }
    if (ctaCount < 2) {
      recommendations.push('Add more clear call-to-action buttons to increase conversions');
    }
    if (!hasContactForm) {
      recommendations.push('Add a contact form to capture lead information');
    }
    if (!mobileResponsive) {
      recommendations.push('Implement responsive design for mobile users');
    }
    if (!hasValueProp) {
      recommendations.push('Strengthen value proposition messaging on the page');
    }
    if (seoScore < 75) {
      recommendations.push('Improve SEO elements (title tags, meta descriptions, headings)');
    }
    
    // Calculate conversion score
    let conversionScore = 0;
    if (hasContactForm) conversionScore += 20;
    if (ctaCount >= 2) conversionScore += 20;
    if (hasPhoneNumber || hasEmailAddress) conversionScore += 15;
    if (mobileResponsive) conversionScore += 15;
    if (pageLoadTime < 3000) conversionScore += 15;
    if (hasValueProp) conversionScore += 15;
    
    return {
      url,
      pageLoadTime,
      mobileResponsive,
      hasContactForm,
      ctaCount,
      ctaQuality,
      hasPhoneNumber,
      hasEmailAddress,
      contentLength,
      hasValueProp,
      seoScore,
      recommendations,
      conversionScore
    };
    
  } finally {
    await page.close();
  }
}

// Audit Analysis Engine
async function generateAuditReport(submission: AuditSubmission): Promise<InsertAuditReport> {
  // Perform website audit if enabled and URLs provided
  let websiteAuditResults: WebsiteAuditResult[] = [];
  if (submission.enableWebsiteAudit && submission.landingPageUrls && submission.landingPageUrls.length > 0) {
    console.log('Performing website audit for URLs:', submission.landingPageUrls);
    websiteAuditResults = await performWebsiteAudit(submission.landingPageUrls);
    console.log('Website audit completed:', websiteAuditResults.length, 'pages analyzed');
  }
  
  // Calculate overall efficiency score based on current metrics
  const currentEfficiencyScore = calculateCurrentEfficiency(submission, websiteAuditResults);
  const potentialImprovementScore = calculatePotentialImprovement(submission, websiteAuditResults);
  const overallScore = Math.round((currentEfficiencyScore + potentialImprovementScore) / 2);
  
  // Calculate ROI and projections
  const estimatedROI = calculateEstimatedROI(submission);
  const projectedAppointmentIncrease = calculateAppointmentIncrease(submission);
  const projectedRevenueIncrease = calculateRevenueIncrease(submission);
  
  // Generate recommendations based on audit findings
  const recommendations = generateRecommendations(submission, currentEfficiencyScore, websiteAuditResults);
  
  // Create implementation plan
  const implementationPlan = generateImplementationPlan(recommendations);
  
  // Generate benchmark data
  const benchmarkData = generateBenchmarkData(submission);

  return {
    submissionId: submission.id,
    overallScore,
    currentEfficiencyScore,
    potentialImprovementScore,
    estimatedROI,
    projectedAppointmentIncrease,
    projectedRevenueIncrease,
    recommendations,
    implementationPlan,
    benchmarkData,
    websiteAuditResults: websiteAuditResults.length > 0 ? websiteAuditResults : undefined
  };
}

function calculateCurrentEfficiency(submission: AuditSubmission, websiteAuditResults: WebsiteAuditResult[] = []): number {
  let score = 30; // Base score (lowered to account for comprehensive analysis)
  
  // EMAIL & OUTBOUND EFFICIENCY (25 points max)
  if (submission.currentEmailVolume && submission.currentAppointmentsPerMonth) {
    const appointmentRate = (submission.currentAppointmentsPerMonth / submission.currentEmailVolume) * 100;
    if (appointmentRate > 5) score += 15;
    else if (appointmentRate > 3) score += 12;
    else if (appointmentRate > 2) score += 8;
    else if (appointmentRate > 1) score += 4;
    else score -= 5;
  }
  
  // Lead gen method sophistication
  const leadGenMethods = submission.currentLeadGenMethods?.length || 0;
  if (leadGenMethods > 3) score += 10;
  else if (leadGenMethods > 1) score += 5;
  else if (leadGenMethods === 0) score -= 10;
  
  // SALES PROCESS MATURITY (20 points max)
  if (submission.hasCRM) score += 8;
  if (submission.hasEmailSequences) score += 8;
  if (submission.salesQualificationProcess) score += 4;
  
  // PERFORMANCE METRICS (15 points max)
  if (submission.closingRate) {
    const closingRateNum = parseFloat(submission.closingRate.toString());
    if (closingRateNum > 25) score += 15;
    else if (closingRateNum > 15) score += 12;
    else if (closingRateNum > 10) score += 8;
    else if (closingRateNum > 5) score += 5;
  }
  
  // TECHNICAL SOPHISTICATION (15 points max)
  const analyticsSetup = submission.analyticsSetup?.length || 0;
  if (analyticsSetup > 3) score += 8;
  else if (analyticsSetup > 1) score += 5;
  else if (analyticsSetup === 0) score -= 5;
  
  const salesTools = submission.salesEnablementTools?.length || 0;
  if (salesTools > 2) score += 7;
  else if (salesTools > 0) score += 4;
  
  // CONTENT & MARKET POSITIONING (10 points max)
  const valueProps = submission.currentValueProps?.length || 0;
  if (valueProps > 2) score += 5;
  else if (valueProps > 0) score += 3;
  
  const competitiveAdvantages = submission.competitiveAdvantages?.length || 0;
  if (competitiveAdvantages > 1) score += 5;
  else if (competitiveAdvantages > 0) score += 2;
  
  // TARGET AUDIENCE CLARITY (10 points max)
  const targetIndustries = submission.targetIndustries?.length || 0;
  const targetSizes = submission.targetCompanySizes?.length || 0;
  const targetRoles = submission.targetDecisionMakers?.length || 0;
  
  if (targetIndustries > 0 && targetSizes > 0 && targetRoles > 0) score += 10;
  else if ((targetIndustries + targetSizes + targetRoles) > 3) score += 6;
  else if ((targetIndustries + targetSizes + targetRoles) > 1) score += 3;
  
  // WEBSITE/DIGITAL PRESENCE (10 points max - enhanced with website audit)
  if (submission.websiteTrafficPerMonth && typeof submission.websiteTrafficPerMonth === 'number' && submission.websiteTrafficPerMonth > 1000) score += 3;
  if (submission.leadToCustomerRate && typeof submission.leadToCustomerRate === 'number' && submission.leadToCustomerRate > 5) score += 2;
  
  // Website audit scoring
  if (websiteAuditResults.length > 0) {
    const avgConversionScore = websiteAuditResults.reduce((sum, result) => sum + result.conversionScore, 0) / websiteAuditResults.length;
    if (avgConversionScore > 80) score += 5;
    else if (avgConversionScore > 60) score += 3;
    else if (avgConversionScore > 40) score += 1;
  }
  
  return Math.min(Math.max(score, 10), 100);
}

function calculatePotentialImprovement(submission: AuditSubmission, websiteAuditResults: WebsiteAuditResult[] = []): number {
  let improvementScore = 20; // Base improvement potential
  
  // PROCESS & TOOL GAPS (35 points max)
  if (!submission.hasEmailSequences) improvementScore += 18;
  if (!submission.hasCRM) improvementScore += 12;
  if (!submission.salesQualificationProcess) improvementScore += 5;
  
  // PERFORMANCE GAPS (25 points max)
  if ((submission.currentAppointmentsPerMonth || 0) < 15) improvementScore += 15;
  const leadToCustomerRate = typeof submission.leadToCustomerRate === 'number' ? submission.leadToCustomerRate : 0;
  if (leadToCustomerRate < 10) improvementScore += 5;
  const websiteTraffic = typeof submission.websiteTrafficPerMonth === 'number' ? submission.websiteTrafficPerMonth : 0;
  if (websiteTraffic < 2000) improvementScore += 5;
  
  // TARGET AUDIENCE CLARITY GAPS (15 points max)
  const targetingClarity = (submission.targetIndustries?.length || 0) + 
                          (submission.targetCompanySizes?.length || 0) + 
                          (submission.targetDecisionMakers?.length || 0);
  if (targetingClarity < 3) improvementScore += 15;
  else if (targetingClarity < 6) improvementScore += 8;
  
  // CONTENT & COMPETITIVE POSITIONING GAPS (10 points max)
  if ((submission.currentValueProps?.length || 0) < 2) improvementScore += 5;
  if ((submission.competitiveAdvantages?.length || 0) < 2) improvementScore += 5;
  
  // ANALYTICS & TRACKING GAPS (10 points max)
  if ((submission.analyticsSetup?.length || 0) < 2) improvementScore += 5;
  if (!submission.attributionModelUsed) improvementScore += 5;
  
  // COMPANY SIZE & GROWTH OPPORTUNITY (10 points max)
  const companySize = submission.companySize;
  if (companySize === '11-50' || companySize === '51-200') improvementScore += 8;
  else if (companySize === '200+') improvementScore += 5;
  else if (companySize === '1-10') improvementScore += 10; // Highest growth potential
  
  // REVENUE GROWTH OPPORTUNITY (15 points max)
  const currentRevenue = submission.currentRevenue;
  const targetRevenue = submission.targetRevenue;
  
  // Calculate revenue growth potential based on current vs target
  if (currentRevenue.includes('0-10k') && targetRevenue.includes('500k')) improvementScore += 15;
  else if (currentRevenue.includes('50k') && targetRevenue.includes('1m')) improvementScore += 12;
  else if (targetRevenue.includes('5m') || targetRevenue.includes('10m')) improvementScore += 10;
  
  // WEBSITE OPTIMIZATION OPPORTUNITIES (10 points max)
  if (websiteAuditResults.length > 0) {
    const avgConversionScore = websiteAuditResults.reduce((sum, result) => sum + result.conversionScore, 0) / websiteAuditResults.length;
    const hasSlowPages = websiteAuditResults.some(result => result.pageLoadTime > 3000);
    const hasPoorSEO = websiteAuditResults.some(result => result.seoScore < 75);
    const hasWeakCTAs = websiteAuditResults.some(result => result.ctaCount < 2);
    
    if (avgConversionScore < 60) improvementScore += 10;
    else if (avgConversionScore < 80) improvementScore += 6;
    
    if (hasSlowPages || hasPoorSEO || hasWeakCTAs) improvementScore += 5;
  }
  
  return Math.min(improvementScore, 100);
}

function calculateEstimatedROI(submission: AuditSubmission): number {
  const averageDeal = submission.averageDealSize || 5000;
  const currentAppointments = submission.currentAppointmentsPerMonth || 5;
  const closingRate = parseFloat(submission.closingRate?.toString() || '10') / 100;
  
  // Current monthly revenue
  const currentRevenue = currentAppointments * averageDeal * closingRate;
  
  // Projected revenue with improvements (conservative 3x appointment increase)
  const projectedAppointments = Math.min(currentAppointments * 3, 30);
  const projectedRevenue = projectedAppointments * averageDeal * Math.min(closingRate * 1.5, 0.4);
  
  // Investment (conservative $3K/month for lead gen services)
  const investment = 3000;
  
  // ROI calculation
  const additionalRevenue = projectedRevenue - currentRevenue;
  const roi = ((additionalRevenue - investment) / investment) * 100;
  
  return Math.round(Math.max(roi, 150)); // Minimum 150% ROI
}

function calculateAppointmentIncrease(submission: AuditSubmission): number {
  const current = submission.currentAppointmentsPerMonth || 5;
  
  // Conservative estimates based on industry data
  if (current < 5) return 300; // 3x increase for very low volume
  if (current < 10) return 200; // 2x increase for low volume
  if (current < 20) return 150; // 1.5x increase for medium volume
  return 100; // 100% increase for higher volume
}

function calculateRevenueIncrease(submission: AuditSubmission): number {
  const averageDeal = submission.averageDealSize || 5000;
  const currentAppointments = submission.currentAppointmentsPerMonth || 5;
  const closingRate = parseFloat(submission.closingRate?.toString() || '10') / 100;
  const appointmentIncrease = calculateAppointmentIncrease(submission) / 100;
  
  const additionalAppointments = currentAppointments * appointmentIncrease;
  const additionalRevenue = additionalAppointments * averageDeal * closingRate;
  
  return Math.round(additionalRevenue);
}

function generateRecommendations(submission: AuditSubmission, efficiencyScore: number, websiteAuditResults: WebsiteAuditResult[] = []): any[] {
  const recommendations = [];
  
  // CRITICAL INFRASTRUCTURE GAPS (High Priority)
  if (!submission.hasEmailSequences) {
    recommendations.push({
      priority: 'high' as const,
      category: 'Email Automation',
      title: 'Implement Multi-Touch Email Sequences',
      description: 'Set up automated follow-up sequences to nurture prospects who don\'t respond to initial outreach. This alone can increase response rates by 250%.',
      timeToImplement: '2-3 weeks',
      estimatedImpact: '+150% appointment bookings',
      tools: ['HubSpot', 'Outreach.io', 'Apollo', 'Lemlist']
    });
  }
  
  if (!submission.hasCRM) {
    recommendations.push({
      priority: 'high' as const,
      category: 'Lead Management',
      title: 'Deploy CRM System',
      description: 'Implement a CRM to track prospects, manage pipeline, and prevent leads from falling through cracks. Essential for scaling beyond $1M ARR.',
      timeToImplement: '1-2 weeks',
      estimatedImpact: '+80% lead conversion',
      tools: ['HubSpot CRM', 'Pipedrive', 'Salesforce', 'Close']
    });
  }
  
  // TARGET AUDIENCE OPTIMIZATION (High Priority)
  const targetingClarity = (submission.targetIndustries?.length || 0) + 
                          (submission.targetCompanySizes?.length || 0) + 
                          (submission.targetDecisionMakers?.length || 0);
  
  if (targetingClarity < 4) {
    recommendations.push({
      priority: 'high' as const,
      category: 'Target Audience Optimization',
      title: 'Define Your Ideal Customer Profile (ICP)',
      description: 'You lack clarity on your target audience. Define specific industries, company sizes, and decision-maker roles to improve messaging and targeting precision by 300%.',
      timeToImplement: '1-2 weeks',
      estimatedImpact: '+200% email response rates',
      tools: ['Apollo', 'ZoomInfo', 'Clay', 'LinkedIn Sales Navigator']
    });
  }
  
  // PERFORMANCE SCALING (High Priority)
  if ((submission.currentAppointmentsPerMonth || 0) < 15) {
    recommendations.push({
      priority: 'high' as const,
      category: 'Lead Generation Scale',
      title: 'Scale Appointment Generation',
      description: 'Your current appointment volume is below industry benchmarks. Implement systematic outbound processes to reach 15-25 appointments monthly.',
      timeToImplement: '3-4 weeks',
      estimatedImpact: '+200% appointment volume',
      tools: ['Brightside AI', 'Apollo', 'ZoomInfo', 'Clay']
    });
  }
  
  // CONTENT & MESSAGING OPTIMIZATION (Medium Priority)
  if ((submission.currentValueProps?.length || 0) < 2) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Value Proposition',
      title: 'Strengthen Value Proposition',
      description: 'Develop clear, compelling value propositions that differentiate you from competitors. Strong value props can double email response rates.',
      timeToImplement: '2-3 weeks',
      estimatedImpact: '+120% email responses',
      tools: ['StoryBrand Framework', 'Value Prop Canvas', 'Customer Interviews']
    });
  }
  
  // COMPETITIVE POSITIONING (Medium Priority)
  if ((submission.competitiveAdvantages?.length || 0) < 2) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Competitive Positioning',
      title: 'Define Competitive Advantages',
      description: 'Identify and articulate what makes you unique versus competitors. Clear positioning improves win rates by 40%.',
      timeToImplement: '1-2 weeks',
      estimatedImpact: '+40% closing rate',
      tools: ['Competitive Analysis', 'SWOT Framework', 'Battle Cards']
    });
  }
  
  // SALES PROCESS OPTIMIZATION (Medium Priority)
  if (!submission.salesQualificationProcess) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Sales Process',
      title: 'Implement Lead Qualification Framework',
      description: 'Deploy systematic lead qualification (BANT/MEDDIC) to focus on highest-value prospects and improve conversion rates.',
      timeToImplement: '1-2 weeks',
      estimatedImpact: '+60% sales efficiency',
      tools: ['BANT Framework', 'MEDDIC', 'Custom Scoring Models']
    });
  }
  
  // ANALYTICS & ATTRIBUTION (Medium Priority)
  if ((submission.analyticsSetup?.length || 0) < 2) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Analytics & Tracking',
      title: 'Implement Revenue Attribution',
      description: 'Track which marketing channels and campaigns generate the highest-value customers. Essential for optimizing marketing spend and scaling what works.',
      timeToImplement: '1-2 weeks',
      estimatedImpact: '+35% marketing ROI',
      tools: ['Google Analytics 4', 'HubSpot Attribution', 'Salesforce Reports', 'ChartMogul']
    });
  }
  
  // CONTENT MARKETING (Medium Priority)
  if ((submission.primaryContentFormats?.length || 0) < 2) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Content Strategy',
      title: 'Develop Multi-Channel Content Strategy',
      description: 'Create valuable content across multiple formats (blogs, videos, templates) to build authority and capture more inbound leads.',
      timeToImplement: '3-4 weeks',
      estimatedImpact: '+150% inbound leads',
      tools: ['ConvertKit', 'Leadpages', 'Unbounce', 'Loom', 'Canva']
    });
  }
  
  // WEBSITE OPTIMIZATION (Based on Website Audit Results)
  if (websiteAuditResults.length > 0) {
    const avgConversionScore = websiteAuditResults.reduce((sum, result) => sum + result.conversionScore, 0) / websiteAuditResults.length;
    const hasSlowPages = websiteAuditResults.some(result => result.pageLoadTime > 3000);
    const hasPoorSEO = websiteAuditResults.some(result => result.seoScore < 75);
    const hasWeakCTAs = websiteAuditResults.some(result => result.ctaCount < 2);
    const lacksContactForms = websiteAuditResults.some(result => !result.hasContactForm);
    const notMobileOptimized = websiteAuditResults.some(result => !result.mobileResponsive);
    
    // High priority website recommendations
    if (avgConversionScore < 50) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Website Conversion',
        title: 'Critical Website Conversion Optimization',
        description: `Your landing pages scored ${Math.round(avgConversionScore)}/100 for conversion optimization. This requires immediate attention to capture more leads from your traffic.`,
        timeToImplement: '2-3 weeks',
        estimatedImpact: '+200% website conversions',
        tools: ['Unbounce', 'Leadpages', 'Hotjar', 'Google Optimize']
      });
    }
    
    // Medium priority website recommendations
    if (hasSlowPages) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Page Speed Optimization',
        title: 'Improve Page Load Speed',
        description: 'Your pages are loading slower than 3 seconds, which significantly impacts conversion rates. Fast-loading pages convert 2-3x better.',
        timeToImplement: '1-2 weeks',
        estimatedImpact: '+40% conversion rate',
        tools: ['GTmetrix', 'PageSpeed Insights', 'CloudFlare', 'WP Rocket']
      });
    }
    
    if (hasWeakCTAs || lacksContactForms) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Lead Capture Optimization',
        title: 'Strengthen Call-to-Action Elements',
        description: 'Your pages lack sufficient call-to-action buttons or contact forms. Adding clear CTAs can double your lead capture rate.',
        timeToImplement: '1 week',
        estimatedImpact: '+120% lead capture',
        tools: ['Typeform', 'ConvertKit', 'Leadpages', 'Calendly']
      });
    }
    
    // Low priority website recommendations
    if (hasPoorSEO) {
      recommendations.push({
        priority: 'low' as const,
        category: 'SEO Optimization',
        title: 'Improve Search Engine Optimization',
        description: 'Your pages need better SEO elements (title tags, meta descriptions, headings) to improve organic traffic and credibility.',
        timeToImplement: '1-2 weeks',
        estimatedImpact: '+30% organic traffic',
        tools: ['Yoast SEO', 'SEMrush', 'Ahrefs', 'Google Search Console']
      });
    }
    
    if (notMobileOptimized) {
      recommendations.push({
        priority: 'low' as const,
        category: 'Mobile Optimization',
        title: 'Implement Mobile-First Design',
        description: 'Your pages are not optimized for mobile users, who represent 50%+ of website traffic. Mobile optimization is essential for conversions.',
        timeToImplement: '2-3 weeks',
        estimatedImpact: '+60% mobile conversions',
        tools: ['Bootstrap', 'Tailwind CSS', 'WordPress Mobile Themes', 'AMP']
      });
    }
  } else if (submission.enableWebsiteAudit) {
    // Fallback recommendation if website audit was enabled but failed
    const websiteConversionRate = typeof submission.currentWebsiteConversionRate === 'number' ? submission.currentWebsiteConversionRate : 0;
    if (websiteConversionRate < 3) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Website Optimization',
        title: 'Optimize Website Conversion Rate',
        description: 'Your self-reported website conversion rate is below industry average. Focus on improving user experience and lead capture elements.',
        timeToImplement: '2-3 weeks',
        estimatedImpact: '+80% website conversions',
        tools: ['Unbounce', 'Optimizely', 'Hotjar', 'Google Optimize']
      });
    }
  }
  
  // SALES ENABLEMENT (Low Priority)
  if ((submission.salesEnablementTools?.length || 0) < 2) {
    recommendations.push({
      priority: 'low' as const,
      category: 'Sales Enablement',
      title: 'Deploy Sales Enablement Tools',
      description: 'Equip your sales team with better tools for prospecting, engagement, and closing to improve efficiency and results.',
      timeToImplement: '2-3 weeks',
      estimatedImpact: '+25% sales productivity',
      tools: ['Gong', 'Outreach', 'PandaDoc', 'Calendly']
    });
  }
  
  // Prioritize and return top recommendations
  const highPriority = recommendations.filter(r => r.priority === 'high');
  const mediumPriority = recommendations.filter(r => r.priority === 'medium');
  const lowPriority = recommendations.filter(r => r.priority === 'low');
  
  return [...highPriority.slice(0, 3), ...mediumPriority.slice(0, 3), ...lowPriority.slice(0, 2)];
}

function generateImplementationPlan(recommendations: any[]): any[] {
  const highPriority = recommendations.filter(r => r.priority === 'high');
  const mediumPriority = recommendations.filter(r => r.priority === 'medium');
  
  const plan = [];
  
  // Phase 1: Quick wins and foundation (Month 1)
  plan.push({
    phase: 1,
    title: 'Foundation & Quick Wins',
    duration: '4 weeks',
    tasks: [
      'Set up CRM system and import existing leads',
      'Implement basic email sequences (3-5 touch points)',
      'Create lead capture forms and qualification criteria',
      'Set up basic tracking and reporting'
    ],
    expectedResults: 'Double appointment booking rate, organize existing pipeline'
  });
  
  // Phase 2: Scale and optimize (Month 2)
  plan.push({
    phase: 2,
    title: 'Scale & Optimize',
    duration: '4 weeks', 
    tasks: [
      'Launch systematic outbound campaigns',
      'Develop and deploy lead magnets',
      'Optimize email sequences based on performance data',
      'Implement advanced lead scoring and routing'
    ],
    expectedResults: 'Triple monthly appointment volume, improve lead quality'
  });
  
  // Phase 3: Advanced automation (Month 3)
  plan.push({
    phase: 3,
    title: 'Advanced Automation',
    duration: '4 weeks',
    tasks: [
      'Deploy AI-powered lead enrichment',
      'Implement advanced nurture sequences',
      'Set up revenue attribution reporting',
      'Create predictable pipeline forecasting'
    ],
    expectedResults: 'Achieve consistent 15-20 appointments monthly, predictable revenue'
  });
  
  return plan;
}

function generateBenchmarkData(submission: AuditSubmission): any[] {
  const industry = submission.industry;
  const companySize = submission.companySize;
  
  // Determine industry multipliers for more accurate benchmarks
  const isSaaS = industry.toLowerCase().includes('saas') || industry.toLowerCase().includes('software');
  const isB2B = industry.toLowerCase().includes('b2b') || industry.toLowerCase().includes('technology');
  
  // Company size multipliers
  const sizeMultiplier = companySize === '1-10' ? 0.8 : 
                        companySize === '11-50' ? 1.0 : 
                        companySize === '51-200' ? 1.3 : 1.5;
  
  const benchmarks = [
    {
      metric: 'Monthly Appointments',
      currentValue: submission.currentAppointmentsPerMonth || 5,
      industryAverage: Math.round((isSaaS ? 15 : 10) * sizeMultiplier),
      topPerformers: Math.round((isSaaS ? 30 : 22) * sizeMultiplier)
    },
    {
      metric: 'Email-to-Appointment Rate (%)',
      currentValue: submission.currentEmailVolume ? 
        Math.round(((submission.currentAppointmentsPerMonth || 5) / submission.currentEmailVolume) * 100 * 10) / 10 : 2.5,
      industryAverage: isSaaS ? 3.8 : 3.2,
      topPerformers: isSaaS ? 9.5 : 8.0
    },
    {
      metric: 'Average Deal Size ($)',
      currentValue: submission.averageDealSize || 5000,
      industryAverage: Math.round((isSaaS ? 12000 : 7500) * sizeMultiplier),
      topPerformers: Math.round((isSaaS ? 25000 : 15000) * sizeMultiplier)
    },
    {
      metric: 'Sales Cycle (Days)',
      currentValue: submission.salesCycleLength === '1-3 months' ? 60 : 
                   submission.salesCycleLength === '3-6 months' ? 120 : 
                   submission.salesCycleLength === '6+ months' ? 180 : 45,
      industryAverage: isSaaS ? 52 : 42,
      topPerformers: isSaaS ? 35 : 28
    },
    {
      metric: 'Closing Rate (%)',
      currentValue: parseFloat(submission.closingRate?.toString() || '10'),
      industryAverage: isSaaS ? 18.5 : 15.5,
      topPerformers: isSaaS ? 32.0 : 28.0
    },
    {
      metric: 'Lead-to-Customer Rate (%)',
      currentValue: typeof submission.leadToCustomerRate === 'number' ? submission.leadToCustomerRate : 8,
      industryAverage: isSaaS ? 12.0 : 9.5,
      topPerformers: isSaaS ? 22.0 : 18.0
    },
    {
      metric: 'Website Traffic (Monthly)',
      currentValue: typeof submission.websiteTrafficPerMonth === 'number' ? submission.websiteTrafficPerMonth : 1000,
      industryAverage: Math.round((isSaaS ? 5000 : 3500) * sizeMultiplier),
      topPerformers: Math.round((isSaaS ? 15000 : 10000) * sizeMultiplier)
    },
    {
      metric: 'Customer Acquisition Cost ($)',
      currentValue: typeof submission.currentCAC === 'number' ? submission.currentCAC : 1500,
      industryAverage: Math.round((isSaaS ? 1800 : 1200) * sizeMultiplier),
      topPerformers: Math.round((isSaaS ? 900 : 600) * sizeMultiplier)
    }
  ];
  
  // Add tool/process sophistication benchmarks
  benchmarks.push({
    metric: 'Marketing Tools Used',
    currentValue: (submission.currentTools?.length || 0) + (submission.analyticsSetup?.length || 0),
    industryAverage: isSaaS ? 6 : 4,
    topPerformers: isSaaS ? 12 : 8
  });
  
  benchmarks.push({
    metric: 'Target Audience Clarity Score',
    currentValue: (submission.targetIndustries?.length || 0) + 
                 (submission.targetCompanySizes?.length || 0) + 
                 (submission.targetDecisionMakers?.length || 0),
    industryAverage: 5,
    topPerformers: 9
  });
  
  return benchmarks;
}

// Form submission schema
const applicationSchema = z.object({
  companyName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  website: z.string().url(),
  currentRevenue: z.string().min(1),
  desiredRevenue: z.string().min(1),
  agreesToPay: z.boolean().refine(val => val === true, "Must agree to terms")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // EMAIL TEMPLATE ROUTES
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json({ templates });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  app.get("/api/templates/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const templates = await storage.getTemplatesByCategory(category);
      res.json({ templates });
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  // AUDIT SYSTEM ROUTES
  app.post("/api/audit-submission", async (req, res) => {
    try {
      const validatedData = insertAuditSubmissionSchema.parse(req.body);
      
      // Clamp decimal fields to prevent overflow (DECIMAL(5,2) can only hold -999.99 to 999.99)
      const clampedData = {
        ...validatedData,
        closingRate: validatedData.closingRate ? String(Math.max(-999.99, Math.min(999.99, Number(validatedData.closingRate)))) : validatedData.closingRate,
        leadToCustomerRate: validatedData.leadToCustomerRate ? String(Math.max(-999.99, Math.min(999.99, Number(validatedData.leadToCustomerRate)))) : validatedData.leadToCustomerRate,
        currentWebsiteConversionRate: validatedData.currentWebsiteConversionRate ? String(Math.max(-999.99, Math.min(999.99, Number(validatedData.currentWebsiteConversionRate)))) : validatedData.currentWebsiteConversionRate,
      };
      
      console.log('Submitting audit data (decimal values clamped):', JSON.stringify(clampedData, null, 2));
      
      // Create audit submission
      const submission = await storage.createAuditSubmission(clampedData);
      console.log('Created audit submission:', submission.id);
      
      // Generate automated audit report
      const report = await generateAuditReport(submission);
      console.log('Generated audit report for submission:', report.submissionId);
      const savedReport = await storage.createAuditReport(report);
      console.log('Saved audit report with ID:', savedReport.id);

      res.json({ 
        success: true, 
        submissionId: submission.id,
        message: 'Audit submission successful! Your report is ready.',
      });
    } catch (error) {
      console.error('Error creating audit submission:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Failed to submit audit. Please check your data and try again.' 
      });
    }
  });

  app.get("/api/audit-report/:submissionId", async (req, res) => {
    try {
      const { submissionId } = req.params;
      console.log('Fetching audit report for submissionId:', submissionId);
      const submission = await storage.getAuditSubmission(submissionId);
      console.log('Found submission:', submission ? 'YES' : 'NO');
      const report = await storage.getAuditReport(submissionId);
      console.log('Found report:', report ? 'YES' : 'NO');
      
      if (!submission || !report) {
        console.log('Missing data - submission:', !!submission, 'report:', !!report);
        return res.status(404).json({ error: 'Audit report not found' });
      }

      res.json({ 
        submission,
        report,
        success: true 
      });
    } catch (error) {
      console.error('Error fetching audit report:', error);
      res.status(500).json({ error: 'Failed to fetch audit report' });
    }
  });

  // PDF GENERATION FOR AUDIT REPORTS
  app.get("/api/audit-report/:submissionId/pdf", async (req, res) => {
    let browser;
    try {
      const { submissionId } = req.params;
      const submission = await storage.getAuditSubmission(submissionId);
      const report = await storage.getAuditReport(submissionId);
      
      if (!submission || !report) {
        return res.status(404).json({ error: 'Audit report not found' });
      }

      const puppeteer = require('puppeteer');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Lead Generation Audit Report - ${submission.companyName}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
            }
            .company-name { 
              font-size: 2.5rem; 
              font-weight: bold; 
              color: #1e40af;
              margin-bottom: 10px;
            }
            .report-title { 
              font-size: 1.8rem; 
              color: #6b7280; 
              margin-bottom: 10px;
            }
            .date { 
              color: #9ca3af; 
              font-size: 1rem;
            }
            .score-section {
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              text-align: center;
              margin: 30px 0;
            }
            .score-number {
              font-size: 4rem;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .score-label {
              font-size: 1.2rem;
              opacity: 0.9;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 30px 0;
            }
            .metric-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .metric-value {
              font-size: 2rem;
              font-weight: bold;
              color: #059669;
              margin-bottom: 5px;
            }
            .metric-label {
              color: #6b7280;
              font-size: 0.9rem;
            }
            .section {
              margin: 40px 0;
            }
            .section-title {
              font-size: 1.5rem;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 20px;
              border-left: 4px solid #3b82f6;
              padding-left: 15px;
            }
            .recommendation {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 15px;
            }
            .rec-priority {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .priority-high { background: #fef2f2; color: #dc2626; }
            .priority-medium { background: #fffbeb; color: #d97706; }
            .priority-low { background: #f0fdf4; color: #059669; }
            .rec-title {
              font-weight: bold;
              font-size: 1.1rem;
              margin-bottom: 8px;
            }
            .rec-description {
              color: #6b7280;
              margin-bottom: 10px;
            }
            .rec-impact {
              font-size: 0.9rem;
              color: #059669;
              font-weight: 500;
            }
            .implementation-item {
              display: flex;
              align-items: center;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            .timeline {
              background: #3b82f6;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: bold;
              margin-right: 15px;
            }
            .task-title {
              font-weight: 500;
              flex-grow: 1;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${submission.companyName}</div>
            <div class="report-title">Lead Generation Audit Report</div>
            <div class="date">Generated on ${new Date().toLocaleDateString()}</div>
          </div>

          <div class="score-section">
            <div class="score-number">${report.overallScore}</div>
            <div class="score-label">Overall Lead Generation Score</div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${report.estimatedROI ? `$${report.estimatedROI.toLocaleString()}` : 'N/A'}</div>
              <div class="metric-label">Estimated ROI (12 months)</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${report.projectedAppointmentIncrease ? `+${report.projectedAppointmentIncrease}%` : 'N/A'}</div>
              <div class="metric-label">Projected Appointment Increase</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${report.projectedRevenueIncrease ? `+${report.projectedRevenueIncrease}%` : 'N/A'}</div>
              <div class="metric-label">Projected Revenue Increase</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${report.recommendations ? report.recommendations.length : 0}</div>
              <div class="metric-label">Key Recommendations</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Key Recommendations</div>
            ${report.recommendations ? report.recommendations.map(rec => `
              <div class="recommendation">
                <div class="rec-priority priority-${rec.priority.toLowerCase()}">${rec.priority.toUpperCase()} PRIORITY</div>
                <div class="rec-title">${rec.title}</div>
                <div class="rec-description">${rec.description}</div>
                <div class="rec-impact">Expected Impact: ${rec.estimatedImpact}</div>
              </div>
            `).join('') : '<p>No recommendations available.</p>'}
          </div>

          <div class="section">
            <div class="section-title">90-Day Implementation Plan</div>
            ${report.implementationPlan ? report.implementationPlan.map(item => `
              <div class="implementation-item">
                <div class="timeline">Phase ${item.phase}</div>
                <div class="task-title">${item.title} (${item.duration})</div>
              </div>
            `).join('') : '<p>No implementation plan available.</p>'}
          </div>

          <div class="section">
            <div class="section-title">About This Report</div>
            <p>This audit was generated using Brightside AI's proprietary lead generation analysis system. The recommendations are based on industry best practices and your specific business context.</p>
            <p><strong>Company:</strong> ${submission.companyName}</p>
            <p><strong>Industry:</strong> ${submission.industry}</p>
            <p><strong>Company Size:</strong> ${submission.companySize}</p>
            <p><strong>Website:</strong> ${submission.website}</p>
          </div>
        </body>
        </html>
      `;

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('print');
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        }
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Lead_Gen_Audit_${submission.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(pdf);

    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF report' });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // APPLICATION FORM SUBMISSION (existing)
  app.post("/api/submit-application", async (req, res) => {
    try {
      const validatedData = applicationSchema.parse(req.body);
      
      // Log the application (always works)
      console.log('New application received:', {
        company: validatedData.companyName,
        name: validatedData.name,
        email: validatedData.email,
        website: validatedData.website,
        currentRevenue: validatedData.currentRevenue,
        desiredRevenue: validatedData.desiredRevenue,
        agreesToPay: validatedData.agreesToPay,
        timestamp: new Date().toISOString()
      });

      // Try to send SMS if Twilio is configured
      const twilioConfigured = process.env.TWILIO_ACCOUNT_SID && 
                              process.env.TWILIO_AUTH_TOKEN && 
                              process.env.TWILIO_PHONE_NUMBER && 
                              process.env.RECIPIENT_PHONE_NUMBER;

      if (twilioConfigured) {
        try {
          const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

          const smsContent = `🚀 NEW APPLICATION:
${validatedData.companyName}
${validatedData.name} (${validatedData.email})
Current: ${validatedData.currentRevenue}
Target: ${validatedData.desiredRevenue}
Website: ${validatedData.website}
Agreed to $2K after 10 appointments: ${validatedData.agreesToPay ? 'YES' : 'NO'}`;

          await client.messages.create({
            body: smsContent,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to: process.env.RECIPIENT_PHONE_NUMBER!
          });
          
          console.log('SMS notification sent successfully');
        } catch (smsError) {
          console.error('SMS sending failed (continuing anyway):', smsError);
          // Don't fail the entire request if SMS fails
        }
      } else {
        console.log('Twilio not configured - skipping SMS notification');
      }

      res.json({ 
        success: true, 
        message: 'Application submitted successfully! We\'ll contact you within 24 hours.',
        smsNotification: twilioConfigured ? 'sent' : 'skipped'
      });
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({ 
          success: false, 
          message: 'Please fill in all required fields correctly.' 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: 'Submission failed. Please try again or contact support.' 
        });
      }
    }
  });

  // AI VIDEO GENERATION ROUTES - DISABLED FOR NOW
  /*
  app.post("/api/audit-video/generate-script/:submissionId", async (req, res) => {
    try {
      const { submissionId } = req.params;
      console.log('Generating video script for submissionId:', submissionId);
      
      const submission = await storage.getAuditSubmission(submissionId);
      const report = await storage.getAuditReport(submissionId);
      
      if (!submission || !report) {
        return res.status(404).json({ error: 'Audit report not found' });
      }

      const script = await generateAuditVideoScript(
        submission.companyName,
        submission.contactName,
        {
          overallScore: report.overallScore,
          currentEfficiencyScore: report.currentEfficiencyScore || 0,
          estimatedROI: report.estimatedROI || 0,
          projectedAppointmentIncrease: report.projectedAppointmentIncrease || 0,
          projectedRevenueIncrease: report.projectedRevenueIncrease || 0,
          recommendations: report.recommendations || [],
          benchmarkData: report.benchmarkData || []
        }
      );

      res.json({ 
        success: true, 
        script,
        submissionId 
      });
    } catch (error) {
      console.error('Error generating video script:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate video script' 
      });
    }
  });

  app.post("/api/audit-video/generate/:submissionId", async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { avatarId, voiceId, background } = req.body;
      
      console.log('Generating AI avatar video for submissionId:', submissionId);
      
      const submission = await storage.getAuditSubmission(submissionId);
      const report = await storage.getAuditReport(submissionId);
      
      if (!submission || !report) {
        return res.status(404).json({ error: 'Audit report not found' });
      }

      // Generate the script first
      const script = await generateAuditVideoScript(
        submission.companyName,
        submission.contactName,
        {
          overallScore: report.overallScore,
          currentEfficiencyScore: report.currentEfficiencyScore || 0,
          estimatedROI: report.estimatedROI || 0,
          projectedAppointmentIncrease: report.projectedAppointmentIncrease || 0,
          projectedRevenueIncrease: report.projectedRevenueIncrease || 0,
          recommendations: report.recommendations || [],
          benchmarkData: report.benchmarkData || []
        }
      );

      // Convert to speech text
      const speechText = await generateVideoSpeechText(script);

      // Generate avatar video (placeholder for now)
      const videoResult = await generateAvatarVideo({
        script: speechText,
        avatarId,
        voiceId,
        background
      });

      res.json({ 
        success: true, 
        script,
        speechText,
        videoResult,
        submissionId 
      });
    } catch (error) {
      console.error('Error generating avatar video:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate avatar video' 
      });
    }
  });
  */

  const httpServer = createServer(app);

  return httpServer;
}
