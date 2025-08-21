import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    title: "Move-in Cleaning",
    description: "Complete deep cleaning for new homes",
    image: "🏠",
    quotes: "11 average quotes",
    popular: true
  },
  {
    title: "Studio Cleaning", 
    description: "Specialized cleaning for small spaces",
    image: "🏢",
    quotes: "8 average quotes",
    popular: false
  },
  {
    title: "Washing Machine",
    description: "Deep cleaning and maintenance",
    image: "🧺",
    quotes: "5 average quotes", 
    popular: false
  },
  {
    title: "Air Conditioner",
    description: "Professional AC cleaning service",
    image: "❄️",
    quotes: "7 average quotes",
    popular: true
  },
  {
    title: "Bathroom Grouting",
    description: "Professional grouting and sealing",
    image: "🚿",
    quotes: "3 average quotes",
    popular: false
  },
  {
    title: "Moving Services",
    description: "Complete moving assistance",
    image: "📦",
    quotes: "12 average quotes",
    popular: true
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From budget-friendly options to premium mom-cafe recommended services
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{service.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      {service.popular && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {service.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {service.quotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;