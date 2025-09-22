import { Card } from "@/components/ui/card";

export default function ValueProposition() {
  return (
    <section className="bg-slate-50 py-21">
      <div className="container mx-auto px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-13">
            <h2 className="text-4xl font-bold text-slate-900 mb-5" data-testid="text-value-title">
              How It Works
            </h2>
            <p className="text-xl text-slate-600" data-testid="text-value-subtitle">
              Dead simple. Hands-free. Results guaranteed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-white border-0 shadow-sm">
              <div className="space-y-5">
                <div className="w-13 h-13 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900" data-testid="text-step1-title">
                  $500 Tech Setup
                </h3>
                <p className="text-slate-600" data-testid="text-step1-desc">
                  We configure your entire cold email infrastructure. Professional domains, warm-up, tracking.
                </p>
              </div>
            </Card>
            
            <Card className="p-8 text-center bg-white border-0 shadow-sm">
              <div className="space-y-5">
                <div className="w-13 h-13 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900" data-testid="text-step2-title">
                  10 Guaranteed Appointments
                </h3>
                <p className="text-slate-600" data-testid="text-step2-desc">
                  We deliver qualified prospects who book meetings with you. No appointments = full refund.
                </p>
              </div>
            </Card>
            
            <Card className="p-8 text-center bg-white border-0 shadow-sm">
              <div className="space-y-5">
                <div className="w-13 h-13 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900" data-testid="text-step3-title">
                  $200 Per Appointment
                </h3>
                <p className="text-slate-600" data-testid="text-step3-desc">
                  Only pay for results. Each qualified appointment costs $200. Scale to 50+ appointments/month.
                </p>
              </div>
            </Card>
          </div>
          
          <div className="mt-13 p-8 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-900 mb-3" data-testid="text-roi-title">
                ROI Example: Marketing Agency
              </h3>
              <p className="text-green-800 text-lg" data-testid="text-roi-example">
                $500 setup + $2,000 (10 appointments) = $2,500 total cost<br/>
                <strong>Average client value: $5,000-15,000</strong> → <strong>200-500% ROI in month 1</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}