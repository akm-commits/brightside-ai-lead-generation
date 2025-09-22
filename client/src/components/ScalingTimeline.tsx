import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Target, ArrowRight, CheckCircle, Star } from "lucide-react";

interface ScalingTimelineProps {
  onStartApplication: () => void;
}

export default function ScalingTimeline({ onStartApplication }: ScalingTimelineProps) {
  const [activeMonth, setActiveMonth] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMonth(prev => prev === 3 ? 1 : prev + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const months = [
    {
      month: 1,
      title: "Month 1",
      subtitle: "Get Started",
      appointments: 10,
      description: "First 10 qualified appointments delivered",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300"
    },
    {
      month: 2,
      title: "Month 2", 
      subtitle: "Scale Up",
      appointments: 30,
      description: "Proven system scales to 30 appointments",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300"
    },
    {
      month: 3,
      title: "Month 3+",
      subtitle: "Fill Your Books",
      appointments: "50+",
      description: "Scale to whatever you need to fill your pipeline",
      icon: Star,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300"
    }
  ];

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-bold">
            <Calendar className="w-4 h-4 mr-2" />
            Scaling Timeline
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            From 10 to Full Pipeline<br className="md:hidden" />
            <span className="md:inline"> in 90 Days</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Start small, scale fast. Our proven system grows with your business needs.
          </p>
        </div>

        {/* Timeline Cards */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-300 via-green-300 to-purple-300 transform -translate-y-1/2 z-0"></div>
          
          {months.map((monthData, index) => {
            const Icon = monthData.icon;
            const isActive = activeMonth === monthData.month;
            
            return (
              <Card 
                key={monthData.month}
                className={`relative z-10 p-6 text-center space-y-4 transition-all duration-500 transform hover:scale-105 ${
                  isActive ? `${monthData.bgColor} ${monthData.borderColor} border-2 shadow-xl scale-105` : 'bg-white border-gray-200 hover:shadow-lg'
                }`}
                data-testid={`card-month-${monthData.month}`}
              >
                {/* Month Badge */}
                <div className="flex items-center justify-center">
                  <Badge className={`bg-gradient-to-r ${monthData.color} text-white px-3 py-1 text-xs font-bold`}>
                    {monthData.title}
                  </Badge>
                </div>

                {/* Icon and Number */}
                <div className="space-y-3">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${monthData.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-slate-900">
                      {monthData.appointments}
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      Appointments
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-900">
                    {monthData.subtitle}
                  </div>
                  <div className="text-sm text-slate-600">
                    {monthData.description}
                  </div>
                </div>

                {/* Success Indicator */}
                {isActive && (
                  <div className="flex items-center justify-center text-xs text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Proven Results
                  </div>
                )}

                {/* Arrow for mobile */}
                {index < 2 && (
                  <div className="md:hidden flex justify-center pt-4">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div></div>
            <div className="flex justify-center">
              <Button 
                onClick={onStartApplication}
                variant="outline"
                className="text-sm font-bold text-slate-900 hover:bg-green-50 border-2 border-green-300 px-7 py-2"
                data-testid="button-scale-pipeline"
              >
                Ready to scale your appointment pipeline?
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div></div>
          </div>
          <div className="flex justify-center">
            <div className="text-xs text-green-600 space-y-1 text-left">
              <div>✓ Start with zero risk</div>
              <div>✓ Scale at your own pace</div>
              <div>✓ Pay only for results</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}