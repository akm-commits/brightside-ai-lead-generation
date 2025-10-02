import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, X, Clock, Target, Star, Shield, Users, TrendingUp, DollarSign, Award, Zap } from "lucide-react";
import ApplicationForm from "./ApplicationForm";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(847);
  const [pipelineValue, setPipelineValue] = useState(2300000);

  // Animate counters on load
  useEffect(() => {
    const timer = setInterval(() => {
      setAppointmentCount(prev => prev + Math.floor(Math.random() * 3));
      setPipelineValue(prev => prev + Math.floor(Math.random() * 10000));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <section className="bg-gradient-to-br from-white via-blue-50 to-green-50 min-h-screen flex items-center py-8 px-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-lg mx-auto text-center space-y-6 relative z-10">
        {/* Live Stats */}
        <div className="flex justify-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-md shadow-green-300"></div>
            <span>Live: {appointmentCount} appointments delivered</span>
          </div>
        </div>
        
        {/* Main Headline & Value Proposition */}
        <div className="space-y-4">
          <div className="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide" data-testid="text-target-audience">
            For Marketing Agencies & SaaS Owners
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight" data-testid="text-hero-headline">
            Skip The Sales Pitch.
            <br />
            <span className="text-green-600">Get 10 Qualified Appointments.</span>
            <br />
            Pay <span className="text-blue-600">$0 Until We Deliver.</span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-600 leading-snug font-medium" data-testid="text-hero-subheadline">
            Marketing agencies & SaaS owners: We generate your next 10 qualified appointments in 30 days. 
            <span className="text-slate-900 font-bold">$0 setup. $200 per appointment. Only after results.</span>
          </p>
        </div>
        
        {/* Pain Points Section */}
        <Card className="p-4 bg-red-50 border-2 border-red-200">
          <div className="space-y-3">
            <div className="text-sm font-bold text-red-800 mb-2">Tired of...</div>
            <div className="text-xs text-red-700 space-y-1 text-left">
              <div>❌ $5K+ setup fees with no guarantee?</div>
              <div>❌ Agencies that pitch for weeks before starting?</div>
              <div>❌ Paying for leads that never convert?</div>
              <div>❌ Complex contracts and lengthy onboarding?</div>
            </div>
            <div className="text-xs font-bold text-green-700 mt-3">✅ We start working immediately. Pay only after delivery.</div>
          </div>
        </Card>
        
        {/* Gentleman's Agreement */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
          <div className="space-y-2">
            <div className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-1" data-testid="text-results-first">
              <Shield className="w-4 h-4 text-green-600" />
              Risk-Free Guarantee:
            </div>
            <div className="text-xs md:text-sm text-slate-700 leading-relaxed space-y-1 text-left" data-testid="text-guarantee-details">
              <div>• <span className="font-semibold text-green-700">$0 setup fee</span> (competitors charge $2K-10K)</div>
              <div>• <span className="font-semibold text-blue-700">30-day delivery</span> or full refund</div>
              <div>• <span className="font-semibold">$200 per appointment</span> paid ONLY after delivery</div>
              <div>• <span className="font-semibold text-purple-700">$2.3M+ pipeline</span> generated for clients</div>
            </div>
          </div>
        </Card>
        
        {/* Social Proof Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-600">{appointmentCount}+</div>
            <div className="text-xs text-slate-600">Appointments Delivered</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-green-600">${(pipelineValue / 1000000).toFixed(1)}M+</div>
            <div className="text-xs text-slate-600">Pipeline Generated</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-purple-600">50+</div>
            <div className="text-xs text-slate-600">Agencies Served</div>
          </div>
        </div>
        
        {/* Authority Elements */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <Award className="w-3 h-3 text-yellow-500" />
            <span>Featured in SaaS Marketing Weekly</span>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Join 50+ agencies already using our system</span>
          </div>
        </div>
        
        {/* Prominent CTA */}
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base px-6 py-4 h-auto font-bold shadow-xl transform hover:scale-105 transition-all duration-200 ring-2 ring-green-400 ring-opacity-50"
            onClick={() => setShowForm(true)}
            data-testid="button-hero-start"
          >
            <Zap className="w-4 h-4 mr-2" />
            Get 10 Appointments FREE
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg" 
            className="w-full border-2 border-slate-300 hover:bg-slate-50 text-slate-700 text-sm px-6 py-3 h-auto font-semibold"
            onClick={() => setShowForm(true)}
            data-testid="button-hero-alternative"
          >
            Skip Sales Call - Start Now
          </Button>
          
          <div className="text-xs text-slate-500" data-testid="text-guarantee-footer">
            <CheckCircle className="w-3 h-3 inline mr-1 text-green-600" />
            Zero upfront cost • 30-day guarantee • Pay after results
          </div>
        </div>
      </div>
    </section>
    
    {showForm && <ApplicationForm onClose={() => setShowForm(false)} />}
    </>
  );
}