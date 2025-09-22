import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ApplicationFormProps {
  onClose: () => void;
}

interface FormData {
  companyName: string;
  name: string;
  email: string;
  website: string;
  currentRevenue: string;
  desiredRevenue: string;
  agreesToPay: boolean;
}

export default function ApplicationForm({ onClose }: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    name: "",
    email: "",
    website: "",
    currentRevenue: "",
    desiredRevenue: "",
    agreesToPay: false,
  });
  
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/submit-application', data);
      return await response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const revenueOptions = [
    { value: "0-50k", label: "$0 - $50K" },
    { value: "50k-100k", label: "$50K - $100K" },
    { value: "100k-250k", label: "$100K - $250K" },
    { value: "250k-500k", label: "$250K - $500K" },
    { value: "500k-1m", label: "$500K - $1M" },
    { value: "1m-5m", label: "$1M - $5M" },
    { value: "5m+", label: "$5M+" },
  ];

  const desiredRevenueOptions = [
    { value: "100k-250k", label: "$100K - $250K" },
    { value: "250k-500k", label: "$250K - $500K" },
    { value: "500k-1m", label: "$500K - $1M" },
    { value: "1m-5m", label: "$1M - $5M" },
    { value: "5m-10m", label: "$5M - $10M" },
    { value: "10m+", label: "$10M+" },
  ];

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
        <div className="min-h-full flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Card className="w-full max-w-lg p-8 text-center space-y-6 transform transition-all my-8 mb-20 sm:my-0">
          <div className="text-2xl font-bold text-green-600" data-testid="text-success-title">
            Thank you for your application!
          </div>
          <div className="text-slate-700 leading-relaxed space-y-4" data-testid="text-success-message">
            <p>
              We will reach out with our timeline and any additional information we may need.
            </p>
            <p>
              If you have questions or want to schedule a call, speak with our team{" "}
              <a href="tel:9168337150" className="font-semibold text-blue-600 hover:underline">
                (916) 833-7150
              </a>
            </p>
            <p>
              Otherwise sit back, relax, and wait for our first email in 24 hours.
            </p>
          </div>
          <Button 
            onClick={onClose} 
            className="w-full"
            data-testid="button-close-success"
          >
            Close
          </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <Card className="w-full max-w-lg p-6 space-y-6 transform transition-all my-8 mb-20 sm:my-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900" data-testid="text-form-title">
            Start Your Application
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8"
            data-testid="button-close-form"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                data-testid="input-company-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                data-testid="input-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL *</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              required
              data-testid="input-website"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Annual Revenue *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, currentRevenue: value })} required>
                <SelectTrigger data-testid="select-current-revenue">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {revenueOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Desired Annual Revenue *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, desiredRevenue: value })} required>
                <SelectTrigger data-testid="select-desired-revenue">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  {desiredRevenueOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox 
              id="agreesToPay"
              checked={formData.agreesToPay}
              onCheckedChange={(checked) => setFormData({ ...formData, agreesToPay: !!checked })}
              required
              data-testid="checkbox-agreement"
            />
            <Label htmlFor="agreesToPay" className="text-sm leading-snug">
              I agree to pay $2,000 after 10 appointments are delivered *
            </Label>
          </div>

          <div className="text-xs text-slate-600 bg-blue-50 p-3 rounded" data-testid="text-ai-analysis">
            Our team will get to work analyzing your website and come up with an initial strategy.
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600" 
            disabled={submitMutation.isPending}
            data-testid="button-submit"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
        </Card>
      </div>
    </div>
  );
}