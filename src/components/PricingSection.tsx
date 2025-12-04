import { Skeleton } from "@/components/ui/skeleton";
import { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Sparkles, AlertTriangle, Info, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingModal from "@/components/BookingModal";

const PricingSection = () => {
  const [category, setCategory]                 = useState([]); // 카테고리 목록
  const [pricingData, setPricingData]           = useState([]); // 전체 상품 데이터
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
  const [displayData, setDisplayData]           = useState([]); // 화면에 보여 줄 해당 카테고리의 상품 데이터

  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null); // 에러 메시지

  // 예약 모달 상태
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [selectedService, setSelectedService]   = useState<any>(null);

  // 상세보기 다이얼로그 상태
  const [isDetailOpen, setIsDetailOpen]         = useState(false);
  const [detailService, setDetailService]       = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 개발 환경에서는 프록시를 통해 API 호출, 프로덕션에서는 직접 호출
        const apiUrl = import.meta.env.DEV
          ? '/api/v1/category-products.do'
          : `${import.meta.env.VITE_API_URL}/api/v1/category-products.do`;

        const resp = await fetch(apiUrl, { method: 'GET' });

        // 응답 상태 확인
        if (!resp.ok) {
          if (resp.status === 502) {
            throw new Error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
          throw new Error(`서버 오류가 발생했습니다 (${resp.status}). 관리자에게 문의해주세요.`);
        }

        const data = await resp.json();

        setCategory(data?.categories);

        // includeArray 파싱해서 features 항목으로 추가
        const processedProducts = data?.products?.map((item) => {
          try {
            const includeArray = JSON.parse(item?.serviceIncludes || '[]');
            return {
              ...item,
              features: includeArray
            };

          } catch (error) {
            console.error('Error parsing serviceIncludes for item:', item, error);
            return {
              ...item,
              features: []
            };
          }
        });
        setPricingData(processedProducts);

      } catch (error) {
        console.error('Error fetching products:', error);
        const errorMessage = error instanceof Error
          ? error.message
          : '데이터를 불러오는 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.';
        setError(errorMessage);
        setCategory([]);
        setPricingData([]);
      } finally {
        // 초기 카테고리 설정 (항상 001로 시작)
        setSelectedCategory("001");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // selectedCategory가 변경될 때마다 해당하는 상품 데이터 배열을 displayData에 업데이트
  useEffect(() => {
    const filteredData = pricingData.filter(item => item.serviceCd === selectedCategory);
    setDisplayData(filteredData);
  }, [selectedCategory, pricingData]);

  // 숫자 세 자리마다 콤마(,) 추가
  const formatNumberComma = (value: number | string): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "";
    }
    const [integerPart, decimalPart]  = String(value).split('.');
    const formattedInteger            = Number(integerPart).toLocaleString('ko-KR');
    if (decimalPart) {
      return `${formattedInteger}.${decimalPart}`;
    }
    return formattedInteger;
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-background to-accent/5">
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

        <Tabs defaultValue="001" className="w-full mb-8">
          <TabsList className="flex flex-wrap justify-center w-full mx-auto gap-2 rounded-md bg-muted p-1">
            {category?.map((item, index) => (
              <TabsTrigger key={item?.serviceCd} value={item?.serviceCd} onClick={() => setSelectedCategory(item?.serviceCd)}>
                {item?.serviceNm}
              </TabsTrigger>
            ))
            }
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {error ? (
            <div className="col-span-full">
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-destructive mb-2">데이터 로드 실패</h3>
                      <p className="text-muted-foreground mb-4">{error}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                      >
                        새로고침
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full mt-6" />
                </CardContent>
              </Card>
            ))
          ) : displayData?.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <p className="text-lg">해당하는 서비스가 없습니다.</p>
            </div>
          ) : (
            displayData?.map((item, index) => (
              <motion.div
                key={item.productNo}
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
                    <CardTitle className="text-xl">{item.productNm}</CardTitle>
                    <CardDescription className="mt-2">{item.productDesc}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{formatNumberComma(item.salePrice)}원</span>
                        <span className="text-lg text-muted-foreground line-through">{formatNumberComma(item.originalPrice)}원</span>
                        {item?.saleYn === 'Y' && 
                        <Badge variant="destructive" className="ml-auto">
                          {item.discountRate}% 할인
                        </Badge>
                        }
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        소요시간: {item.serviceTime}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {item.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-gray-400 group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors duration-300" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                      variant="outline"
                      onClick={() => {
                        setSelectedService(item);
                        setIsModalOpen(true);
                      }}
                    >
                      예약하기
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
         
        </motion.div>
      </div>

      {/* 예약 모달 */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedService={selectedService}
      />

      {/* 상세보기 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailService && (
            <>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">닫기</span>
              </button>

              <DialogHeader>
                <DialogTitle className="text-2xl font-bold pr-8">
                  {detailService.productNm}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* 가격 정보 */}
                <div className="bg-primary/5 p-6 rounded-lg">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary">
                      {formatNumberComma(detailService.salePrice)}원
                    </span>
                    {detailService.saleYn === 'Y' && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatNumberComma(detailService.originalPrice)}원
                      </span>
                    )}
                  </div>
                  {detailService.saleYn === 'Y' && (
                    <Badge variant="destructive" className="text-base px-3 py-1">
                      {detailService.discountRate}% 특별 할인
                    </Badge>
                  )}
                </div>

                {/* 서비스 정보 */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">서비스 분류</p>
                    <p className="font-semibold">
                      {category.find(cat => cat.serviceCd === detailService.serviceCd)?.serviceNm}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">소요 시간</p>
                    <p className="font-semibold">{detailService.serviceTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">대상 면적/규모</p>
                    <p className="font-semibold">{detailService.areaType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">할인 상태</p>
                    <p className="font-semibold">
                      {detailService.saleYn === 'Y' ? '할인 중' : '정상가'}
                    </p>
                  </div>
                </div>

                {/* 서비스 설명 */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">서비스 설명</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {detailService.productDesc}
                  </p>
                </div>

                {/* 포함 서비스 */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">포함 서비스</h3>
                  <div className="space-y-2">
                    {detailService.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 닫기 버튼 */}
                <div className="flex justify-center pt-4 border-t">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    className="min-w-[120px]"
                  >
                    닫기
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default memo(PricingSection);
