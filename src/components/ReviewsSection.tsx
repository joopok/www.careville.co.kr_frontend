import { Card } from "@/components/ui/card";
import { Star, Quote, ThumbsUp, MessageSquare } from "lucide-react";
import { useState } from "react";

const ReviewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const reviews = [
    {
      id: 1,
      category: "home",
      name: "김민지",
      service: "입주 청소",
      rating: 5,
      date: "2024.01.15",
      content: "새 아파트 입주 청소 정말 만족스러웠어요! 구석구석 깨끗하게 해주셔서 기분좋게 입주했습니다.",
      likes: 42
    },
    {
      id: 2,
      category: "business",
      name: "이준호",
      service: "사무실 정기청소",
      rating: 5,
      date: "2024.01.10",
      content: "매주 정기적으로 오셔서 사무실을 깨끗하게 관리해주십니다. 직원들 만족도가 높아요.",
      likes: 38
    },
    {
      id: 3,
      category: "special",
      name: "박서연",
      service: "화재 청소",
      rating: 5,
      date: "2024.01.05",
      content: "화재로 인한 그을음과 냄새를 완벽하게 제거해주셨어요. 전문성이 느껴졌습니다.",
      likes: 67
    },
    {
      id: 4,
      category: "home",
      name: "최동욱",
      service: "이사 청소",
      rating: 5,
      date: "2023.12.28",
      content: "10년 살던 집인데 새집처럼 깨끗해졌어요. 보증금도 전액 돌려받았습니다!",
      likes: 55
    }
  ];

  const categories = [
    { id: "all", name: "전체", count: reviews.length },
    { id: "home", name: "홈클리닝", count: reviews.filter(r => r.category === "home").length },
    { id: "business", name: "사업장", count: reviews.filter(r => r.category === "business").length },
    { id: "special", name: "특수청소", count: reviews.filter(r => r.category === "special").length }
  ];

  const filteredReviews = selectedCategory === "all" 
    ? reviews 
    : reviews.filter(r => r.category === selectedCategory);

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold">작업후기</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            고객님들의 생생한 후기
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            온다클린을 경험하신 고객님들의 진솔한 이야기를 들어보세요
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredReviews.map((review, index) => (
            <Card 
              key={review.id}
              className="p-6 hover:shadow-lg transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <Quote className="h-8 w-8 text-primary/20 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-lg">{review.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.service} • {review.date}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>도움이 돼요 ({review.likes})</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-2xl font-bold mb-1">평균 4.9점</div>
            <div className="text-muted-foreground">12,000+ 고객 리뷰 기준</div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;