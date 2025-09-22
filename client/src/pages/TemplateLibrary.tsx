import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Copy, 
  TrendingUp, 
  Mail, 
  Users, 
  Target,
  CheckCircle,
  Filter,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface EmailTemplate {
  id: string;
  title: string;
  category: string;
  subCategory: string | null;
  subjectLine: string;
  subjectVariations: string[] | null;
  emailBody: string;
  personalizationTips: string | null;
  industryFocus: string | null;
  openRate: string | null;
  replyRate: string | null;
  pipelineGenerated: number | null;
  useCase: string | null;
  bestPractices: string | null;
  successStory: string | null;
}

export default function TemplateLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/templates'],
    queryFn: async () => {
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const result = await response.json();
      return result.templates as EmailTemplate[];
    }
  });

  const templates = data || [];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.emailBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.useCase?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         false;
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesIndustry = selectedIndustry === "all" || template.industryFocus === selectedIndustry;
    
    return matchesSearch && matchesCategory && matchesIndustry;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "first-outreach", label: "First Outreach" },
    { value: "follow-up", label: "Follow-up" },
    { value: "specialized", label: "Specialized" }
  ];

  const industries = [
    { value: "all", label: "All Industries" },
    { value: "general", label: "General B2B" },
    { value: "saas", label: "SaaS" },
    { value: "agency", label: "Agency" }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'first-outreach': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'follow-up': return 'bg-green-100 text-green-800 border-green-200';
      case 'specialized': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600">Loading proven email templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">Failed to load templates</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <Badge className="bg-white text-blue-600 px-4 py-2 text-sm font-bold">
            FREE RESOURCE
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-testid="text-header-title">
            {templates.length} Proven Cold Email Templates
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto" data-testid="text-header-subtitle">
            These templates generated $2M+ in pipeline for our clients. Copy, customize, and start booking more appointments today.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">$2.3M+</div>
              <div className="text-blue-100 text-sm">Pipeline Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">45.2%</div>
              <div className="text-blue-100 text-sm">Highest Open Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">41.2%</div>
              <div className="text-blue-100 text-sm">Highest Reply Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{templates.length}</div>
              <div className="text-blue-100 text-sm">Proven Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search templates, use cases, or industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48" data-testid="select-category">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-48" data-testid="select-industry">
                  <Target className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <span>Showing {filteredTemplates.length} of {templates.length} templates</span>
            {(searchTerm || selectedCategory !== "all" || selectedIndustry !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedIndustry("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="p-6 hover-elevate" data-testid={`card-template-${template.id}`}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-slate-900" data-testid={`text-title-${template.id}`}>
                        {template.title}
                      </h3>
                      <Badge className={`${getCategoryColor(template.category)} text-xs`}>
                        {template.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    {template.subCategory && (
                      <p className="text-sm text-slate-600 capitalize">
                        {template.subCategory.replace('-', ' ')}
                      </p>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    {template.openRate && (
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-700">{template.openRate}%</div>
                        <div className="text-xs text-blue-600">Open Rate</div>
                      </div>
                    )}
                    {template.replyRate && (
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-700">{template.replyRate}%</div>
                        <div className="text-xs text-green-600">Reply Rate</div>
                      </div>
                    )}
                    {template.pipelineGenerated && (
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-700">
                          {formatCurrency(template.pipelineGenerated)}
                        </div>
                        <div className="text-xs text-purple-600">Pipeline</div>
                      </div>
                    )}
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Subject Line
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(template.subjectLine, 'Subject line')}
                        data-testid={`button-copy-subject-${template.id}`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-slate-50 p-3 rounded border-l-4 border-blue-500">
                      {template.subjectLine}
                    </p>
                  </div>

                  {/* Email Body Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800">Email Template</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(template.emailBody, 'Email template')}
                        data-testid={`button-copy-email-${template.id}`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded max-h-48 overflow-y-auto text-sm">
                      <pre className="whitespace-pre-wrap font-sans text-slate-700">
                        {template.emailBody}
                      </pre>
                    </div>
                  </div>

                  {/* Use Case */}
                  {template.useCase && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        When to Use
                      </h4>
                      <p className="text-sm text-slate-600">{template.useCase}</p>
                    </div>
                  )}

                  {/* Success Story */}
                  {template.successStory && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Success Story
                      </h4>
                      <p className="text-sm text-slate-600 bg-green-50 p-3 rounded border-l-4 border-green-500">
                        {template.successStory}
                      </p>
                    </div>
                  )}

                  {/* Subject Variations */}
                  {template.subjectVariations && template.subjectVariations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-800">Subject Line Variations</h4>
                      <div className="space-y-1">
                        {template.subjectVariations.map((variation, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded text-sm">
                            <span className="flex-1">{variation}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(variation, 'Subject variation')}
                              className="ml-2"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Personalization Tips */}
                  {template.personalizationTips && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Personalization Tips
                      </h4>
                      <p className="text-sm text-slate-600 bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                        {template.personalizationTips}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No templates found</h3>
                <p className="text-slate-600">Try adjusting your search terms or filters.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedIndustry("all");
                  }}
                  data-testid="button-clear-all-filters"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to Get These Templates Working for Your Business?
          </h2>
          <p className="text-xl text-slate-200">
            Get a free lead generation audit and see exactly how these templates can 3x your appointment bookings.
          </p>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-lg"
            onClick={() => window.scrollTo(0, 0)}
            data-testid="button-cta"
          >
            Get Free Lead Gen Audit
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}