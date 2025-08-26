import { useState, memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Star, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PricingSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const pricingData = {
    home: [
      {
        id: 1,
        name: "원룸/오피스텔 청소",
        description: "전문 장비를 활용한 깔끔한 원룸 청소",
        price: "50,000",
        originalPrice: "70,000",
        discount: "29%",
        features: [
          "거실, 주방, 욕실 전체 청소",
          "바닥 걸레질 및 진공청소",
          "창문 및 창틀 청소",
          "기본 정리정돈"
        ],
        duration: "2-3시간",
        popular: false
      },
      {
        id: 2,
        name: "아파트 기본 청소",
        description: "20-30평형 아파트 전문 청소",
        price: "80,000",
        originalPrice: "100,000",
        discount: "20%",
        features: [
          "전 구역 청소 (거실, 방, 주방, 욕실)",
          "바닥 및 걸레질",
          "먼지 제거 및 진공청소",
          "주방 기기 외부 청소",
          "욕실 타일 및 위생도기 청소"
        ],
        duration: "3-4시간",
        popular: true
      },
      {
        id: 3,
        name: "대형 아파트 청소",
        description: "40평 이상 대형 아파트 청소",
        price: "120,000",
        originalPrice: "150,000",
        discount: "20%",
        features: [
          "전 구역 디테일 청소",
          "베란다 청소 포함",
          "수납공간 정리",
          "대형 가전 외부 청소",
          "추가 욕실 청소"
        ],
        duration: "4-5시간",
        popular: false
      }
    ],
    special: [
      {
        id: 4,
        name: "에어컨 설치 및 수리 전문",
        description: "천장형, 벽걸이형, 스탠드형 에어컨 설치, 수리, 청소 통합 서비스",
        price: "90,000",
        originalPrice: "120,000",
        discount: "25%",
        features: [
          "신규 에어컨 전문 설치",
          "고장 진단 및 수리",
          "냉매 충전 서비스",
          "완전 분해 세척",
          "1년 A/S 보증"
        ],
        duration: "2-3시간",
        popular: true
      },
      {
        id: 5,
        name: "주방 UV 코팅",
        description: "상판 UV코팅, 크랙보수, 실리콘 마감",
        price: "280,000",
        originalPrice: "350,000",
        discount: "20%",
        features: [
          "상판 완벽 UV 코팅",
          "크랙 및 스크래치 보수",
          "실리콘 재시공",
          "싱크대 연마 및 코팅",
          "3년 품질 보증"
        ],
        duration: "4-5시간",
        popular: false
      },
      {
        id: 6,
        name: "욕실 나노 코팅",
        description: "나노코팅, 줄눈시공, 곰팡이제거",
        price: "350,000",
        originalPrice: "450,000",
        discount: "22%",
        features: [
          "욕실 전체 나노 코팅",
          "줄눈 완벽 재시공",
          "곰팡이 완전 제거",
          "타일 광택 복원",
          "5년 품질 보증"
        ],
        duration: "6-7시간",
        popular: true
      },
      {
        id: 7,
        name: "주방 시공",
        description: "주방 리모델링 및 싱크대 교체 전문",
        price: "450,000",
        originalPrice: "550,000",
        discount: "18%",
        features: [
          "싱크대 완전 교체",
          "상부장/하부장 설치",
          "수전 및 배관 교체",
          "타일 시공 가능",
          "2년 시공 보증"
        ],
        duration: "1-2일",
        popular: false
      },
      {
        id: 8,
        name: "층간소음 매트 시공",
        description: "프리미엄 층간소음 방지 매트 설치",
        price: "180,000",
        originalPrice: "220,000",
        discount: "18%",
        features: [
          "고밀도 흡음재 사용",
          "전문가 정밀 시공",
          "바닥 평탄화 작업",
          "친환경 인증 자재",
          "10년 품질 보증"
        ],
        duration: "4-5시간",
        popular: true
      }
    ],
    business: [
      {
        id: 9,
        name: "소형 사무실 청소",
        description: "30평 이하 사무실 정기 청소",
        price: "150,000",
        originalPrice: "200,000",
        discount: "25%",
        features: [
          "사무실 전체 청소",
          "회의실 및 휴게실 청소",
          "카펫 청소",
          "유리창 청소",
          "화장실 청소"
        ],
        duration: "3-4시간",
        popular: false
      },
      {
        id: 10,
        name: "매장 전문 청소",
        description: "카페, 음식점, 소매점 청소",
        price: "200,000",
        originalPrice: "250,000",
        discount: "20%",
        features: [
          "매장 전체 청소",
          "주방 및 조리 공간 청소",
          "홀 및 테이블 청소",
          "화장실 특별 청소",
          "입구 및 간판 청소"
        ],
        duration: "4-5시간",
        popular: true
      },
      {
        id: 11,
        name: "대형 사무실 청소",
        description: "100평 이상 사무실 청소",
        price: "400,000",
        originalPrice: "500,000",
        discount: "20%",
        features: [
          "전 층 청소 서비스",
          "서버실 및 특수 구역 청소",
          "대형 회의실 청소",
          "휴게 공간 및 식당 청소",
          "주차장 청소"
        ],
        duration: "8시간+",
        popular: false
      }
    ]
  };

  const allPricing = [...pricingData.home, ...pricingData.special, ...pricingData.business];
  const displayData = selectedCategory === "all" ? allPricing : pricingData[selectedCategory as keyof typeof pricingData];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            명확한 가격 정책
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            투명하고 <span className="text-primary">합리적인 가격</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            추가 비용 걱정 없는 정직한 가격 정책으로 신뢰를 드립니다.
            모든 서비스 가격은 VAT 포함이며, 숨겨진 비용은 일체 없습니다.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              전체
            </TabsTrigger>
            <TabsTrigger value="home" onClick={() => setSelectedCategory("home")}>
              가정 청소
            </TabsTrigger>
            <TabsTrigger value="special" onClick={() => setSelectedCategory("special")}>
              특수 청소
            </TabsTrigger>
            <TabsTrigger value="business" onClick={() => setSelectedCategory("business")}>
              사업장
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative h-full transition-all duration-300 hover:border-primary hover:shadow-xl ${item.popular ? 'border-gray-200' : 'border-gray-200'} group`}>
                {item.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      인기 서비스
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <CardDescription className="mt-2">{item.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{item.price}원</span>
                      <span className="text-lg text-muted-foreground line-through">{item.originalPrice}원</span>
                      <Badge variant="destructive" className="ml-auto">
                        {item.discount} 할인
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      소요시간: {item.duration}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-gray-400 group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors duration-300" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300" variant="outline">
                    예약하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">맞춤 견적이 필요하신가요?</h3>
              <p className="text-muted-foreground mb-6">
                특별한 요구사항이나 대규모 프로젝트의 경우 무료 맞춤 견적을 제공해 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  무료 견적 받기
                </Button>
                <Button size="lg" variant="outline">
                  전화 상담: 1577-8282
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(PricingSection);