import { Skeleton } from "@/components/ui/skeleton";
import { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PricingSection = () => {
  const [category, setCategory]                 = useState([]); // 카테고리 목록
  const [pricingData, setPricingData]           = useState([]); // 전체 상품 데이터
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
  const [displayData, setDisplayData]           = useState([]); // 화면에 보여 줄 해당 카테고리의 상품 데이터

  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/category-products.do`, { method: 'GET' });
        const data = await resp.json();

        setCategory(data?.categories);

        // includeArray 파싱해서 features 항목으로 추가
        const processedProducts = data?.products?.map((item) => {
          try {
            const includeArray = JSON.parse(item?.serviceIncludes || '[]');
            console.log('includeArray', includeArray);
            return {
              ...item,
              features: includeArray
            };

          } catch (error) {
            console.error('Error parsing serviceIncludes for item:', item, error); // TODO: Integrate with a proper logging system
            return {
              ...item,
              features: []
            };
          }
        });
        setPricingData(processedProducts);
        
      } catch (error) {
        console.error('Error fetching products:', error);
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
          {loading ? (
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

                    <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300" variant="outline">
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
