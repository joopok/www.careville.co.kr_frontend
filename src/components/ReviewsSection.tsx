import { Card } from "@/components/ui/card";
import { Star, Quote, ThumbsUp, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, memo, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import './ReviewsSection.css';

const ReviewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const swiperRef = useRef<SwiperType>();

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
    },
    {
      id: 5,
      category: "home",
      name: "정수아",
      service: "정기 청소",
      rating: 5,
      date: "2024.01.20",
      content: "매월 정기청소 서비스를 이용하고 있는데, 항상 친절하고 꼼꼼하게 청소해주세요.",
      likes: 33
    },
    {
      id: 6,
      category: "business",
      name: "강민수",
      service: "매장 청소",
      rating: 5,
      date: "2024.01.18",
      content: "카페 운영중인데 새벽 시간에 와서 깔끔하게 청소해주셔서 너무 좋아요.",
      likes: 45
    },
    {
      id: 7,
      category: "special",
      name: "윤지원",
      service: "곰팡이 제거",
      rating: 5,
      date: "2024.01.12",
      content: "욕실 곰팡이가 심했는데 완전히 제거해주시고 예방법까지 알려주셨어요.",
      likes: 58
    },
    {
      id: 8,
      category: "home",
      name: "송현우",
      service: "대청소",
      rating: 5,
      date: "2024.01.08",
      content: "명절 대청소 서비스 정말 만족합니다. 온 가족이 편하게 명절을 보냈어요.",
      likes: 41
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

  // Group reviews in pairs for 2x2 grid display
  const groupedReviews = [];
  for (let i = 0; i < filteredReviews.length; i += 4) {
    groupedReviews.push(filteredReviews.slice(i, i + 4));
  }

  const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
    <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 bg-white">
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
          
          <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
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
  );

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-white to-gray-50">
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
            케어빌을 경험하신 고객님들의 진솔한 이야기를 들어보세요
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

        <div className="relative max-w-6xl mx-auto">
          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Grid, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            grid={{
              rows: 2,
              fill: 'row'
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                grid: {
                  rows: 2,
                  fill: 'row'
                }
              }
            }}
            className="reviews-swiper pb-12"
            style={{
              '--swiper-pagination-color': 'hsl(var(--primary))',
              '--swiper-pagination-bullet-inactive-color': '#e5e7eb',
              '--swiper-pagination-bullet-inactive-opacity': '1',
              '--swiper-pagination-bullet-size': '8px',
              '--swiper-pagination-bullet-horizontal-gap': '6px'
            } as React.CSSProperties}
          >
            {filteredReviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="h-full pb-2">
                  <ReviewCard review={review} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default memo(ReviewsSection);