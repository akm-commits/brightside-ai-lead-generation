import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users, Award, Quote } from "lucide-react";

export default function SocialProof() {
  const testimonials = [
    {
      name: "Sarah Chen",
      company: "TechFlow Marketing",
      revenue: "$2M ARR",
      quote: "Finally, an agency that delivers before asking for payment. 14 qualified appointments in 3 weeks.",
      result: "14 appointments in 3 weeks"
    },
    {
      name: "Marcus Rivera", 
      company: "SaaS Growth Partners",
      revenue: "$5M ARR",
      quote: "Skip the sales pitch was exactly what we needed. No time wasted, just results.",
      result: "18 appointments in 30 days"
    },
    {
      name: "Jennifer Walsh",
      company: "Digital Velocity",
      revenue: "$10M ARR", 
      quote: "The ROI is insane. $2,000 total cost vs competitors charging $8K+ upfront.",
      result: "$400K pipeline generated"
    }
  ];

  const clientLogos = [
    "TechFlow", "SaaS Growth", "Digital Velocity", "ScaleUp", "GrowthLab", "MarketPro"
  ];

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-slate-900">
              Trusted by 50+ Marketing Agencies
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            Real results from real clients
          </p>
        </div>

        {/* Client Logos */}
        <Card className="p-4 bg-white shadow-sm">
          <div className="grid grid-cols-3 gap-3 text-center">
            {clientLogos.map((logo, index) => (
              <div 
                key={index}
                className="p-2 bg-slate-50 rounded text-xs font-medium text-slate-600 border"
              >
                {logo}
              </div>
            ))}
          </div>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <Card className="p-3 bg-blue-50 border-blue-200">
            <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700">$2.3M+</div>
            <div className="text-xs text-blue-600">Pipeline Generated</div>
          </Card>
          <Card className="p-3 bg-green-50 border-green-200">
            <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">847+</div>
            <div className="text-xs text-green-600">Appointments</div>
          </Card>
          <Card className="p-3 bg-purple-50 border-purple-200">
            <Star className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-700">4.9/5</div>
            <div className="text-xs text-purple-600">Client Rating</div>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="space-y-3">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-4 bg-white shadow-md border-l-4 border-l-green-500"
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-700 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {testimonial.company} • {testimonial.revenue}
                    </div>
                  </div>
                  
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {testimonial.result}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Social CTA */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
          <div className="text-center space-y-3">
            <div className="text-sm font-bold text-slate-900">
              Join 50+ agencies already using our system
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              data-testid="button-social-proof-cta"
            >
              Get Your 10 Appointments
            </Button>
            <div className="text-xs text-slate-500">
              🔥 Next spot available in 24 hours
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}