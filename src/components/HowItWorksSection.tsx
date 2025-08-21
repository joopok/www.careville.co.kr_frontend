import { Card, CardContent } from "@/components/ui/card";
import { Clock, Search, Calendar } from "lucide-react";

const steps = [
  {
    icon: Clock,
    title: "Easy Application",
    description: "Complete in just 30 seconds!",
    detail: "Fill out a simple form with your cleaning requirements and location details."
  },
  {
    icon: Search,
    title: "Compare Quotes",
    description: "Get up to 10 quotes",
    detail: "Receive competitive quotes from verified cleaning professionals in your area."
  },
  {
    icon: Calendar,
    title: "Simple Booking",
    description: "One-click booking",
    detail: "Choose your preferred service provider and book with a single click."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-muted/30" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Super Deals to Popular Mom-Cafe Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            1-minute application, compare up to 10 cleaning service quotes, easy booking
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-primary font-medium mb-4">
                  {step.description}
                </p>
                
                <p className="text-muted-foreground text-sm">
                  {step.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;