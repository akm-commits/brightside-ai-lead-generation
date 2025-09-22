import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Gift, Clock, Download, Zap } from "lucide-react";

interface ExitIntentProps {
  onClose: () => void;
  onGetAudit: () => void;
  onGetTemplates: () => void;
}

export default function ExitIntent({ onClose, onGetAudit, onGetTemplates }: ExitIntentProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <Card className="max-w-md w-full bg-white shadow-2xl border-2 border-yellow-300 relative animate-in zoom-in duration-300 transform transition-all my-8 sm:my-0">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 min-h-10 min-w-10 sm:min-h-8 sm:min-w-8"
            onClick={onClose}
            data-testid="button-exit-intent-close"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>

          <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <Badge className="bg-red-500 text-white shadow-lg border-2 border-red-400">
              Wait! Don't Leave Empty Handed
            </Badge>
            <h3 className="text-xl font-bold text-slate-900">
              Get Your FREE Professional Lead Gen Report
            </h3>
            <p className="text-sm text-slate-600">
              Get a comprehensive audit report with ROI projections, personalized recommendations, and a 90-day implementation roadmap
            </p>
          </div>

          {/* Offers */}
          <div className="space-y-3">
            {/* Primary Offer */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-900">Professional Audit Report + PDF</span>
                  <Badge className="bg-blue-600 text-white text-xs">$500 Value</Badge>
                </div>
                <p className="text-sm text-slate-700">
                  Get a comprehensive analysis with scoring, ROI projections, recommendations, and downloadable PDF report
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={onGetAudit}
                  data-testid="button-get-audit"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Free Audit (5 Minutes)
                </Button>
              </div>
            </Card>

            {/* Alternative Offer */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-900">Cold Email Template Library</span>
                  <Badge className="bg-green-600 text-white text-xs">Free</Badge>
                </div>
                <p className="text-sm text-slate-700">
                  5 proven cold email templates with real performance data, organized by category and ready to use
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  onClick={onGetTemplates}
                  data-testid="button-get-templates"
                >
                  Browse Templates (Instant Access)
                </Button>
              </div>
            </Card>
          </div>

          {/* Urgency Element */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Limited Time: Next 50 People Only</span>
            </div>
            <div className="text-xs text-slate-500">
              Over 200 agencies have used these exact strategies
            </div>
          </div>

          {/* Small Alternative */}
          <div className="text-center">
            <button 
              className="text-xs text-slate-400 hover:text-slate-600 underline"
              onClick={onClose}
              data-testid="button-no-thanks"
            >
              No thanks, I'll figure it out myself
            </button>
          </div>
          </div>
        </Card>
      </div>
    </div>
  );
}