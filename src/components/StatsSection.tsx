import { useEffect, useState } from "react";

const StatsSection = () => {
  const [counts, setCounts] = useState({
    requests: 0,
    reviews: 0,
    providers: 0
  });

  useEffect(() => {
    const duration = 2000;
    const targets = {
      requests: 50000,
      reviews: 12000,
      providers: 850
    };

    const startTime = Date.now();
    
    const updateCounts = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCounts({
        requests: Math.floor(targets.requests * progress),
        reviews: Math.floor(targets.reviews * progress), 
        providers: Math.floor(targets.providers * progress)
      });
      
      if (progress < 1) {
        requestAnimationFrame(updateCounts);
      }
    };
    
    updateCounts();
  }, []);

  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center text-white">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {counts.requests.toLocaleString()}+
            </div>
            <p className="text-lg opacity-90">
              Cleaning requests registered on CleanBell
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {counts.reviews.toLocaleString()}+
            </div>
            <p className="text-lg opacity-90">
              Customer reviews
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {counts.providers.toLocaleString()}+
            </div>
            <p className="text-lg opacity-90">
              Cleaning service providers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;