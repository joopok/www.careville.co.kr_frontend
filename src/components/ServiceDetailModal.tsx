import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, Clock, Shield, CheckCircle, Loader2 } from "lucide-react";

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

// Mock 데이터 (API 실패 시 fallback)
const mockServiceData: Record<string, ServiceDetail> = {
  "에어컨 청소": {
    title: "에어컨 청소",
    description: "전문 장비와 친환경 세척제를 사용한 에어컨 완벽 분해 청소 서비스입니다. 내부 곰팡이, 먼지, 세균을 99.9% 제거하여 깨끗한 공기를 제공합니다.",
    benefits: ["냉난방 효율 20~30% 향상", "전기료 절감 효과", "곰팡이/세균 99.9% 제거", "악취 완벽 제거", "알레르기 예방"],
    process: ["사전 점검 및 오염도 진단", "외관 및 필터 분리", "열교환기/송풍팬 완전 분해", "고압 스팀 세척", "항균 코팅 및 조립"],
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800", "https://images.unsplash.com/photo-1631545308255-7feeb1ae8eb6?w=800"],
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
    images: ["https://images.unsplash.com/photo-1527515545081-5db817172677?w=800", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
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
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"],
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
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800", "https://images.unsplash.com/photo-1527515545081-5db817172677?w=800"],
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
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
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
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"],
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
    images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800"],
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
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
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
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800", "https://images.unsplash.com/photo-1631545308255-7feeb1ae8eb6?w=800"],
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
    images: ["https://images.unsplash.com/photo-1527515545081-5db817172677?w=800", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
    price: "별도협의",
    duration: "협의",
    rating: 4.9,
    reviewCount: 203
  }
};

// 기본 이미지 URL
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<ServiceDetail | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Mock 데이터에서 서비스 찾기 (부분 매칭)
  const findMockData = (title: string | null | undefined): ServiceDetail | null => {
    if (!title) return null;

    // 정확히 일치하는 경우
    if (mockServiceData[title]) {
      return mockServiceData[title];
    }

    // 부분 매칭 (에어컨, 입주, 이사 등 키워드 포함)
    const keywords = Object.keys(mockServiceData);
    for (const key of keywords) {
      if (title.includes(key) || key.includes(title)) {
        return mockServiceData[key];
      }
    }

    // 기본 mock 데이터 반환
    return {
      title: title || '서비스',
      description: '전문적이고 체계적인 케어빌의 프리미엄 청소 서비스입니다.',
      benefits: ['전문 기술진 서비스', '친환경 세척제 사용', '완벽한 사후 관리', '만족 보장'],
      process: ['사전 점검', '작업 준비', '본 작업 진행', '마무리 점검', '고객 확인'],
      images: [DEFAULT_IMAGE],
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

        // 이미지 URL 구성 (viewFileSeq1-3 사용)
        const imageUrls: string[] = [];

        // viewFileSeq1-3에서 이미지 추출 (URL 인코딩된 값)
        [data.viewFileSeq1, data.viewFileSeq2, data.viewFileSeq3]
          .forEach((viewFileSeq) => {
            if (viewFileSeq) {
              imageUrls.push(`${apiBase}/fileView.do?viewFileSeq=${viewFileSeq}`);
            }
          });

        // images 배열에서 추가 이미지
        if (data.images && data.images.length > 0) {
          data.images.forEach((img) => {
            if (img.fileSeq) {
              const url = `${apiBase}/fileView.do?viewFileSeq=${img.fileSeq}`;
              if (!imageUrls.includes(url)) {
                imageUrls.push(url);
              }
            }
          });
        }

        // 이미지가 없으면 기본 이미지 사용
        if (imageUrls.length === 0) {
          imageUrls.push(DEFAULT_IMAGE);
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
          images: imageUrls,
          price: priceDisplay,
          duration: data.serviceTime || '협의',
          rating: rating > 0 ? rating : 4.9,
          reviewCount: 328 // API에서 제공하지 않으므로 기본값
        });

      } catch (err) {
        console.error('상품 상세 조회 실패:', err);
        // API 실패 시 mock 데이터로 fallback
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
  }, [isOpen, productNo, serviceTitle]);

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
  }, [productNo]);

  const nextImage = () => {
    if (!serviceData) return;
    setCurrentImageIndex((prev) => (prev + 1) % serviceData.images.length);
  };

  const prevImage = () => {
    if (!serviceData) return;
    setCurrentImageIndex((prev) => (prev - 1 + serviceData.images.length) % serviceData.images.length);
  };

  // 이미지 에러 핸들러 - 서비스별 mock 이미지로 fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, imgSrc: string, index: number) => {
    const target = e.target as HTMLImageElement;

    // 이미 실패한 이미지는 추가 처리하지 않음
    if (failedImages.has(imgSrc)) return;

    setFailedImages(prev => new Set([...prev, imgSrc]));

    // 해당 서비스의 mock 데이터에서 fallback 이미지 가져오기
    const mockData = findMockData(serviceTitle);
    if (mockData && mockData.images[index]) {
      target.src = mockData.images[index];
    } else if (mockData && mockData.images[0]) {
      target.src = mockData.images[0];
    } else {
      target.src = DEFAULT_IMAGE;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.25 }
            }}
            className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500">상품 정보를 불러오는 중...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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
                      staggerChildren: 0.08,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                {/* Image Gallery Section */}
                <motion.div
                  className="relative bg-gray-100"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.3 } }
                  }}
                >
                  {/* Main Image */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                    <motion.img
                      key={currentImageIndex}
                      src={serviceData.images[currentImageIndex]}
                      alt={`${serviceData.title} 이미지 ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      onError={(e) => handleImageError(e, serviceData.images[currentImageIndex], currentImageIndex)}
                    />

                    {/* Navigation Arrows */}
                    {serviceData.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all shadow-lg"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {serviceData.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {serviceData.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {serviceData.images.map((img, index) => (
                        <motion.div
                          key={index}
                          className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            currentImageIndex === index
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          onMouseEnter={() => setHoveredImage(index)}
                          onMouseLeave={() => setHoveredImage(null)}
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={img}
                            alt={`썸네일 ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, img, index)}
                          />

                          {/* Hover Zoom Preview */}
                          <AnimatePresence>
                            {hoveredImage === index && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute -top-32 left-1/2 -translate-x-1/2 w-40 h-32 rounded-lg overflow-hidden shadow-xl border-2 border-white z-20 hidden sm:block"
                              >
                                <img
                                  src={img}
                                  alt={`확대 ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => handleImageError(e, img, index)}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Content Section */}
                <motion.div
                  className="p-6 sm:p-8"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
                  }}
                >
                  {/* Header */}
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                    }}
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {serviceData.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          소요시간: {serviceData.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {serviceData.rating.toFixed(1)} {serviceData.reviewCount && `(${serviceData.reviewCount})`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">시작가</p>
                      <p className="text-3xl font-bold text-primary">{serviceData.price}</p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  {serviceData.description && (
                    <motion.div
                      className="mb-8"
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                      }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        서비스 상세 설명
                      </h3>
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                          {serviceData.description}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Benefits & Process Grid */}
                  <motion.div
                    className="grid sm:grid-cols-2 gap-6"
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                    }}
                  >
                    {/* Benefits */}
                    {serviceData.benefits.length > 0 && (
                      <div className="bg-primary/5 rounded-2xl p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          서비스 효과
                        </h3>
                        <ul className="space-y-3">
                          {serviceData.benefits.map((benefit, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.06, duration: 0.25, ease: "easeOut" }}
                              className="flex items-start gap-3 text-sm text-gray-600"
                            >
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Process */}
                    {serviceData.process.length > 0 && (
                      <div className="bg-secondary/5 rounded-2xl p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-secondary" />
                          작업 과정
                        </h3>
                        <ol className="space-y-3">
                          {serviceData.process.map((step, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + index * 0.06, duration: 0.25, ease: "easeOut" }}
                              className="flex items-start gap-3 text-sm text-gray-600"
                            >
                              <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
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
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={onClose}
                      className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      닫기
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailModal;
