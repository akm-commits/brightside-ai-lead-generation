import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

interface StickyMobileCTAProps {
  onActionClick: () => void;
}

export default function StickyMobileCTA({ onActionClick }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 300px
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t-2 border-green-300 shadow-2xl md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-sm font-bold text-slate-900">
            10 Appointments • $0 Setup
          </div>
          <div className="text-xs text-slate-600">
            Pay only after delivery
          </div>
        </div>
        <Button 
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 shadow-lg shadow-green-300 border-2 border-green-400"
          onClick={onActionClick}
          data-testid="button-sticky-mobile-cta"
        >
          <Zap className="w-4 h-4 mr-1" />
          Start Free
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}