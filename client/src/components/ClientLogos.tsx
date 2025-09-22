export default function ClientLogos() {
  // TODO: remove mock functionality - replace with real client logos
  const clientLogos = [
    "Google", "Microsoft", "Salesforce", "HubSpot", "Zoom", "Slack", 
    "Dropbox", "Shopify", "Stripe", "Adobe", "Mailchimp", "Asana"
  ];

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-clients-title">
            Email meetings won for industry leaders
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center max-w-6xl mx-auto">
          {clientLogos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 h-16 w-32 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              data-testid={`logo-${logo.toLowerCase()}`}
            >
              <span className="text-muted-foreground font-medium text-sm">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}