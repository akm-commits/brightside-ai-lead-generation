import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Crown, Zap, Shield, Clock } from "lucide-react";

export default function ComparisonTable() {
  const features = [
    {
      feature: "Setup Fee",
      brightside: "$0",
      competitors: "$2,000-$10,000",
      highlight: true
    },
    {
      feature: "Payment Structure",
      brightside: "Pay After Results",
      competitors: "Pay Upfront",
      highlight: true
    },
    {
      feature: "Time to Start",
      brightside: "24 Hours",
      competitors: "2-4 Weeks",
      highlight: false
    },
    {
      feature: "Sales Pitch Required",
      brightside: "Skip It",
      competitors: "Required",
      highlight: true
    },
    {
      feature: "Minimum Commitment",
      brightside: "10 Appointments",
      competitors: "3-6 Months",
      highlight: false
    },
    {
      feature: "Guarantee",
      brightside: "30-Day Delivery",
      competitors: "No Guarantee",
      highlight: true
    },
    {
      feature: "Lead Quality",
      brightside: "Decision Makers",
      competitors: "Mixed Results",
      highlight: false
    },
    {
      feature: "Refund Policy",
      brightside: "Full Refund",
      competitors: "No Refunds",
      highlight: true
    }
  ];

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-lg mx-auto">
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Why Choose Brightside AI?
          </h2>
          <p className="text-sm text-slate-600">
            See how we compare to traditional agencies
          </p>
        </div>
        
        <Card className="overflow-hidden shadow-xl border-2 border-blue-200">
          {/* Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b">
            <div className="text-sm font-medium text-slate-600">Feature</div>
            <div className="text-center">
              <Badge className="bg-green-600 text-white text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Brightside AI
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600">Competitors</div>
            </div>
          </div>
          
          {/* Comparison Rows */}
          {features.map((item, index) => (
            <div 
              key={index}
              className={`grid grid-cols-3 p-3 border-b border-slate-100 ${
                item.highlight ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <div className="text-sm font-medium text-slate-700 flex items-center">
                {item.highlight && <Zap className="w-3 h-3 text-yellow-500 mr-1" />}
                {item.feature}
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-bold ${
                  item.highlight ? 'text-green-700' : 'text-slate-700'
                }`}>
                  {item.brightside}
                </div>
                {item.highlight && (
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mt-1" />
                )}
              </div>
              
              <div className="text-center">
                <div className="text-sm text-red-600 font-medium">
                  {item.competitors}
                </div>
                {item.highlight && (
                  <X className="w-4 h-4 text-red-500 mx-auto mt-1" />
                )}
              </div>
            </div>
          ))}
          
          {/* Bottom CTA */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-slate-900">
                  Risk-Free Choice is Clear
                </span>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
                data-testid="button-comparison-cta"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start in 24 Hours - $0 Setup
              </Button>
              
              <div className="text-xs text-slate-500">
                ✨ No sales calls • No contracts • No setup fees
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}