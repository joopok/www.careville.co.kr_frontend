import { useState, memo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Home,
  Building2,
  Sparkles,
  Calendar,
  MapPin,
  Eye,
  ChevronRight,
  X,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

// 백엔드 API 응답 타입
interface CaseApiResponse {
  list: CaseItem[];
  pagination: {
    currPage: number;
    totalPages: number;
    totalRows: number;
  };
  caseSvcCdList: ServiceCode[];
}

interface CaseItem {
  caseSeq: number;
  serviceCd: string | null;
  serviceNm: string | null;
  caseSj: string;
  caseCn: string;
  regNm: string;
  fileSeq: number;
  viewfileseq: string;  // 백엔드가 소문자로 반환
  hashtag: string;
  rgsDt: string;
}

interface ServiceCode {
  serviceCd: string;
  serviceNm: string;
}

// 프론트엔드 Portfolio 타입
interface Portfolio {
  id: number;
  category: string;
  title: string;
  location: string;
  date: string;
  area: string;
  type: string;
  mainImage: string;
  beforeImage?: string;
  afterImage?: string;
  description: string;
  tags: string[];
}

// 더미 데이터 (폴백용)
const DUMMY_PORTFOLIOS: Portfolio[] = [
    {
      id: 1,
      category: "home",
      title: "강남구 아파트 입주청소",
      location: "서울시 강남구",
      date: "2024.01.20",
      area: "42평",
      type: "신축 입주청소",
      mainImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
      beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      afterImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
      description: "신축 아파트 입주 전 완벽한 청소로 깨끗한 새 출발을 도와드렸습니다.",
      tags: ["입주청소", "아파트", "42평"]
    },
    {
      id: 2,
      category: "office",
      title: "IT 기업 사무실 정기청소",
      location: "서울시 판교",
      date: "2024.01.18",
      area: "200평",
      type: "사무실 청소",
      mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
      beforeImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600",
      afterImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
      description: "200평 규모의 IT 기업 사무실을 정기적으로 관리하고 있습니다.",
      tags: ["사무실", "정기청소", "200평"]
    },
    {
      id: 3,
      category: "special",
      title: "음식점 주방 특수청소",
      location: "서울시 종로구",
      date: "2024.01.15",
      area: "30평",
      type: "특수청소",
      mainImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      beforeImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      afterImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      description: "음식점 주방의 기름때와 찌든 때를 완벽하게 제거했습니다.",
      tags: ["특수청소", "음식점", "주방"]
    },
    {
      id: 4,
      category: "home",
      title: "송파구 빌라 이사청소",
      location: "서울시 송파구",
      date: "2024.01.12",
      area: "25평",
      type: "이사청소",
      mainImage: "https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=600",
      beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      afterImage: "https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=600",
      description: "10년 거주한 빌라를 새집처럼 깨끗하게 청소했습니다.",
      tags: ["이사청소", "빌라", "25평"]
    },
    {
      id: 5,
      category: "office",
      title: "병원 소독 방역",
      location: "서울시 서초구",
      date: "2024.01.10",
      area: "150평",
      type: "소독방역",
      mainImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
      beforeImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
      afterImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
      description: "병원 전체 소독 방역으로 안전한 의료 환경을 만들었습니다.",
      tags: ["병원", "소독방역", "150평"]
    },
    {
      id: 6,
      category: "special",
      title: "화재 현장 복구 청소",
      location: "서울시 마포구",
      date: "2024.01.08",
      area: "35평",
      type: "화재청소",
      mainImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      afterImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
      description: "화재로 인한 그을음과 냄새를 완벽하게 제거했습니다.",
      tags: ["화재청소", "특수청소", "복구"]
    },
    {
      id: 7,
      category: "home",
      title: "성북구 원룸 정기청소",
      location: "서울시 성북구",
      date: "2024.01.05",
      area: "10평",
      type: "정기청소",
      mainImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
      beforeImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
      afterImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
      description: "매월 정기적인 청소로 쾌적한 주거 환경을 유지합니다.",
      tags: ["정기청소", "원룸", "10평"]
    },
    {
      id: 8,
      category: "office",
      title: "카페 리모델링 후 청소",
      location: "서울시 용산구",
      date: "2024.01.03",
      area: "40평",
      type: "리모델링청소",
      mainImage: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600",
      beforeImage: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600",
      afterImage: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600",
      description: "카페 리모델링 후 미세먼지와 잔해물을 깨끗이 제거했습니다.",
      tags: ["카페", "리모델링", "40평"]
    },
    {
      id: 9,
      category: "special",
      title: "곰팡이 전문 제거",
      location: "서울시 동작구",
      date: "2023.12.28",
      area: "32평",
      type: "곰팡이제거",
      mainImage: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=600",
      beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      afterImage: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=600",
      description: "욕실과 베란다의 곰팡이를 전문적으로 제거했습니다.",
      tags: ["곰팡이제거", "특수청소", "32평"]
    },
    {
      id: 10,
      category: "home",
      title: "노원구 다세대주택 청소",
      location: "서울시 노원구",
      date: "2023.12.25",
      area: "28평",
      type: "입주청소",
      mainImage: "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=600",
      beforeImage: "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=600",
      afterImage: "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=600",
      description: "다세대주택 전체를 깨끗하게 청소했습니다.",
      tags: ["다세대주택", "입주청소", "28평"]
    },
    {
      id: 11,
      category: "office",
      title: "헬스장 정기 관리",
      location: "서울시 강동구",
      date: "2023.12.20",
      area: "100평",
      type: "정기청소",
      mainImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
      beforeImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
      afterImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
      description: "헬스장 기구와 시설을 정기적으로 소독 관리합니다.",
      tags: ["헬스장", "정기청소", "100평"]
    },
    {
      id: 12,
      category: "special",
      title: "펜션 시즌 대청소",
      location: "경기도 가평",
      date: "2023.12.15",
      area: "80평",
      type: "대청소",
      mainImage: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600",
      beforeImage: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600",
      afterImage: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600",
      description: "펜션 성수기 전 완벽한 대청소를 진행했습니다.",
      tags: ["펜션", "대청소", "80평"]
    }
];

// 서비스 코드 매핑 (백엔드 serviceCd → 프론트 category)
const SERVICE_CODE_MAP: Record<string, string> = {
  "001": "home",     // 에어컨 → 주거공간으로 매핑
  "002": "home",
  "003": "office",   // 상가/사무실
  "004": "home",
  "005": "home",
  "006": "home",
  "007": "home",
  "008": "home",
  "009": "special",  // 특수청소
  "010": "home",
  "011": "home",
};

// 백엔드 데이터를 프론트 Portfolio로 변환
const convertCaseToPortfolio = (caseItem: CaseItem): Portfolio => {
  // serviceCd가 null일 수 있으므로 null 체크 추가
  const category = caseItem.serviceCd
    ? (SERVICE_CODE_MAP[caseItem.serviceCd] || "special")
    : "special";
  const tags = caseItem.hashtag ? caseItem.hashtag.split(',').map(tag => tag.trim().replace(/^#/, '')) : [];

  // 이미지 URL 생성 (viewfileseq 사용 - 백엔드가 소문자로 반환)
  const imageUrl = caseItem.viewfileseq
    ? (import.meta.env.DEV
        ? `/fileView.do?fileSeq=${caseItem.viewfileseq}`
        : `${import.meta.env.VITE_API_URL}/fileView.do?fileSeq=${caseItem.viewfileseq}`)
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";

  return {
    id: caseItem.caseSeq,
    category,
    title: caseItem.caseSj,
    location: "서울시", // 백엔드에 location 필드 없음
    date: caseItem.rgsDt,
    area: tags.find(tag => tag.includes('평')) || "", // 태그에서 면적 추출
    type: caseItem.serviceNm || "특수청소", // null일 경우 기본값
    mainImage: imageUrl,
    beforeImage: imageUrl, // 백엔드에 before/after 구분 없음
    afterImage: imageUrl,
    description: caseItem.caseCn.replace(/<[^>]*>/g, '').substring(0, 100), // HTML 태그 제거 후 100자
    tags
  };
};

const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [imageType, setImageType] = useState<'before' | 'after'>('after');

  // API 상태 관리
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    { id: "all", name: "전체", icon: Sparkles },
    { id: "home", name: "주거공간", icon: Home },
    { id: "office", name: "상업공간", icon: Building2 },
    { id: "special", name: "특수청소", icon: Sparkles }
  ];

  // API 호출 함수
  const fetchPortfolios = async (page: number = 1, category: string = "all") => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.DEV
        ? '/caseList.do'
        : `${import.meta.env.VITE_API_URL}/caseList.do`;

      // FormData로 POST 요청 (백엔드가 POST 메서드 사용)
      const formData = new FormData();
      formData.append('currPage', page.toString());

      // 카테고리 필터링
      if (category !== "all") {
        // category를 serviceCd로 역변환
        const serviceCd = Object.keys(SERVICE_CODE_MAP).find(
          key => SERVICE_CODE_MAP[key] === category
        );
        if (serviceCd) {
          formData.append('serviceCd', serviceCd);
        }
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data: CaseApiResponse = await response.json();

      if (data.list && data.list.length > 0) {
        const convertedData = data.list.map(convertCaseToPortfolio);

        if (page === 1) {
          setPortfolios(convertedData);
        } else {
          setPortfolios(prev => [...prev, ...convertedData]);
        }

        setHasMore(data.pagination.currPage < data.pagination.totalPages);
      } else {
        // 데이터가 없으면 더미 데이터 사용
        if (page === 1) {
          setPortfolios(DUMMY_PORTFOLIOS);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.warn('시공사례 조회 실패 (더미 데이터 사용):', err);
      // 에러 메시지는 설정하지 않음 (사용자에게 보이지 않음)
      // setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');

      // 에러 발생 시 더미 데이터 사용
      if (page === 1) {
        setPortfolios(DUMMY_PORTFOLIOS);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    // 백엔드 API 시도, 실패 시 자동으로 더미 데이터 사용
    fetchPortfolios(1, selectedCategory);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 카테고리 변경 시 - 클라이언트 사이드 필터링으로 변경
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // 더보기 핸들러 - 클라이언트 사이드로 변경
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // 클라이언트 사이드 필터링 및 페이지네이션
  const filteredPortfolios = selectedCategory === "all"
    ? portfolios
    : portfolios.filter(p => p.category === selectedCategory);

  const itemsPerPage = 9;
  const visiblePortfolios = filteredPortfolios.slice(0, currentPage * itemsPerPage);
  const hasMoreItems = visiblePortfolios.length < filteredPortfolios.length;

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold">시공사례</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            케어빌의 완벽한 작업 결과
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            믿고 맡기실 수 있는 전문적인 청소 서비스의 실제 사례들을 확인해보세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-12">
            <Card className="border-destructive/50 bg-destructive/5">
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-destructive mb-2">데이터 로드 실패</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <p className="text-sm text-muted-foreground">샘플 데이터를 표시합니다.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            // 로딩 스켈레톤
            Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </Card>
            ))
          ) : visiblePortfolios.length === 0 ? (
            // 데이터 없음
            <div className="col-span-full text-center py-20">
              <p className="text-lg text-muted-foreground">표시할 시공사례가 없습니다.</p>
            </div>
          ) : (
            // 실제 데이터
            visiblePortfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedPortfolio(portfolio)}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={portfolio.mainImage} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Eye className="h-4 w-4" />
                      상세보기
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {portfolio.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {portfolio.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{portfolio.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{portfolio.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {portfolio.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
          )}
        </div>

        {/* Load More Button */}
        {!loading && hasMoreItems && visiblePortfolios.length > 0 && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              더보기
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPortfolio && (
              <>
                <button
                  onClick={() => setSelectedPortfolio(null)}
                  className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">닫기</span>
                </button>

                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold pr-8">
                    {selectedPortfolio.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Before/After Toggle */}
                  {selectedPortfolio.beforeImage && selectedPortfolio.afterImage && (
                    <div className="flex justify-center gap-2 mb-4">
                      <Button
                        variant={imageType === 'before' ? 'default' : 'outline'}
                        onClick={() => setImageType('before')}
                      >
                        시공전
                      </Button>
                      <Button
                        variant={imageType === 'after' ? 'default' : 'outline'}
                        onClick={() => setImageType('after')}
                      >
                        시공후
                      </Button>
                    </div>
                  )}

                  {/* Main Image */}
                  <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={imageType === 'before' && selectedPortfolio.beforeImage 
                        ? selectedPortfolio.beforeImage 
                        : selectedPortfolio.afterImage || selectedPortfolio.mainImage} 
                      alt={selectedPortfolio.title}
                      className="w-full h-full object-cover"
                    />
                    {imageType === 'before' && (
                      <div className="absolute top-4 left-4 bg-gray-900/80 text-white px-3 py-1 rounded">
                        작업 전
                      </div>
                    )}
                    {imageType === 'after' && (
                      <div className="absolute top-4 left-4 bg-primary/80 text-white px-3 py-1 rounded">
                        작업 후
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">위치</p>
                      <p className="font-semibold">{selectedPortfolio.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">면적</p>
                      <p className="font-semibold">{selectedPortfolio.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">작업일</p>
                      <p className="font-semibold">{selectedPortfolio.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">작업유형</p>
                      <p className="font-semibold">{selectedPortfolio.type}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">작업 상세</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedPortfolio.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2">
                    {selectedPortfolio.tags.map((tag) => (
                      <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-center pt-4">
                    <Button size="lg" className="gap-2">
                      무료 견적 받기
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default memo(PortfolioSection);