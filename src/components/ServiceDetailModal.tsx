import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, Clock, Shield, CheckCircle, Loader2, ZoomIn, ImageOff } from "lucide-react";
import { useScreenSize, getModalDimensions } from "@/hooks/use-screen-size";

// 최대 이미지 개수 제한
const MAX_IMAGES = 7;

// 서버 API 응답 타입
interface ProductData {
  productNo: number;
  serviceCd: string;
  serviceNm: string;
  productNm: string;
  productDesc: string;
  fileSeq1: number | null;
  fileSeq2: number | null;
  fileSeq3: number | null;
  fileSeq4: number | null;
  fileSeq5: number | null;
  fileSeq6: number | null;
  viewFileSeq1: string | null;
  viewFileSeq2: string | null;
  viewFileSeq3: string | null;
  viewFileSeq4: string | null;
  viewFileSeq5: string | null;
  viewFileSeq6: string | null;
  areaType: string | null;
  originalPrice: number | null;
  salePrice: number | null;
  discountRate: number | null;
  serviceTime: string | null;
  serviceIncludes: string | null;
  features: string | null;
  serviceEffects: string | null;
  workProcess: string | null;
  serviceEffectsList: string[];
  workProcessList: string[];
  displayYn: string;
  saleYn: string;
  popularYn: string;
  avgRating: number | null;
  avgRatingFormatted: string | null;
  images: {
    fileSeq: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    imageUrl: string;
  }[];
}

interface ProductDetailResponse {
  success: boolean;
  product: ProductData;
}

interface ServiceDetail {
  title: string;
  description: string;
  benefits: string[];
  process: string[];
  images: string[];
  price: string;
  duration: string;
  rating: number;
  reviewCount?: number;
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productNo: number | null;
  serviceTitle?: string | null;
  serviceCd?: string | null;
}

// Mock 데이터 (API 실패 시 fallback) - 이미지 없음
const mockServiceData: Record<string, ServiceDetail> = {
  "에어컨 청소": {
    title: "에어컨 청소",
    description: "전문 장비와 친환경 세척제를 사용한 에어컨 완벽 분해 청소 서비스입니다. 내부 곰팡이, 먼지, 세균을 99.9% 제거하여 깨끗한 공기를 제공합니다.",
    benefits: ["냉난방 효율 20~30% 향상", "전기료 절감 효과", "곰팡이/세균 99.9% 제거", "악취 완벽 제거", "알레르기 예방"],
    process: ["사전 점검 및 오염도 진단", "외관 및 필터 분리", "열교환기/송풍팬 완전 분해", "고압 스팀 세척", "항균 코팅 및 조립"],
    images: [],
    price: "8만원~",
    duration: "1~2시간",
    rating: 4.9,
    reviewCount: 328
  },
  "입주청소": {
    title: "입주청소",
    description: "새 집으로 이사하기 전 완벽한 청소 서비스입니다. 건설 먼지, 접착제 자국, 시멘트 얼룩 등을 깔끔하게 제거합니다.",
    benefits: ["건설 먼지 완벽 제거", "접착제·스티커 자국 제거", "새집 냄새 제거", "입주 전 살균 소독"],
    process: ["현장 사전 점검", "창호·유리 청소", "바닥 청소 및 코팅", "욕실·주방 청소", "마무리 점검"],
    images: [],
    price: "15만원~",
    duration: "4~8시간",
    rating: 4.8,
    reviewCount: 256
  },
  "이사청소": {
    title: "이사청소",
    description: "이사 전후 집을 깨끗하게 정리해드립니다. 기존 거주 흔적을 완벽히 제거하고 새 입주자를 위한 청결한 환경을 만듭니다.",
    benefits: ["묵은 때 완벽 제거", "얼룩·자국 전문 처리", "수납공간 정리 청소", "퇴실 점검 대비"],
    process: ["가구 이동 후 청소", "전체 바닥 청소", "욕실·주방 집중 청소", "창문·방충망 청소", "최종 점검"],
    images: [],
    price: "12만원~",
    duration: "3~6시간",
    rating: 4.8,
    reviewCount: 189
  },
  "정기청소": {
    title: "정기청소",
    description: "주기적인 청소로 항상 깨끗한 생활 환경을 유지합니다. 주 1회, 격주, 월 1회 등 원하는 주기로 이용 가능합니다.",
    benefits: ["정기적 위생 관리", "시간 절약", "일정한 청결 유지", "맞춤형 서비스"],
    process: ["정해진 일정 방문", "기본 청소 진행", "요청 사항 처리", "결과 확인 및 피드백"],
    images: [],
    price: "8만원~",
    duration: "2~3시간",
    rating: 4.9,
    reviewCount: 412
  },
  "매트리스 케어": {
    title: "매트리스 케어",
    description: "매트리스 깊숙이 박힌 먼지, 진드기, 세균을 전문 장비로 완벽하게 제거합니다. 건강한 수면 환경을 위한 필수 서비스입니다.",
    benefits: ["집먼지 진드기 99% 제거", "알레르기 원인 제거", "수면 환경 개선", "매트리스 수명 연장"],
    process: ["상태 점검", "표면 진공 청소", "UV 살균 처리", "스팀 클리닝", "건조 및 마무리"],
    images: [],
    price: "5만원~",
    duration: "1시간",
    rating: 4.9,
    reviewCount: 287
  },
  "사무실 청소": {
    title: "사무실 청소",
    description: "쾌적한 업무 환경을 위한 전문 사무실 청소 서비스입니다. 정기 계약 시 할인 혜택을 제공합니다.",
    benefits: ["업무 효율 향상", "직원 건강 관리", "방문객 인상 개선", "체계적 관리"],
    process: ["사무 공간 청소", "화장실 청소", "휴게실 청소", "유리창 청소", "쓰레기 수거"],
    images: [],
    price: "별도협의",
    duration: "협의",
    rating: 4.8,
    reviewCount: 156
  },
  "상가 청소": {
    title: "상가 청소",
    description: "매장, 상가의 청결을 책임집니다. 고객에게 좋은 인상을 주는 깨끗한 매장 환경을 만들어 드립니다.",
    benefits: ["매장 이미지 향상", "고객 만족도 증가", "위생 관리", "매출 증대 효과"],
    process: ["매장 현황 파악", "바닥 청소", "진열대 청소", "유리면 청소", "최종 점검"],
    images: [],
    price: "별도협의",
    duration: "협의",
    rating: 4.7,
    reviewCount: 98
  },
  "건물 청소": {
    title: "건물 청소",
    description: "아파트, 오피스텔, 상가 건물 등 대형 건물 전문 청소 서비스입니다. 공용 공간부터 외부까지 완벽하게 관리합니다.",
    benefits: ["건물 가치 유지", "입주자 만족도", "체계적 관리", "비용 효율적"],
    process: ["공용부 청소", "계단/복도 청소", "주차장 청소", "외부 청소", "정기 점검"],
    images: [],
    price: "별도협의",
    duration: "협의",
    rating: 4.8,
    reviewCount: 124
  },
  "시스템 에어컨 분해 세척": {
    title: "시스템 에어컨 분해 세척",
    description: "천장형, 덕트형 시스템 에어컨 전문 세척 서비스입니다. 사업장 에어컨의 청결과 효율을 책임집니다.",
    benefits: ["냉난방 효율 향상", "전기료 절감", "공기질 개선", "장비 수명 연장"],
    process: ["사전 점검", "송풍구 분리", "열교환기 세척", "덕트 청소", "항균 처리"],
    images: [],
    price: "별도협의",
    duration: "협의",
    rating: 4.8,
    reviewCount: 89
  },
  "입주 청소": {
    title: "입주 청소",
    description: "새로운 공간에서의 시작을 깨끗함에서 시작합니다. 이사 전후 완벽한 청소 서비스를 제공합니다.",
    benefits: ["건축 먼지 제거", "스티커 자국 제거", "주방/욕실 완벽 세척", "바닥 광택"],
    process: ["전체 먼지 제거", "바닥 청소", "주방 청소", "욕실 청소", "최종 점검"],
    images: [],
    price: "별도협의",
    duration: "협의",
    rating: 4.9,
    reviewCount: 203
  }
};

// 가격 포맷팅
const formatPrice = (price: number | null): string => {
  if (!price || price === 0) return "견적문의";
  const manWon = Math.floor(price / 10000);
  return `${manWon}만원~`;
};

// JSON 파싱 헬퍼
const parseJsonField = (jsonString: string | null): string[] => {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const ServiceDetailModal = ({ isOpen, onClose, productNo, serviceTitle, serviceCd }: ServiceDetailModalProps) => {
  const screenSize = useScreenSize();
  const modalDimensions = useMemo(() => getModalDimensions(screenSize), [screenSize]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<ServiceDetail | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Mock 데이터에서 서비스 찾기 (부분 매칭) - 이미지 제외
  const findMockData = (title: string | null | undefined): ServiceDetail | null => {
    if (!title) return null;

    // 정확히 일치하는 경우
    if (mockServiceData[title]) {
      return { ...mockServiceData[title], images: [] };
    }

    // 부분 매칭 (에어컨, 입주, 이사 등 키워드 포함)
    const keywords = Object.keys(mockServiceData);
    for (const key of keywords) {
      if (title.includes(key) || key.includes(title)) {
        return { ...mockServiceData[key], images: [] };
      }
    }

    // 기본 mock 데이터 반환 - 이미지 없음
    return {
      title: title || '서비스',
      description: '전문적이고 체계적인 케어빌의 프리미엄 청소 서비스입니다.',
      benefits: ['전문 기술진 서비스', '친환경 세척제 사용', '완벽한 사후 관리', '만족 보장'],
      process: ['사전 점검', '작업 준비', '본 작업 진행', '마무리 점검', '고객 확인'],
      images: [],
      price: '견적문의',
      duration: '협의',
      rating: 4.8,
      reviewCount: 150
    };
  };

  // API에서 상품 상세 정보 조회
  useEffect(() => {
    if (!isOpen) {
      setServiceData(null);
      setError(null);
      setFailedImages(new Set());
      return;
    }

    // productNo가 없으면 mock 데이터 사용
    if (!productNo) {
      const mockData = findMockData(serviceTitle);
      if (mockData) {
        setServiceData(mockData);
        setLoading(false);
        setError(null);
      }
      return;
    }

    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiBase = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiBase}/api/v1/products/${productNo}`);

        if (!response.ok) {
          throw new Error('상품 정보를 불러올 수 없습니다.');
        }

        const result: ProductDetailResponse = await response.json();
        const data = result.product;

        if (!data) {
          throw new Error('상품 정보가 없습니다.');
        }

        // 이미지 URL 구성 - API에서 등록된 이미지만 수집 (최대 7개)
        const imageUrls: string[] = [];

        // viewFileSeq1-6에서 이미지 추출 (우선 사용)
        [
          data.viewFileSeq1,
          data.viewFileSeq2,
          data.viewFileSeq3,
          data.viewFileSeq4,
          data.viewFileSeq5,
          data.viewFileSeq6
        ].forEach((viewFileSeq) => {
          if (viewFileSeq && imageUrls.length < MAX_IMAGES) {
            const url = `${apiBase}/fileView.do?viewFileSeq=${viewFileSeq}`;
            if (!imageUrls.includes(url)) {
              imageUrls.push(url);
            }
          }
        });

        // images 배열에서 추가 이미지 (viewFileSeq가 없는 경우 대비)
        if (data.images && data.images.length > 0) {
          data.images.forEach((img) => {
            if (img.fileSeq && imageUrls.length < MAX_IMAGES) {
              const url = `${apiBase}/fileView.do?viewFileSeq=${img.fileSeq}`;
              if (!imageUrls.includes(url)) {
                imageUrls.push(url);
              }
            }
          });
        }

        // 서비스 효과 - serviceEffectsList 우선, 없으면 JSON 파싱
        const benefits = data.serviceEffectsList && data.serviceEffectsList.length > 0
          ? data.serviceEffectsList
          : parseJsonField(data.serviceEffects);

        // 작업 과정 - workProcessList 우선, 없으면 JSON 파싱
        const process = data.workProcessList && data.workProcessList.length > 0
          ? data.workProcessList
          : parseJsonField(data.workProcess);

        // 평점 파싱
        const rating = data.avgRatingFormatted
          ? parseFloat(data.avgRatingFormatted)
          : (data.avgRating || 4.9);

        // 사업장 클리닝(002)은 항상 "별도협의"로 표시
        const priceDisplay = serviceCd === "002" || data.serviceCd === "002"
          ? "별도협의"
          : formatPrice(data.salePrice);

        setServiceData({
          title: data.productNm || '서비스',
          description: data.productDesc || '',
          benefits: benefits.length > 0 ? benefits : ['전문 기술진 서비스', '친환경 세척제 사용', '완벽한 사후 관리'],
          process: process.length > 0 ? process : ['사전 점검', '작업 진행', '최종 확인'],
          images: imageUrls, // API 이미지만 사용
          price: priceDisplay,
          duration: data.serviceTime || '협의',
          rating: rating > 0 ? rating : 4.9,
          reviewCount: 328
        });

      } catch (err) {
        console.error('상품 상세 조회 실패:', err);
        // API 실패 시 mock 데이터로 fallback (이미지 없음)
        const mockData = findMockData(serviceTitle);
        if (mockData) {
          setServiceData(mockData);
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : '상품 정보를 불러올 수 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [isOpen, productNo, serviceTitle, serviceCd]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageZoomed(false);
  }, [productNo]);

  // 유효한 이미지만 필터링 (실패한 이미지 제외)
  const validImages = useMemo(() => {
    if (!serviceData) return [];
    return serviceData.images.filter((_, index) => !failedImages.has(index));
  }, [serviceData, failedImages]);

  const nextImage = () => {
    if (validImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    if (validImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // 이미지 에러 핸들러 - 실패한 이미지 숨김 처리
  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set([...prev, index]));
    // 현재 보고 있는 이미지가 실패하면 다음 이미지로 이동
    if (currentImageIndex === index && validImages.length > 1) {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : 0);
    }
  };

  // 썸네일 크기 계산 (한 줄에 맞게)
  const getThumbnailSize = () => {
    if (screenSize.isMobile) return 'w-16 h-16';
    if (screenSize.isTablet) return 'w-20 h-20';
    return 'w-24 h-24';
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ padding: screenSize.isMobile ? '0.5rem' : '1.5rem' }}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          {/* Modal Content - 해상도 반응형 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative bg-white shadow-2xl overflow-hidden"
            style={{
              width: '100%',
              maxWidth: modalDimensions.maxWidth,
              maxHeight: modalDimensions.maxHeight,
              borderRadius: screenSize.isMobile ? '1rem' : '1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Absolute position within modal */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-xl border border-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Custom scrollbar wrapper */}
            <div
              className="overflow-y-auto overflow-x-hidden custom-scrollbar"
              style={{ maxHeight: modalDimensions.maxHeight }}
            >

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                    <Loader2 className="absolute inset-0 w-16 h-16 text-primary animate-spin" />
                  </div>
                  <p className="text-gray-500 mt-6 text-lg">상품 정보를 불러오는 중...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-500 mb-6 text-lg">{error}</p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
                  >
                    닫기
                  </button>
                </div>
              )}

              {/* Content */}
              {serviceData && !loading && !error && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.06,
                        delayChildren: 0.1
                      }
                    }
                  }}
                >
                  {/* Image Gallery Section */}
                  <motion.div
                    className="relative bg-gradient-to-b from-gray-100 to-gray-50"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.4 } }
                    }}
                  >
                    {/* Main Image or No Image Placeholder */}
                    {validImages.length > 0 ? (
                      <div
                        className="relative overflow-hidden cursor-pointer group"
                        style={{
                          aspectRatio: screenSize.isMobile ? '4/3' : screenSize.isTablet ? '16/10' : '21/9',
                        }}
                        onClick={() => setIsImageZoomed(!isImageZoomed)}
                      >
                        <motion.img
                          key={currentImageIndex}
                          src={validImages[currentImageIndex]}
                          alt={`${serviceData.title} 이미지 ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500"
                          style={{
                            transform: isImageZoomed ? 'scale(1.5)' : 'scale(1)',
                          }}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          onError={() => handleImageError(serviceData.images.indexOf(validImages[currentImageIndex]))}
                        />

                        {/* Zoom indicator */}
                        <div className="absolute bottom-4 right-4 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-4 h-4" />
                          {isImageZoomed ? '축소하기' : '확대하기'}
                        </div>

                        {/* Navigation Arrows */}
                        {validImages.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); prevImage(); }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); nextImage(); }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}

                        {/* Image Counter Badge */}
                        <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                          {currentImageIndex + 1} / {validImages.length}
                        </div>
                      </div>
                    ) : (
                      /* No Image Placeholder */
                      <div
                        className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                        style={{
                          aspectRatio: screenSize.isMobile ? '4/3' : screenSize.isTablet ? '16/10' : '21/9',
                        }}
                      >
                        <div className="w-20 h-20 bg-gray-300/50 rounded-2xl flex items-center justify-center mb-4">
                          <ImageOff className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">등록된 이미지가 없습니다</p>
                        <p className="text-gray-400 text-sm mt-1">서비스 상세 정보를 확인해주세요</p>
                      </div>
                    )}

                    {/* Thumbnail Gallery - 한 줄 가로 스크롤 */}
                    {validImages.length > 1 && (
                      <div
                        className="bg-white border-t border-gray-100"
                        style={{ padding: modalDimensions.padding }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-600">
                            이미지 ({validImages.length}개)
                          </span>
                          {validImages.length > (screenSize.isMobile ? 4 : 6) && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <ChevronLeft className="w-3 h-3" />
                              스크롤하여 더보기
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {/* 한 줄 가로 스크롤 컨테이너 */}
                        <div className="relative">
                          <div
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                            style={{
                              scrollSnapType: 'x mandatory',
                              WebkitOverflowScrolling: 'touch',
                            }}
                          >
                            {validImages.map((img, index) => (
                              <motion.button
                                key={index}
                                className={`relative flex-shrink-0 ${getThumbnailSize()} rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                  currentImageIndex === index
                                    ? 'border-primary ring-2 ring-primary/30 shadow-lg scale-105'
                                    : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                                }`}
                                style={{ scrollSnapAlign: 'start' }}
                                onClick={() => setCurrentImageIndex(index)}
                                whileHover={{ scale: currentImageIndex === index ? 1.05 : 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                <img
                                  src={img}
                                  alt={`썸네일 ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(serviceData.images.indexOf(img))}
                                />
                                {currentImageIndex === index && (
                                  <motion.div
                                    className="absolute inset-0 bg-primary/15"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  />
                                )}
                                {/* 이미지 번호 */}
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                                  <span className="text-[10px] text-white font-bold">{index + 1}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>

                          {/* 스크롤 페이드 인디케이터 */}
                          {validImages.length > (screenSize.isMobile ? 4 : 6) && (
                            <>
                              <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Content Section */}
                  <motion.div
                    style={{ padding: modalDimensions.padding }}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                  >
                    {/* Header */}
                    <motion.div
                      className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100"
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                            {serviceData.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-gray-500" />
                              {serviceData.duration}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-full text-sm text-yellow-700">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {serviceData.rating.toFixed(1)}
                              {serviceData.reviewCount && (
                                <span className="text-yellow-600/70">({serviceData.reviewCount})</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-sm text-gray-400 mb-1">시작가</p>
                          <p className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">{serviceData.price}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Description */}
                    {serviceData.description && (
                      <motion.div
                        className="mb-8"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                        }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-primary" />
                          </div>
                          서비스 상세 설명
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 sm:p-6 border border-gray-100">
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                            {serviceData.description}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Benefits & Process Grid */}
                    <motion.div
                      className={`grid gap-6 ${screenSize.isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'}`}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                      }}
                    >
                      {/* Benefits */}
                      {serviceData.benefits.length > 0 && (
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 sm:p-6 border border-primary/10">
                          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Star className="w-4 h-4 text-primary" />
                            </div>
                            서비스 효과
                          </h3>
                          <ul className="space-y-3">
                            {serviceData.benefits.map((benefit, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05, duration: 0.3, ease: "easeOut" }}
                                className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
                              >
                                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>{benefit}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Process */}
                      {serviceData.process.length > 0 && (
                        <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-5 sm:p-6 border border-secondary/10">
                          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                            <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                              <Clock className="w-4 h-4 text-secondary" />
                            </div>
                            작업 과정
                          </h3>
                          <ol className="space-y-3">
                            {serviceData.process.map((step, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 + index * 0.05, duration: 0.3, ease: "easeOut" }}
                                className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
                              >
                                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                                  {index + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </motion.li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </motion.div>

                    {/* Close Button */}
                    <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                      <button
                        onClick={onClose}
                        className="px-10 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all hover:shadow-md active:scale-98"
                      >
                        닫기
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailModal;
