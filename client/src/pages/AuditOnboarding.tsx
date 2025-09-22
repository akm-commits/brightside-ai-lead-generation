import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle2, Building2, Users, Target, TrendingUp, Zap, MessageSquare, Settings, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { insertAuditSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import type { InsertAuditSubmission } from "@shared/schema";
import Header from "@/components/Header";

const STEPS = [
  { id: 1, title: "Business Overview", icon: Building2 },
  { id: 2, title: "Current Process", icon: Users },
  { id: 3, title: "Goals & Challenges", icon: Target },
  { id: 4, title: "Target Audience & Market", icon: Users },
  { id: 5, title: "Performance Metrics", icon: TrendingUp },
  { id: 6, title: "Content & Sales Process", icon: MessageSquare },
  { id: 7, title: "Technical Setup", icon: Settings },
  { id: 8, title: "Website Audit (Optional)", icon: Globe },
  { id: 9, title: "Final Details", icon: Zap },
];

export default function AuditOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Create form-specific schema with comprehensive field typing
  const formSchema = insertAuditSubmissionSchema.extend({
    // Number field preprocessing
    currentAppointmentsPerMonth: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().positive().nullable().optional()
    ),
    averageDealSize: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().positive().nullable().optional()
    ),
    currentEmailVolume: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().positive().nullable().optional()
    ),
    websiteTrafficPerMonth: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().positive().nullable().optional()
    ),
    currentCAC: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().positive().nullable().optional()
    ),
    salesTeamSize: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().positive().nullable().optional()
    ),
    mobileOptimizationScore: z.preprocess(
      v => v === '' || v == null ? null : Number(v), 
      z.number().int().min(1).max(10).nullable().optional()
    ),
    
    // Decimal field preprocessing (convert to string for backend)
    closingRate: z.preprocess(
      v => v === '' || v == null ? null : String(Number(v) || 0), 
      z.string().nullable().optional()
    ),
    leadToCustomerRate: z.preprocess(
      v => v === '' || v == null ? null : String(v), 
      z.string().nullable().optional()
    ),
    currentWebsiteConversionRate: z.preprocess(
      v => v === '' || v == null ? null : String(v), 
      z.string().nullable().optional()
    ),
    
    // String preprocessing
    website: z.preprocess(
      v => typeof v === 'string' && v.trim() === '' ? undefined : v, 
      z.string().optional()
    ),
    
    // JSON array fields - explicitly type as string arrays
    currentLeadGenMethods: z.array(z.string()).default([]),
    biggestChallenges: z.array(z.string()).default([]),
    currentTools: z.array(z.string()).default([]),
    targetCompanySizes: z.array(z.string()).default([]),
    targetDecisionMakers: z.array(z.string()).default([]),
    targetIndustries: z.array(z.string()).default([]),
    geographicFocus: z.array(z.string()).default([]),
    currentValueProps: z.array(z.string()).default([]),
    contentThemes: z.array(z.string()).default([]),
    primaryContentFormats: z.array(z.string()).default([]),
    mainCompetitors: z.array(z.string()).default([]),
    competitiveAdvantages: z.array(z.string()).default([]),
    marketDifferentiators: z.array(z.string()).default([]),
    analyticsSetup: z.array(z.string()).default([]),
    salesEnablementTools: z.array(z.string()).default([]),
    growthBottlenecks: z.array(z.string()).default([]),
    landingPageUrls: z.array(z.string()).default([]),
    conversionGoals: z.array(z.string()).default([]),
    
    // JSON object fields
    costPerLeadByChannel: z.record(z.number()).optional(),
    conversionRateByStage: z.record(z.number()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      website: undefined,
      industry: "B2B Software",
      companySize: "1-10",
      currentRevenue: "$0-10k",
      targetRevenue: "$10k-25k",
      currentLeadGenMethods: [],
      monthlyLeadGenSpend: "$0-1k",
      currentAppointmentsPerMonth: undefined,
      averageDealSize: undefined,
      salesCycleLength: "1-3 months",
      closingRate: undefined,
      biggestChallenges: [],
      currentTools: [],
      hasEmailSequences: false,
      hasCRM: false,
      currentEmailVolume: undefined,
      
      // Target Audience Analysis
      targetCompanySizes: [],
      targetDecisionMakers: [],
      targetIndustries: [],
      geographicFocus: [],
      idealCustomerProfile: undefined,
      
      // Conversion Metrics
      websiteTrafficPerMonth: undefined,
      leadToCustomerRate: undefined,
      currentCAC: undefined,
      costPerLeadByChannel: undefined,
      conversionRateByStage: undefined,
      
      // Content & Messaging Strategy
      currentValueProps: [],
      contentProductionVolume: undefined,
      contentThemes: [],
      messagingTestingFrequency: undefined,
      primaryContentFormats: [],
      
      // Competitive Intelligence
      mainCompetitors: [],
      competitiveAdvantages: [],
      marketDifferentiators: [],
      competitorAnalysisFrequency: undefined,
      
      // Technical & Process Maturity
      marketingAutomationPlatform: undefined,
      analyticsSetup: [],
      abTestingFrequency: undefined,
      leadScoringSystem: false,
      attributionModelUsed: undefined,
      
      // Sales Process Details
      salesTeamSize: undefined,
      salesQualificationProcess: undefined,
      followUpCadence: undefined,
      winLossTracking: false,
      salesEnablementTools: [],
      
      // Historical Performance & Insights
      previousSuccessfulCampaigns: undefined,
      biggestFailuresLessons: undefined,
      seasonalTrends: undefined,
      growthBottlenecks: [],
      
      // Website/Landing Page Audit (Optional)
      enableWebsiteAudit: false,
      landingPageUrls: [],
      conversionGoals: [],
      currentWebsiteConversionRate: undefined,
      mobileOptimizationScore: undefined,
      pagespeedConcerns: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertAuditSubmission) => {
      console.log("Submitting audit data:", data);
      const response = await apiRequest('POST', '/api/audit-submission', data);
      console.log("Server response:", response);
      return await response.json();
    },
    onSuccess: (response) => {
      console.log("Mutation success - server response:", response);
      console.log("Extracting submissionId from response...");
      
      toast({
        title: "Audit Submitted Successfully!",
        description: "We're analyzing your data and will have your report ready shortly.",
      });
      
      // Robust submissionId extraction to handle different response formats
      const submissionId = (response as any)?.submissionId || 
                          (response as any)?.id || 
                          (response as any)?.data?.submissionId || 
                          (response as any)?.data?.id || 
                          (response as any)?.submission?.id;
      console.log("Extracted submissionId:", submissionId);
      
      if (submissionId) {
        console.log(`Navigating to: /audit-report/${submissionId}`);
        navigate(`/audit-report/${submissionId}`);
      } else {
        console.error("No submissionId found in response:", response);
        toast({
          title: "Error", 
          description: "Could not generate report. Please try again."
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
      console.error("Audit submission error:", error);
    },
  });

  // Add manual schema validation test
  const testSchemaValidation = () => {
    const testData = {
      companyName: "TestCorp Inc",
      contactName: "John Test", 
      email: "john@testcorp.com",
      website: "testcorp.com",
      industry: "Technology",
      companySize: "51-200",
      currentRevenue: "$500K-$1M",
      targetRevenue: "$2M-$5M",
      currentLeadGenMethods: ["Cold Email"],
      monthlyLeadGenSpend: "$5,000-$10,000",
      currentAppointmentsPerMonth: 15,
      averageDealSize: 5000,
      salesCycleLength: "1-3 months",
      closingRate: "25.0",
      biggestChallenges: ["Low response rates"],
      currentTools: ["CRM"],
      hasEmailSequences: false,
      hasCRM: true,
      currentEmailVolume: 1000,
      primaryGoal: "Increase qualified leads",
      biggestChallenge: "Need more qualified leads"
    };
    
    console.log("=== TESTING SCHEMA VALIDATION ===");
    try {
      const result = insertAuditSubmissionSchema.parse(testData);
      console.log("✅ Schema validation passed:", result);
    } catch (error) {
      console.error("❌ Schema validation failed:", error);
    }
    console.log("=================================");
  };

  const onSubmit = (data: InsertAuditSubmission) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form data received in onSubmit:", data);
    console.log("Form validation errors:", form.formState.errors);
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form is submitted:", form.formState.isSubmitted);
    console.log("All form values:", form.getValues());
    console.log("=== CALLING MUTATION ===");
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Building2 className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Tell us about your business</h2>
              <p className="text-slate-600">We need to understand your business to provide accurate recommendations</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your company name" data-testid="input-company-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" data-testid="input-contact-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} data-testid="select-industry">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="B2B Software">B2B Software</SelectItem>
                        <SelectItem value="B2B Services">B2B Services</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} data-testid="select-team-size">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Just me">Just me</SelectItem>
                          <SelectItem value="1-5">1-5 people</SelectItem>
                          <SelectItem value="6-10">6-10 people</SelectItem>
                          <SelectItem value="11-25">11-25 people</SelectItem>
                          <SelectItem value="26-50">26-50 people</SelectItem>
                          <SelectItem value="50+">50+ people</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Revenue *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} data-testid="select-monthly-revenue">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="$0-10k">$0-10k</SelectItem>
                          <SelectItem value="$10k-25k">$10k-25k</SelectItem>
                          <SelectItem value="$25k-50k">$25k-50k</SelectItem>
                          <SelectItem value="$50k-100k">$50k-100k</SelectItem>
                          <SelectItem value="$100k-250k">$100k-250k</SelectItem>
                          <SelectItem value="$250k+">$250k+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Current Lead Generation Process</h2>
              <p className="text-slate-600">Help us understand how you currently generate leads</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currentLeadGenMethods"
                render={() => {
                  const selectedLeadMethods = form.watch('currentLeadGenMethods') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Current Lead Generation Methods *</FormLabel>
                    <FormDescription>Select all that apply</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Cold Email",
                        "LinkedIn Outreach",
                        "Content Marketing",
                        "Paid Ads",
                        "SEO/Organic",
                        "Referrals",
                        "Networking Events",
                        "Direct Mail",
                        "Phone Calls",
                        "Social Media",
                        "Webinars",
                        "Other",
                      ].map((source) => {
                        const isSelected = selectedLeadMethods.includes(source);
                        return (
                          <Button
                            key={source}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-lead-source-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('currentLeadGenMethods') ?? [];
                              const newValue = current.includes(source) 
                                ? current.filter((s) => s !== source)
                                : [...current, source];
                              form.setValue('currentLeadGenMethods', newValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {source}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="monthlyLeadGenSpend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Lead Generation Spend *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} data-testid="select-leadgen-spend">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="$0-1k">$0-1k</SelectItem>
                        <SelectItem value="$1k-5k">$1k-5k</SelectItem>
                        <SelectItem value="$5k-10k">$5k-10k</SelectItem>
                        <SelectItem value="$10k-25k">$10k-25k</SelectItem>
                        <SelectItem value="$25k-50k">$25k-50k</SelectItem>
                        <SelectItem value="$50k+">$50k+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Goals & Challenges</h2>
              <p className="text-slate-600">What are your biggest lead generation challenges?</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="biggestChallenges"
                render={() => {
                  const selectedChallenges = form.watch('biggestChallenges') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Biggest Challenges *</FormLabel>
                    <FormDescription>Select all that apply</FormDescription>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Not enough leads",
                        "Poor lead quality",
                        "High cost per lead",
                        "Low conversion rates",
                        "Long sales cycles",
                        "Difficulty reaching decision makers",
                        "Lack of time/resources",
                        "Unclear ROI/tracking",
                        "Competition",
                        "Market saturation",
                      ].map((challenge) => {
                        const isSelected = selectedChallenges.includes(challenge);
                        return (
                          <Button
                            key={challenge}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-challenge-${challenge.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('biggestChallenges') ?? [];
                              const newValue = current.includes(challenge)
                                ? current.filter((c: string) => c !== challenge)
                                : [...current, challenge];
                              form.setValue('biggestChallenges', newValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {challenge}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Target Audience & Market</h2>
              <p className="text-slate-600">Help us understand who you're trying to reach</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="targetCompanySizes"
                render={() => {
                  const selectedSizes = form.watch('targetCompanySizes') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Target Company Sizes</FormLabel>
                    <FormDescription>Select all that apply</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Startups (1-10)",
                        "Small (11-50)",
                        "Medium (51-200)",
                        "Large (201-1000)",
                        "Enterprise (1000+)",
                      ].map((size) => {
                        const isSelected = selectedSizes.includes(size);
                        return (
                          <Button
                            key={size}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-company-size-${size.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('targetCompanySizes') ?? [];
                              const newValue = current.includes(size) 
                                ? current.filter((s) => s !== size)
                                : [...current, size];
                              form.setValue('targetCompanySizes', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {size}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="targetDecisionMakers"
                render={() => {
                  const selectedRoles = form.watch('targetDecisionMakers') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Target Decision Makers</FormLabel>
                    <FormDescription>Who are you trying to reach?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "CEO/Founder",
                        "VP Sales",
                        "VP Marketing",
                        "Sales Director",
                        "Marketing Director",
                        "CTO/VP Engineering",
                        "Operations Manager",
                        "Business Owner",
                      ].map((role) => {
                        const isSelected = selectedRoles.includes(role);
                        return (
                          <Button
                            key={role}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-decision-maker-${role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('targetDecisionMakers') ?? [];
                              const newValue = current.includes(role) 
                                ? current.filter((r) => r !== role)
                                : [...current, role];
                              form.setValue('targetDecisionMakers', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {role}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="targetIndustries"
                render={() => {
                  const selectedIndustries = form.watch('targetIndustries') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Target Industries</FormLabel>
                    <FormDescription>Which industries do you focus on?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "SaaS/Software",
                        "E-commerce",
                        "Healthcare",
                        "Financial Services",
                        "Real Estate",
                        "Education",
                        "Manufacturing",
                        "Professional Services",
                        "Agency/Marketing",
                        "Other",
                      ].map((industry) => {
                        const isSelected = selectedIndustries.includes(industry);
                        return (
                          <Button
                            key={industry}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-industry-${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('targetIndustries') ?? [];
                              const newValue = current.includes(industry) 
                                ? current.filter((i) => i !== industry)
                                : [...current, industry];
                              form.setValue('targetIndustries', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {industry}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="geographicFocus"
                render={() => {
                  const selectedRegions = form.watch('geographicFocus') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Geographic Focus</FormLabel>
                    <FormDescription>Where are your target customers located?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "North America",
                        "Europe",
                        "Asia Pacific",
                        "Latin America",
                        "Middle East",
                        "Africa",
                        "Global",
                        "Local/Regional",
                      ].map((region) => {
                        const isSelected = selectedRegions.includes(region);
                        return (
                          <Button
                            key={region}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-region-${region.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('geographicFocus') ?? [];
                              const newValue = current.includes(region) 
                                ? current.filter((r) => r !== region)
                                : [...current, region];
                              form.setValue('geographicFocus', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {region}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <TrendingUp className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Performance Metrics</h2>
              <p className="text-slate-600">Help us understand your current performance and conversion data</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentAppointmentsPerMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Appointments Per Month</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number"
                          data-testid="input-appointments-per-month"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="averageDealSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Deal Size ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 5000"
                          data-testid="input-average-deal-size"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="closingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 15"
                          data-testid="input-closing-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salesCycleLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Cycle Length</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined} data-testid="select-sales-cycle-length">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales cycle length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Less than 1 month">Less than 1 month</SelectItem>
                          <SelectItem value="1-3 months">1-3 months</SelectItem>
                          <SelectItem value="3-6 months">3-6 months</SelectItem>
                          <SelectItem value="6-12 months">6-12 months</SelectItem>
                          <SelectItem value="12+ months">12+ months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="websiteTrafficPerMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Website Traffic</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 5000"
                          data-testid="input-website-traffic"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCAC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Acquisition Cost ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 250"
                          data-testid="input-current-cac"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leadToCustomerRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead to Customer Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 3.5"
                          data-testid="input-lead-customer-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentWebsiteConversionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website Conversion Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 2.1"
                          data-testid="input-website-conversion-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="salesTeamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Team Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of sales people"
                        data-testid="input-sales-team-size"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MessageSquare className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Content & Sales Process</h2>
              <p className="text-slate-600">Tell us about your current messaging and content strategy</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currentValueProps"
                render={() => {
                  const selectedProps = form.watch('currentValueProps') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Current Value Propositions</FormLabel>
                    <FormDescription>What are your main selling points?</FormDescription>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Cost Savings",
                        "Time Efficiency",
                        "ROI/Revenue Growth",
                        "Quality/Reliability",
                        "Innovation/Technology",
                        "Customer Service",
                        "Expertise/Authority",
                        "Convenience/Ease of Use",
                      ].map((prop) => {
                        const isSelected = selectedProps.includes(prop);
                        return (
                          <Button
                            key={prop}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-value-prop-${prop.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('currentValueProps') ?? [];
                              const newValue = current.includes(prop) 
                                ? current.filter((p) => p !== prop)
                                : [...current, prop];
                              form.setValue('currentValueProps', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {prop}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="contentThemes"
                render={() => {
                  const selectedThemes = form.watch('contentThemes') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Content Themes</FormLabel>
                    <FormDescription>What topics do you create content about?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Industry Insights",
                        "How-to Guides",
                        "Case Studies",
                        "Product Updates",
                        "Company News",
                        "Thought Leadership",
                        "Customer Success",
                        "Trends & Analysis",
                      ].map((theme) => {
                        const isSelected = selectedThemes.includes(theme);
                        return (
                          <Button
                            key={theme}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-content-theme-${theme.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('contentThemes') ?? [];
                              const newValue = current.includes(theme) 
                                ? current.filter((t) => t !== theme)
                                : [...current, theme];
                              form.setValue('contentThemes', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {theme}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="primaryContentFormats"
                render={() => {
                  const selectedFormats = form.watch('primaryContentFormats') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Primary Content Formats</FormLabel>
                    <FormDescription>What types of content do you create?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Blog Posts",
                        "Video Content",
                        "Infographics",
                        "Webinars",
                        "Podcasts",
                        "Whitepapers",
                        "Email Newsletters",
                        "Social Media Posts",
                      ].map((format) => {
                        const isSelected = selectedFormats.includes(format);
                        return (
                          <Button
                            key={format}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-content-format-${format.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('primaryContentFormats') ?? [];
                              const newValue = current.includes(format) 
                                ? current.filter((f) => f !== format)
                                : [...current, format];
                              form.setValue('primaryContentFormats', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {format}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="mainCompetitors"
                render={() => {
                  const selectedCompetitors = form.watch('mainCompetitors') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Main Competitors</FormLabel>
                    <FormDescription>Who are your primary competitors? (Select or type)</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "HubSpot",
                        "Salesforce",
                        "Pipedrive",
                        "Outreach",
                        "Apollo",
                        "ZoomInfo",
                        "Clay",
                        "Other",
                      ].map((competitor) => {
                        const isSelected = selectedCompetitors.includes(competitor);
                        return (
                          <Button
                            key={competitor}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-competitor-${competitor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('mainCompetitors') ?? [];
                              const newValue = current.includes(competitor) 
                                ? current.filter((c) => c !== competitor)
                                : [...current, competitor];
                              form.setValue('mainCompetitors', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {competitor}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Settings className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Technical Setup</h2>
              <p className="text-slate-600">Help us understand your current tech stack and setup</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="analyticsSetup"
                render={() => {
                  const selectedAnalytics = form.watch('analyticsSetup') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Analytics & Tracking Setup</FormLabel>
                    <FormDescription>What analytics tools do you use?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Google Analytics",
                        "Google Tag Manager",
                        "Facebook Pixel",
                        "LinkedIn Insight Tag",
                        "Hotjar/FullStory",
                        "Mixpanel",
                        "Custom Analytics",
                        "None",
                      ].map((tool) => {
                        const isSelected = selectedAnalytics.includes(tool);
                        return (
                          <Button
                            key={tool}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-analytics-${tool.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('analyticsSetup') ?? [];
                              const newValue = current.includes(tool) 
                                ? current.filter((t) => t !== tool)
                                : [...current, tool];
                              form.setValue('analyticsSetup', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {tool}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="salesEnablementTools"
                render={() => {
                  const selectedTools = form.watch('salesEnablementTools') ?? [];
                  return (
                  <FormItem>
                    <FormLabel>Sales Enablement Tools</FormLabel>
                    <FormDescription>What tools does your sales team use?</FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "CRM (HubSpot/Salesforce)",
                        "Email Automation",
                        "Lead Scoring",
                        "Call Recording",
                        "Proposal Software",
                        "Calendar Booking",
                        "Sales Analytics",
                        "None",
                      ].map((tool) => {
                        const isSelected = selectedTools.includes(tool);
                        return (
                          <Button
                            key={tool}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            data-testid={`button-sales-tool-${tool.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              const current = form.getValues('salesEnablementTools') ?? [];
                              const newValue = current.includes(tool) 
                                ? current.filter((t) => t !== tool)
                                : [...current, tool];
                              form.setValue('salesEnablementTools', newValue, { shouldDirty: true });
                            }}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {tool}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="mobileOptimizationScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Optimization Score (1-10)</FormLabel>
                    <FormDescription>How would you rate your website's mobile experience?</FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="e.g. 7"
                        data-testid="input-mobile-score"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Globe className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Website Audit (Optional)</h2>
              <p className="text-slate-600">Help us provide deeper insights about your online presence</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <label className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Include Website Audit</label>
                  <p className="text-sm text-muted-foreground">
                    Get detailed analysis of your website's conversion optimization
                  </p>
                </div>
                <Switch
                  checked={form.watch('enableWebsiteAudit') || false}
                  onCheckedChange={(checked) => {
                    form.setValue('enableWebsiteAudit', checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                  }}
                  data-testid="switch-website-audit"
                />
              </div>

              {form.watch('enableWebsiteAudit') && (
                <>
                  <FormField
                    control={form.control}
                    name="landingPageUrls"
                    render={() => {
                      const landingPages = form.watch('landingPageUrls') ?? [];
                      // Ensure at least one input field when website audit is enabled
                      const displayUrls = landingPages.length === 0 ? [''] : landingPages;
                      return (
                      <FormItem>
                        <FormLabel>Key Landing Pages</FormLabel>
                        <FormDescription>Which pages are most important for conversions?</FormDescription>
                        <div className="space-y-2">
                          {displayUrls.map((url, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={url}
                                onChange={(e) => {
                                  const newUrls = landingPages.length === 0 ? [e.target.value] : [...landingPages];
                                  if (landingPages.length > 0) {
                                    newUrls[index] = e.target.value;
                                  }
                                  form.setValue('landingPageUrls', newUrls, { shouldDirty: true });
                                }}
                                placeholder="https://example.com/landing-page"
                                data-testid={`input-landing-page-${index}`}
                              />
                              {displayUrls.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newUrls = landingPages.filter((_, i) => i !== index);
                                    form.setValue('landingPageUrls', newUrls, { shouldDirty: true });
                                  }}
                                  data-testid={`button-remove-landing-page-${index}`}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentUrls = landingPages.length === 0 ? [''] : landingPages;
                              form.setValue('landingPageUrls', [...currentUrls, ''], { shouldDirty: true });
                            }}
                            data-testid="button-add-landing-page"
                          >
                            Add Landing Page
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="conversionGoals"
                    render={() => {
                      const selectedGoals = form.watch('conversionGoals') ?? [];
                      return (
                      <FormItem>
                        <FormLabel>Primary Conversion Goals</FormLabel>
                        <FormDescription>What actions do you want visitors to take?</FormDescription>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Contact Form Submission",
                            "Phone Call",
                            "Demo Request",
                            "Free Trial Signup",
                            "Download Resource",
                            "Newsletter Signup",
                            "Purchase",
                            "Calendar Booking",
                          ].map((goal) => {
                            const isSelected = selectedGoals.includes(goal);
                            return (
                              <Button
                                key={goal}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="justify-start"
                                data-testid={`button-conversion-goal-${goal.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                onClick={() => {
                                  const current = form.getValues('conversionGoals') ?? [];
                                  const newValue = current.includes(goal) 
                                    ? current.filter((g) => g !== goal)
                                    : [...current, goal];
                                  form.setValue('conversionGoals', newValue, { shouldDirty: true });
                                }}
                              >
                                {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                                {goal}
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="pagespeedConcerns"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Page Speed Concerns</FormLabel>
                          <FormDescription>
                            Do you have concerns about your website's loading speed?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                            data-testid="switch-pagespeed-concerns"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Zap className="w-12 h-12 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold">Almost Done!</h2>
              <p className="text-slate-600">Just need your contact details to deliver your audit report</p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div className="flex">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What happens next?</p>
                    <ul className="mt-1 space-y-1">
                      <li>• We'll analyze your comprehensive data using our proprietary algorithms</li>
                      <li>• Generate a detailed audit report with actionable insights</li>
                      <li>• Identify specific opportunities for improvement across all areas</li>
                      <li>• Provide personalized tool recommendations and implementation roadmap</li>
                      <li>• Include competitive analysis and performance benchmarks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-600 text-white">Free Lead Generation Audit</Badge>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Get Your Personalized Analysis</h1>
            <p className="text-slate-600">
              Answer a few questions and we'll analyze your current lead generation process
            </p>
          </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-600 mt-2 text-center max-w-16">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    data-testid="button-previous-step"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === STEPS.length ? (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-audit"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        console.log("=== SUBMIT BUTTON CLICKED ===");
                        console.log("Form errors:", form.formState.errors);
                        console.log("Form values:", form.getValues());
                        console.log("Form is valid:", form.formState.isValid);
                        console.log("Form is submitted:", form.formState.isSubmitted);
                        console.log("Form isDirty:", form.formState.isDirty);
                        console.log("Form isValidating:", form.formState.isValidating);
                        
                        // Let's manually trigger validation to see if it helps
                        console.log("Triggering manual validation...");
                        form.trigger().then((isValid) => {
                          console.log("Manual validation result:", isValid);
                          if (!isValid) {
                            console.log("Validation failed, errors:", form.formState.errors);
                          }
                        });
                        console.log("===============================");
                        // Don't prevent default - let form submit handle it
                      }}
                    >
                      {submitMutation.isPending ? (
                        "Generating Report..."
                      ) : (
                        <>
                          Generate My Audit Report
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      data-testid="button-next-step"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}