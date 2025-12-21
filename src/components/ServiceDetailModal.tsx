import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, Clock, Shield, CheckCircle } from "lucide-react";

interface ServiceDetail {
  id: string;
  serviceCd: string;
  title: string;
  description: string;
  benefits: string[];
  process: string[];
  images: string[];
  price: string;
  duration: string;
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

// 서비스 상세 데이터
const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "에어컨 분해 세척": {
    id: "aircon",
    serviceCd: "001",
    title: "에어컨 분해 세척",
    description: "에어컨 내부에는 먼지, 곰팡이, 세균이 축적되어 냉방 효율을 떨어뜨리고 건강에 해로운 공기를 배출합니다. 케어빌의 전문 분해 세척 서비스는 고압 세척기와 스팀 세척기를 활용하여 열교환기, 송풍팬, 드레인팬 등 모든 핵심 부품을 완벽하게 분해 후 세척합니다. 15년 경력의 전문 기술진이 삼성, LG 등 모든 브랜드의 벽걸이, 스탠드, 시스템 에어컨을 안전하게 분해하고 친환경 세척제로 곰팡이와 악취를 완벽히 제거합니다. 세척 후에는 항균 코팅을 적용하여 청결한 상태를 오래 유지할 수 있습니다.",
    benefits: [
      "냉난방 효율 20~30% 향상",
      "전기료 절감 효과",
      "곰팡이/세균 99.9% 제거",
      "악취 완벽 제거",
      "알레르기 예방"
    ],
    process: [
      "사전 점검 및 오염도 진단",
      "외관 및 필터 분리",
      "열교환기/송풍팬 완전 분해",
      "고압 스팀 세척",
      "항균 코팅 및 조립"
    ],
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631545806609-3c480b5cc14a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop"
    ],
    price: "8만원~",
    duration: "1~2시간"
  },
  "세탁기 분해 세척": {
    id: "washer",
    serviceCd: "002",
    title: "세탁기 분해 세척",
    description: "겉으로는 깨끗해 보이는 세탁기 내부에는 세제 찌꺼기, 섬유 보푸라기, 곰팡이가 숨어있어 빨래 후에도 퀴퀴한 냄새가 나고 피부 트러블을 유발할 수 있습니다. 케어빌은 드럼세탁기와 통돌이세탁기 모두 완전 분해하여 세탁조 안쪽의 숨겨진 오염을 철저히 제거합니다. 고무 패킹, 배수구, 세제통까지 모든 부품을 분해하여 고압 스팀으로 세척하고, 친환경 살균제로 세균과 곰팡이를 완벽히 박멸합니다. 세척 후에는 세탁물에서 상쾌한 향기가 나고 피부 건강도 지킬 수 있습니다.",
    benefits: [
      "퀴퀴한 빨래 냄새 제거",
      "곰팡이/세균 완벽 제거",
      "세탁 효율 향상",
      "피부 트러블 예방",
      "세탁기 수명 연장"
    ],
    process: [
      "세탁기 외관 분리",
      "세탁조 완전 분해",
      "고압 스팀 세척",
      "고무패킹/배수구 청소",
      "살균 처리 및 재조립"
    ],
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop"
    ],
    price: "10만원~",
    duration: "1~2시간"
  },
  "싱크대 상판 UV 코팅": {
    id: "uv-coating",
    serviceCd: "003",
    title: "싱크대 상판 UV 코팅",
    description: "오래된 싱크대 상판의 스크래치, 얼룩, 변색으로 고민이신가요? 케어빌의 UV 코팅 서비스는 인조대리석, 스테인리스 상판을 새것처럼 복원해 드립니다. 먼저 전문 연마 장비로 표면의 미세 스크래치와 얼룩을 제거한 후, 고품질 UV 코팅제를 도포하여 UV 램프로 경화시킵니다. 코팅 후에는 광택이 살아나고 오염 방지 효과로 청소가 쉬워지며, 변색과 세균 번식을 방지합니다. 상판 교체 비용의 1/10로 새 싱크대 같은 효과를 얻을 수 있어 경제적입니다.",
    benefits: [
      "스크래치/얼룩 완벽 제거",
      "고급스러운 광택 복원",
      "오염 방지 효과",
      "변색/세균 번식 방지",
      "상판 교체 대비 90% 비용 절감"
    ],
    process: [
      "상판 상태 진단",
      "연마 및 표면 정리",
      "UV 코팅제 도포",
      "UV 램프 경화",
      "최종 광택 마감"
    ],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&h=300&fit=crop"
    ],
    price: "15만원~",
    duration: "2~3시간"
  },
  "싱크대 상판 크랙 보수": {
    id: "crack-repair",
    serviceCd: "004",
    title: "싱크대 상판 크랙 보수",
    description: "싱크대 상판에 생긴 균열과 크랙은 보기에도 좋지 않을 뿐만 아니라 물이 스며들어 곰팡이가 생기고 위생 문제를 일으킵니다. 케어빌의 전문 보수 서비스는 인조대리석 상판의 크랙을 완벽하게 메꿔 원래 상태로 복원합니다. 크랙 부위를 정밀하게 연마한 후 전용 보수제로 메꿈 작업을 진행하고, 색상을 정확히 맞춰 자연스럽게 복원합니다. 마지막으로 방수 처리를 하여 물이 스며드는 것을 방지합니다. 상판 전체 교체 대비 70% 이상의 비용을 절감할 수 있습니다.",
    benefits: [
      "크랙/균열 완벽 복원",
      "색상 매칭으로 자연스러운 마감",
      "방수 처리로 물 침투 방지",
      "곰팡이 발생 예방",
      "교체 대비 70% 비용 절감"
    ],
    process: [
      "크랙 상태 정밀 진단",
      "균열 부위 연마",
      "전용 보수제 충진",
      "색상 매칭 작업",
      "방수 코팅 마감"
    ],
    images: [
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop"
    ],
    price: "10만원~",
    duration: "1~2시간"
  },
  "싱크대 상판 실리콘 교체": {
    id: "silicone",
    serviceCd: "005",
    title: "싱크대 상판 실리콘 교체",
    description: "싱크대 주변의 실리콘은 시간이 지나면 노후화되어 갈라지고 곰팡이가 생겨 보기 흉하고 위생적으로도 문제가 됩니다. 특히 물이 자주 닿는 싱크대 주변은 곰팡이가 번식하기 좋은 환경입니다. 케어빌은 기존의 오래된 실리콘을 깔끔하게 제거한 후, 방수/방곰팡이 기능의 프리미엄 바이오 실리콘으로 새로 시공합니다. 전문 도구로 균일하게 마감하여 깔끔한 외관을 완성하고, 항균 실리콘으로 곰팡이 재발을 방지합니다. 정기적인 실리콘 교체로 주방을 항상 청결하게 유지하세요.",
    benefits: [
      "곰팡이 완벽 제거",
      "방수/방곰팡이 실리콘 적용",
      "깔끔한 마감 처리",
      "위생적인 주방 환경",
      "곰팡이 재발 방지"
    ],
    process: [
      "기존 실리콘 제거",
      "표면 청소 및 건조",
      "마스킹 테이프 부착",
      "바이오 실리콘 도포",
      "마감 처리 및 건조"
    ],
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556909114-a1e8d2e9e6e4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop"
    ],
    price: "5만원~",
    duration: "30분~1시간"
  },
  // 사업장 클리닝 서비스
  "시스템 에어컨 분해 세척": {
    id: "system-aircon",
    serviceCd: "006",
    title: "시스템 에어컨 분해 세척",
    description: "사무실, 상가, 병원, 학원 등 사업장에 설치된 천장형(4way), 덕트형, 카세트형 시스템 에어컨은 일반 가정용보다 더 많은 먼지와 오염물이 축적됩니다. 케어빌의 전문 기술진은 삼성, LG, 캐리어 등 모든 브랜드의 시스템 에어컨을 완벽하게 분해하여 열교환기, 드레인팬, 송풍팬, 필터 등 모든 부품을 고압 스팀으로 세척합니다. 영업 시간 외 야간/주말 작업도 가능하며, 세척 후 냉난방 효율이 30% 이상 향상되어 전기료 절감 효과를 얻을 수 있습니다.",
    benefits: [
      "냉난방 효율 30% 이상 향상",
      "전기료 대폭 절감",
      "곰팡이/세균 99.9% 제거",
      "쾌적한 실내 공기질 확보",
      "에어컨 수명 연장"
    ],
    process: [
      "현장 방문 및 상태 진단",
      "외관 커버 및 필터 분리",
      "열교환기/송풍팬 완전 분해",
      "고압 스팀 세척 및 살균",
      "항균 코팅 및 재조립"
    ],
    images: [
      "https://images.unsplash.com/photo-1635048424329-a9bfb146d7aa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631545806609-3c480b5cc14a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
    ],
    price: "15만원~",
    duration: "2~3시간"
  },
  "사무실 청소": {
    id: "office-cleaning",
    serviceCd: "007",
    title: "사무실 청소",
    description: "쾌적한 업무 환경은 직원들의 생산성과 건강에 직접적인 영향을 미칩니다. 케어빌의 사무실 청소 서비스는 데스크, 회의실, 휴게실, 화장실 등 모든 공간을 체계적으로 관리합니다. 먼지 제거, 바닥 청소, 유리창 관리, 카펫 청소는 물론 공용 공간의 위생 관리까지 원스톱으로 제공합니다. 정기 계약 시 전담 매니저가 배정되어 일관된 품질의 청소 서비스를 제공하며, 업무 시간 외 청소도 가능합니다.",
    benefits: [
      "직원 생산성 향상",
      "청결한 업무 환경 유지",
      "방문객에게 좋은 인상",
      "세균/바이러스 감염 예방",
      "전담 매니저 배정"
    ],
    process: [
      "청소 범위 및 요구사항 파악",
      "맞춤형 청소 계획 수립",
      "체계적인 구역별 청소",
      "품질 점검 및 피드백",
      "정기 청소 스케줄 관리"
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&fit=crop"
    ],
    price: "협의",
    duration: "규모에 따라 상이"
  },
  "상가 청소": {
    id: "store-cleaning",
    serviceCd: "008",
    title: "상가 청소",
    description: "깨끗한 매장은 고객에게 신뢰감을 주고 매출 향상에 기여합니다. 케어빌의 상가 청소 서비스는 음식점, 카페, 소매점, 헬스장 등 다양한 업종의 상가를 전문적으로 관리합니다. 바닥 청소 및 광택, 유리창 관리, 간판 청소, 주방 후드 청소까지 상가 운영에 필요한 모든 청소 서비스를 제공합니다. 영업 전후 청소로 고객에게 항상 깨끗한 매장을 보여드릴 수 있습니다.",
    benefits: [
      "고객 신뢰도 향상",
      "위생 관리 철저",
      "매출 향상 기여",
      "영업 전후 청소 가능",
      "업종별 맞춤 청소"
    ],
    process: [
      "매장 현황 파악",
      "업종별 청소 계획 수립",
      "바닥/유리/시설물 청소",
      "주방/화장실 위생 관리",
      "최종 점검 및 확인"
    ],
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop"
    ],
    price: "협의",
    duration: "규모에 따라 상이"
  },
  "입주 청소": {
    id: "move-in-cleaning",
    serviceCd: "009",
    title: "입주 청소",
    description: "새로운 공간에서의 시작은 깨끗함에서 시작됩니다. 케어빌의 입주 청소 서비스는 이사 전후의 아파트, 빌라, 오피스텔, 상가 등 모든 공간을 새것처럼 만들어 드립니다. 건축 먼지, 스티커 자국, 창문 얼룩은 물론 주방과 욕실의 숨겨진 오염까지 완벽하게 제거합니다. 바닥 청소, 유리창 닦기, 붙박이장 내부 청소, 베란다 청소까지 꼼꼼하게 진행하여 쾌적한 새 출발을 도와드립니다.",
    benefits: [
      "새집처럼 깨끗한 공간",
      "건축 먼지 완벽 제거",
      "주방/욕실 집중 청소",
      "모든 공간 구석구석 청소",
      "빠른 입주 준비 완료"
    ],
    process: [
      "청소 범위 현장 확인",
      "먼지 및 오염 상태 점검",
      "전체 공간 먼지 제거",
      "주방/욕실/창문 집중 청소",
      "바닥 청소 및 최종 점검"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    price: "평당 1만원~",
    duration: "3~5시간"
  }
};

const ServiceDetailModal = ({ isOpen, onClose, serviceId }: ServiceDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const service = serviceId ? SERVICE_DETAILS[serviceId] : null;

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
  }, [serviceId]);

  if (!service) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
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
            className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

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
                    src={service.images[currentImageIndex]}
                    alt={`${service.title} 이미지 ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />

                  {/* Navigation Arrows */}
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

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {service.images.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {service.images.map((img, index) => (
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
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
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
                      {service.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        소요시간: {service.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        4.9 (328)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">시작가</p>
                    <p className="text-3xl font-bold text-primary">{service.price}</p>
                  </div>
                </motion.div>

                {/* Description */}
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
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                </motion.div>

                {/* Benefits & Process Grid */}
                <motion.div
                  className="grid sm:grid-cols-2 gap-6"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                  }}
                >
                  {/* Benefits */}
                  <div className="bg-primary/5 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      서비스 효과
                    </h3>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit, index) => (
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

                  {/* Process */}
                  <div className="bg-secondary/5 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary" />
                      작업 과정
                    </h3>
                    <ol className="space-y-3">
                      {service.process.map((step, index) => (
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
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailModal;
