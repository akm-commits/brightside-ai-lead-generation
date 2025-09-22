import { Card } from "@/components/ui/card";

interface CaseStudyProps {
  problem: string;
  solution: string;
  result: string;
  roi: string;
  company: string;
  testId: string;
}

function CaseStudyCard({ problem, solution, result, roi, company, testId }: CaseStudyProps) {
  return (
    <Card className="p-8 bg-white border-0 shadow-sm hover-elevate">
      <div className="space-y-5">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide" data-testid={`text-company-${testId}`}>
          {company}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900" data-testid={`text-problem-${testId}`}>
          {problem}
        </h3>
        
        <div className="space-y-3">
          <p className="text-slate-600" data-testid={`text-solution-${testId}`}>
            <strong>Solution:</strong> {solution}
          </p>
          <p className="text-slate-600" data-testid={`text-result-${testId}`}>
            <strong>Result:</strong> {result}
          </p>
        </div>
        
        <div className="pt-3 border-t border-slate-100">
          <div className="text-2xl font-bold text-green-600" data-testid={`text-roi-${testId}`}>
            {roi}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CaseStudiesSection() {
  // TODO: remove mock functionality - replace with real case studies
  const caseStudies = [
    {
      problem: "SaaS struggling to book demos",
      solution: "Targeted 500 enterprise CTOs with personalized video messages.",
      result: "32 qualified demos booked in 6 weeks.",
      roi: "450% ROI",
      company: "Enterprise SaaS",
      testId: "saas-demos"
    },
    {
      problem: "Agency couldn't scale beyond referrals",
      solution: "Multi-sequence outreach to marketing directors at growing companies.",
      result: "18 high-value clients, $240K new revenue.",
      roi: "800% ROI",
      company: "Marketing Agency",
      testId: "agency-scale"
    },
    {
      problem: "High customer acquisition cost",
      solution: "Automated nurture sequences for warm prospects in their database.",
      result: "Cut CAC by 60%, increased conversion by 40%.",
      roi: "320% ROI",
      company: "B2B Software",
      testId: "lower-cac"
    }
  ];

  return (
    <section className="bg-white py-21">
      <div className="container mx-auto px-8">
        <div className="text-center mb-13">
          <h2 className="text-4xl font-bold text-slate-900 mb-5" data-testid="text-cases-title">
            Problem → Solution → ROI
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-testid="text-cases-subtitle">
            Real problems we've solved for agencies and SaaS companies
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.testId} {...study} />
          ))}
        </div>
      </div>
    </section>
  );
}