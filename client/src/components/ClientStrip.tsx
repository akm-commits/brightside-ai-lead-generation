export default function ClientStrip() {
  // TODO: remove mock functionality - replace with real client logos/testimonials
  const clients = [
    { name: "TechFlow", testimonial: "32% reply rate" },
    { name: "SaaS Growth", testimonial: "$280K new revenue" },
    { name: "Scale Agency", testimonial: "25 meetings/month" },
    { name: "Enterprise Co", testimonial: "450% ROI" },
    { name: "Growth Labs", testimonial: "18 new clients" },
  ];

  return (
    <section className="bg-slate-50 py-13 border-t border-b border-slate-200">
      <div className="container mx-auto px-8">
        <div className="text-center mb-8">
          <p className="text-slate-600 font-medium" data-testid="text-strip-title">
            Trusted by 200+ Marketing Agencies and SaaS Companies
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-13">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center px-5"
              data-testid={`client-${client.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="text-lg font-semibold text-slate-900 mb-1">
                {client.name}
              </div>
              <div className="text-sm text-green-600 font-medium">
                {client.testimonial}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}