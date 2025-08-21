import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto text-white space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Get Your
            <br />
            <span className="text-primary-light">Space Sparkling Clean?</span>
          </h2>
          
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CleanBell for their cleaning needs.
            Get your free quote today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl group"
            >
              Get Free Quote Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Download App
            </Button>
          </div>
          
          <div className="text-sm opacity-75">
            ✓ No commitment required ✓ Compare quotes for free ✓ Trusted by 500,000+ customers
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default CTASection;