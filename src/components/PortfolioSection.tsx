import { useState, memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Eye,
  ChevronRight,
  X,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

// 백엔드 API 응답 타입
interface CaseItem {
  caseSeq: number;
  serviceCd: string | null;
  serviceNm: string | null;
  caseSj: string;
  caseCn: string;
  regNm?: string;
  fileSeq?: number;
  viewFileSeq: string;   // 시공전 이미지
  viewFileSeq2: string;  // 시공후 이미지
  areaType?: string;     // 면적
  hashtag: string;
  rgsDt: string;
}

// Props 타입
interface PortfolioSectionProps {
  portfolioList: CaseItem[];
  loading: boolean;
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

// 면적 추출 함수 (내용에서 "XX평" 패턴 찾기)
const extractArea = (content: string): string => {
  if (!content) return "";
  const match = content.match(/(\d+)\s*평/);
  return match ? `${match[1]}평` : "";
};

// 백엔드 데이터를 프론트 Portfolio로 변환
const convertCaseToPortfolio = (caseItem: CaseItem): Portfolio => {
  // serviceCd가 null일 수 있으므로 null 체크 추가
  const category = caseItem.serviceCd
    ? (SERVICE_CODE_MAP[caseItem.serviceCd] || "special")
    : "special";
  const tags = caseItem.hashtag ? caseItem.hashtag.split(',').map(tag => tag.trim().replace(/^#/, '')) : [];

  const defaultImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";
  const apiUrl = import.meta.env.VITE_API_URL;

  // 시공전 이미지 (viewFileSeq)
  const beforeImageUrl = caseItem.viewFileSeq
    ? `${apiUrl}/fileView.do?viewFileSeq=${caseItem.viewFileSeq}`
    : defaultImage;

  // 시공후 이미지 (viewFileSeq2)
  const afterImageUrl = caseItem.viewFileSeq2
    ? `${apiUrl}/fileView.do?viewFileSeq=${caseItem.viewFileSeq2}`
    : defaultImage;

  // 면적: areaType 필드 사용 (없으면 caseCn에서 추출)
  const area = caseItem.areaType || extractArea(caseItem.caseCn);

  return {
    id: caseItem.caseSeq,
    category,
    title: caseItem.caseSj,
    location: "서울시", // 백엔드에 location 필드 없음
    date: caseItem.rgsDt,
    area,
    type: caseItem.serviceNm || "특수청소", // null일 경우 기본값
    mainImage: afterImageUrl,   // 목록: 시공후 이미지
    beforeImage: beforeImageUrl, // 상세: 시공전
    afterImage: afterImageUrl,   // 상세: 시공후
    description: (caseItem.caseCn || '').replace(/<[^>]*>/g, '').substring(0, 100), // HTML 태그 제거 후 100자 (null 가드 추가)
    tags
  };
};

const PortfolioSection = ({ portfolioList, loading }: PortfolioSectionProps) => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [imageType, setImageType] = useState<'before' | 'after'>('before');
  const [visibleCount, setVisibleCount] = useState(6); // 처음에 6개 표시

  // props로 받은 데이터를 Portfolio 형태로 변환 (useMemo로 최적화)
  const portfolios = useMemo(() => {
    return portfolioList.map(convertCaseToPortfolio);
  }, [portfolioList]);

  // 더보기 핸들러 - 클라이언트 사이드 (6개씩 추가 표시)
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, portfolios.length));
  };

  // 현재 보이는 포트폴리오 (6개씩 표시: 6 → 12 → 18 → 24)
  const visiblePortfolios = portfolios.slice(0, visibleCount);
  const hasMore = visibleCount < portfolios.length;

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
                    onClick={() => { setImageType('before'); setSelectedPortfolio(portfolio); }}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={portfolio.mainImage}
                    alt={portfolio.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";
                    }}
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{portfolio.location}</span>
                    <span>{portfolio.date}</span>
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
        {!loading && hasMore && visiblePortfolios.length > 0 && (
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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";
                      }}
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
                      <p className="font-semibold">{selectedPortfolio.location || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">면적</p>
                      <p className="font-semibold">{selectedPortfolio.area || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">작업일</p>
                      <p className="font-semibold">{selectedPortfolio.date || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">작업유형</p>
                      <p className="font-semibold">{selectedPortfolio.type || "-"}</p>
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

                  {/* Close Button */}
                  <div className="flex justify-center pt-4">
                    <Button size="lg" variant="outline" onClick={() => setSelectedPortfolio(null)}>
                      닫기
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
