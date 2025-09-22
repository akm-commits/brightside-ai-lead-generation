import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScalingTimeline from "@/components/ScalingTimeline";
import ROICalculator from "@/components/ROICalculator";
import ComparisonTable from "@/components/ComparisonTable";
import SocialProof from "@/components/SocialProof";
import ExitIntent from "@/components/ExitIntent";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ApplicationForm from "@/components/ApplicationForm";

export default function Home() {
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent && !showForm) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };

    // Show exit intent after 30 seconds if not shown yet
    const timer = setTimeout(() => {
      if (!hasShownExitIntent && !showForm) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShownExitIntent, showForm]);

  const handleGetAudit = () => {
    setShowExitIntent(false);
    navigate("/audit");
  };

  const handleGetTemplates = () => {
    setShowExitIntent(false);
    navigate("/templates");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-32">
        <HeroSection />
        <ScalingTimeline onStartApplication={() => setShowForm(true)} />
        <ROICalculator />
        <ComparisonTable />
        <SocialProof />
      </main>
      
      {/* Sticky Mobile CTA */}
      <StickyMobileCTA onActionClick={() => setShowForm(true)} />
      
      {/* Exit Intent Modal */}
      {showExitIntent && (
        <ExitIntent 
          onClose={() => setShowExitIntent(false)}
          onGetAudit={handleGetAudit}
          onGetTemplates={handleGetTemplates}
        />
      )}
      
      {/* Application Form */}
      {showForm && <ApplicationForm onClose={() => setShowForm(false)} />}
    </div>
  );
}