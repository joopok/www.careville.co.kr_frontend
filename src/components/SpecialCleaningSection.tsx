import { Card } from "@/components/ui/card";
import { AirVent, Flame, Droplets, Trash2, Factory, AlertTriangle, Zap } from "lucide-react";

const SpecialCleaningSection = () => {
  const services = [
    {
      icon: AirVent,
      title: "에어컨 설치/수리",
      description: "전문 기술로 에어컨 설치 및 수리",
      difficulty: "전문",
      gradient: "from-blue-500 to-cyan-400",
      bg: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      icon: Factory,
      title: "식당 청소",
      description: "위생적인 주방 환경",
      difficulty: "중급",
      gradient: "from-orange-500 to-amber-400",
      bg: "bg-orange-50",
      iconColor: "text-orange-500"
    },
    {
      icon: Flame,
      title: "화재 청소",
      description: "화재 현장 복구 전문",
      difficulty: "고급",
      gradient: "from-red-600 to-rose-400",
      bg: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Droplets,
      title: "침수 청소",
      description: "수해 복구 및 건조",
      difficulty: "고급",
      gradient: "from-blue-600 to-indigo-400",
      bg: "bg-indigo-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Trash2,
      title: "쓰레기집 청소",
      description: "특수 상황 정리 전문",
      difficulty: "특수",
      gradient: "from-purple-600 to-violet-400",
      bg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Factory,
      title: "공장 청소",
      description: "산업 시설 전문 청소",
      difficulty: "고급",
      gradient: "from-slate-600 to-gray-400",
      bg: "bg-slate-50",
      iconColor: "text-slate-600"
    }
  ];

  return (
    <section id="special-cleaning" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white border border-destructive/20 px-5 py-2.5 rounded-full mb-6 shadow-sm">
            <Zap className="h-5 w-5 text-destructive fill-destructive/10" />
            <span className="text-destructive font-bold tracking-wide">SPECIAL CLEANING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
            어떤 상황도 <span className="text-primary relative inline-block">
              완벽하게
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> 해결합니다
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            특수한 환경에 최적화된 전문 장비와 숙련된 기술력으로<br className="hidden md:block" />
            고객님의 모든 청소 난제를 확실하게 해결해드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                      <service.icon className={`h-8 w-8 ${service.iconColor}`} />
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${service.bg} bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent border border-gray-100`}>
                    {service.difficulty}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 opacity-50" />
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-red-100/50 to-transparent transform skew-x-12" />
          
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6 max-w-2xl">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                  24시간 긴급 출동 서비스
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  화재, 침수 등 긴급 상황 발생 시 즉시 출동하여<br className="hidden md:block" />
                  피해를 최소화하고 빠른 복구를 도와드립니다.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-red-100 shadow-sm">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Emergency Call</span>
              <a href="tel:1600-9762" className="text-4xl font-black text-red-600 hover:text-red-700 transition-colors tracking-tight">
                1600-9762
              </a>
              <span className="text-xs font-medium text-red-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                지금 바로 연결 가능
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialCleaningSection;