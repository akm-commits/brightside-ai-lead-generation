import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Target } from "lucide-react";

export default function ROICalculator() {
  const [averageDealSize, setAverageDealSize] = useState(5000);
  const [closeRate, setCloseRate] = useState(25);
  
  // Calculate ROI
  const brightSideCost = 10 * 200; // 10 appointments at $200 each
  const competitorCost = 5000 + (10 * 200); // $5K setup + appointments
  
  const expectedDeals = (10 * closeRate) / 100;
  const expectedRevenue = expectedDeals * averageDealSize;
  const brightSideROI = ((expectedRevenue - brightSideCost) / brightSideCost * 100).toFixed(0);
  const competitorROI = ((expectedRevenue - competitorCost) / competitorCost * 100).toFixed(0);
  const savings = competitorCost - brightSideCost;

  return (
    <section className="pt-2 pb-8 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-lg mx-auto">
        <Card className="p-6 shadow-xl border-2 border-blue-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">ROI Calculator</h2>
            </div>
            
            <p className="text-sm text-slate-600">
              See how much you save vs. traditional agencies
            </p>
            
            {/* Input Controls */}
            <div className="space-y-4 text-left">
              <div>
                <label className="text-sm font-medium text-slate-700">Average Deal Size</label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={averageDealSize}
                    onChange={(e) => setAverageDealSize(Number(e.target.value))}
                    className="flex-1"
                    data-testid="input-deal-size"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    ${averageDealSize.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Expected Close Rate</label>
                <div className="flex items-center gap-2 mt-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={closeRate}
                    onChange={(e) => setCloseRate(Number(e.target.value))}
                    className="flex-1"
                    data-testid="input-close-rate"
                  />
                  <span className="text-sm font-bold text-slate-900">{closeRate}%</span>
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Card className="p-3 bg-green-50 border-green-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">Brightside AI</div>
                  <div className="text-2xl font-bold text-green-800">
                    ${brightSideCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Total Cost</div>
                  <Badge className="mt-1 bg-green-600 text-white text-xs">
                    {brightSideROI}% ROI
                  </Badge>
                </div>
              </Card>
              
              <Card className="p-3 bg-red-50 border-red-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-700">Competitors</div>
                  <div className="text-2xl font-bold text-red-800">
                    ${competitorCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-600">Total Cost</div>
                  <Badge className="mt-1 bg-red-600 text-white text-xs">
                    {competitorROI}% ROI
                  </Badge>
                </div>
              </Card>
            </div>
            
            {/* Savings Highlight */}
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-slate-900">
                  You Save ${savings.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">
                  + Expected Revenue: ${expectedRevenue.toLocaleString()} 
                  ({expectedDeals.toFixed(1)} deals)
                </div>
              </div>
            </Card>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              data-testid="button-roi-cta"
            >
              Get This ROI - Start Free
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}