import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  TrendingUp, 
  Target, 
  Calendar, 
  Users, 
  DollarSign,
  Download,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useLocation } from "wouter";
import type { AuditSubmission, AuditReport } from "@shared/schema";
// import { AuditVideoGenerator } from "@/components/AuditVideoGenerator";

export default function AuditReport() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading, error } = useQuery<{
    submission: AuditSubmission;
    report: AuditReport;
    success: boolean;
  }>({
    queryKey: [`/api/audit-report/${submissionId}`],
    enabled: !!submissionId,
  });


  const downloadPDF = async () => {
    if (!submissionId) return;
    
    try {
      const response = await fetch(`/api/audit-report/${submissionId}/pdf`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Lead_Gen_Audit_Report_${submissionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Could add toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing Your Data</h3>
            <p className="text-slate-600 text-center">
              We're generating your personalized lead generation audit report...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Report Not Found</h3>
            <p className="text-slate-600 text-center mb-4">
              We couldn't find your audit report. This might be because:
            </p>
            <ul className="text-sm text-slate-600 mb-6 space-y-1">
              <li>• The report is still being generated</li>
              <li>• The link has expired</li>
              <li>• There was an error in processing</li>
            </ul>
            <Button onClick={() => navigate("/audit")} data-testid="button-retry-audit">
              Start New Audit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { submission, report } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <Badge className="mb-4 bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Report Ready
          </Badge>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Lead Generation Audit</h1>
              <p className="text-slate-600">
                Personalized analysis for {submission.companyName}
              </p>
            </div>
            <Button
              onClick={downloadPDF}
              variant="outline"
              size="lg"
              className="ml-4"
              data-testid="button-download-pdf"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Overall Lead Gen Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <div className="text-4xl font-bold text-blue-600" data-testid="text-overall-score">
                {report.overallScore}/100
              </div>
              <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - report.overallScore / 100)}`}
                  className="text-blue-600"
                />
              </svg>
            </div>
            <p className="text-slate-700 max-w-md mx-auto">
              {report.overallScore >= 80 ? "Excellent! Your lead generation is performing very well." :
               report.overallScore >= 60 ? "Good foundation with room for significant improvement." :
               report.overallScore >= 40 ? "Your lead gen needs attention but has potential." :
               "Critical issues identified - major improvements needed."}
            </p>
          </CardContent>
        </Card>

        {/* AI Video Generation - Disabled for now */}
        {/* {submissionId && (
          <AuditVideoGenerator 
            submissionId={submissionId}
            companyName={submission.companyName}
            contactName={submission.contactName}
          />
        )} */}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle className="text-sm font-medium ml-2">Projected ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-projected-roi">
                {report.estimatedROI}%
              </div>
              <p className="text-xs text-muted-foreground">
                Expected return on investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm font-medium ml-2">Appointment Increase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-appointment-increase">
                +{report.projectedAppointmentIncrease}%
              </div>
              <p className="text-xs text-muted-foreground">
                More qualified appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-sm font-medium ml-2">Revenue Increase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600" data-testid="text-revenue-increase">
                ${report.projectedRevenueIncrease?.toLocaleString() || 'TBD'}
              </div>
              <p className="text-xs text-muted-foreground">
                Annual revenue potential
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-600" />
                Top Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="border-l-4 border-orange-400 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900" data-testid={`text-recommendation-title-${index}`}>
                      {rec.title}
                    </h4>
                    <Badge 
                      className={`${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2" data-testid={`text-recommendation-description-${index}`}>
                    {rec.description}
                  </p>
                  <div className="flex items-center text-xs text-slate-500 space-x-4">
                    <span>⏱️ {rec.timeToImplement}</span>
                    <span>📈 {rec.estimatedImpact}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Implementation Plan */}
        {report.implementationPlan && report.implementationPlan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                90-Day Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.implementationPlan.map((phase, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mr-3">
                      {phase.phase}
                    </div>
                    <h4 className="font-semibold text-slate-900" data-testid={`text-phase-title-${index}`}>
                      {phase.title}
                    </h4>
                    <span className="ml-auto text-sm text-slate-500">
                      {phase.duration}
                    </span>
                  </div>
                  <div className="ml-11">
                    <p className="text-sm text-slate-600 mb-2" data-testid={`text-phase-results-${index}`}>
                      <strong>Expected Results:</strong> {phase.expectedResults}
                    </p>
                    {phase.tasks && phase.tasks.length > 0 && (
                      <ul className="text-sm text-slate-600 space-y-1">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span data-testid={`text-phase-task-${index}-${taskIndex}`}>{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle>Your Audit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Company:</span> {submission.companyName}
              </div>
              <div>
                <span className="font-medium">Industry:</span> {submission.industry}
              </div>
              <div>
                <span className="font-medium">Company Size:</span> {submission.companySize}
              </div>
              <div>
                <span className="font-medium">Current Revenue:</span> {submission.currentRevenue}
              </div>
              <div>
                <span className="font-medium">Target Revenue:</span> {submission.targetRevenue}
              </div>
              <div>
                <span className="font-medium">Monthly Lead Gen Spend:</span> {submission.monthlyLeadGenSpend}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="button-schedule-consultation">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Strategy Call
          </Button>
          <Button size="lg" variant="outline" data-testid="button-download-report">
            <Download className="w-5 h-5 mr-2" />
            Download PDF Report
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/templates")}
            data-testid="button-browse-templates"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Browse Email Templates
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Personalized Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Industry Benchmarks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Actionable Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}