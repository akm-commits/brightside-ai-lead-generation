import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // TODO: remove mock functionality - integrate with real calendar booking
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="bg-slate-900 py-21 text-white" id="booking">
      <div className="container mx-auto px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Badge 
            variant="outline" 
            className="text-green-400 border-green-500 bg-green-900/20 px-5 py-2 text-base mb-8"
            data-testid="badge-guarantee-final"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Zero Risk • 10 Appointments Guaranteed
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-5" data-testid="text-booking-title">
            Ready to Get Your First 10 Appointments?
          </h2>
          
          <p className="text-xl text-slate-300 mb-13" data-testid="text-booking-subtitle">
            Book a 15-minute call to discuss your goals. If we can't deliver 10 qualified appointments in 30 days, 
            you owe nothing.
          </p>
          
          {isSubmitted ? (
            <Card className="p-13 bg-white text-slate-900">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-5" />
                <h3 className="text-2xl font-bold mb-3" data-testid="text-success-title">
                  Thanks! We'll be in touch within 2 hours.
                </h3>
                <p className="text-slate-600" data-testid="text-success-message">
                  Check your email for calendar link and next steps.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-13 bg-white text-slate-900">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-13 text-base"
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-13 text-base"
                      data-testid="input-email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-700">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="h-13 text-base"
                    data-testid="input-company"
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl px-13 py-5 h-auto" data-testid="button-book">
                  Book Your Call Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </Card>
          )}
          
          <p className="text-slate-400 text-base mt-8" data-testid="text-guarantee-footer">
            No contracts • No setup fees until we prove results • Full refund guarantee
          </p>
        </div>
      </div>
    </section>
  );
}