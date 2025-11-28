import { Card } from "@/components/ui/card";
import { Star, Quote, ThumbsUp, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, memo, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import './ReviewsSection.css';

const ReviewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const swiperRef = useRef<SwiperType>(null); 
  const [reviews, setReviews] = useState([
    {
      serviceNm: "",
      reviewSeq: "",
      svcDate: "",
      dispYn: "",
      serviceCd: "",
      starRate: 0,
      reviewNm: "",      
      rgsDt: "",
      reviewCn: "",
            
    },
  ]);
  
  const [serviceCdList, setserviceCdList] = useState([{
    serviceCd: "",  serviceNm: ""
  }]);

  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/all`,{
           method: 'GET',
           headers: {
            'Content-Type': 'application/json'
           }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }        
        
        const data = await response.json();
        
        setserviceCdList(data.serviceCdList);         
           
        setReviews(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  const [newReview, setNewReview] = useState({
    reviewSeq: "",
    reviewNm: "",
    serviceCd: "",
    starRate: 0, // Set initial to 0 to force user selection
    reviewCn: "",
    svcDate:"",
    pw:""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    reviewNm: "",
    serviceNm: "",
    serviceCd:"",
    reviewCn: "",
    starRate: "",
    svcDate: "",
    pw:""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const NumInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "pw") {
      const onlyNumberMax8 = /^\d{0,8}$/;
      if (!onlyNumberMax8.test(value)) {
        setErrors(prev => ({ ...prev, [name]: "숫자만 입력 가능하며 최대 8자리까지 가능합니다." }));
        return;
      }
    }
    setNewReview(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleServiceChange = (value: string) => {
    setNewReview(prev => ({ ...prev, serviceCd: value }));
    if (errors.serviceCd) {
      setErrors(prev => ({ ...prev, serviceCd: "" }));
    }
  };

  const dateHandleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;     
    setNewReview(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };  

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, starRate: rating }));
    if (errors.starRate) {
      setErrors(prev => ({ ...prev, starRate: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  
   
    const newErrors = {
      reviewNm: newReview.reviewNm.trim() === "" ? "이름을 입력해주세요." : "",
      serviceNm: newReview.serviceCd.trim() === "" ? "서비스를 선택해주세요." : "",
      serviceCd: newReview.serviceCd.trim() === "" ? "서비스를 선택해주세요." : "",
      reviewCn: newReview.reviewCn.trim() === "" ? "내용을 입력해주세요." : "",
      starRate: newReview.starRate === 0 ? "별점을 선택해주세요." : "",
      svcDate: newReview.svcDate === "" ? "서비스 날짜를 선택해주세요." : "",
      pw: newReview.pw === "" || newReview.pw.length< 4 ? "비밀번호를 4자 이상 입력해주세요." : "",
    };

    if (Object.values(newErrors).some(error => error !== "")) {
      setErrors(newErrors);
      return;
    }
 
    setErrors({ reviewNm: "", serviceNm: "", reviewCn: "", starRate: "" ,svcDate:"", serviceCd:"", pw:""});
    setIsSubmitting(true);
    //날짜 하이픈 제거
    newReview.svcDate = newReview.svcDate.replace(/-/g, "");    

      console.log((newReview));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      //저장이 되면 저장된 신규 데이터 받아서 가져오기
      //const savedReview = await response.json();           
      //setReviews(prev => [savedReview, ...prev]);
      const name = categories.find(c => c.id === newReview.serviceCd)?.name ?? "알 수 없음";
      const today = new Date();
      const formatted = today.toISOString().split('T')[0];
      
      setReviews(prev => [{
        serviceNm: name, reviewSeq: "", svcDate: "", dispYn: "", serviceCd: newReview.serviceCd, reviewNm: newReview.reviewNm,
         rgsDt: formatted, reviewCn: newReview.reviewCn, starRate: newReview.starRate},
          ...prev]);
      setNewReview({ reviewSeq: "", reviewNm: "", serviceCd: "", starRate: 0, reviewCn: "", svcDate: "", pw:"" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      // Here you could show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: "all", name: "전체", count: reviews.length },
    { id: "001", name: "에어컨 케어 및 세척", count: reviews.filter(r => r.serviceCd === "001").length },
    { id: "002", name: "설치/교체 서비스", count: reviews.filter(r => r.serviceCd === "002").length },
    { id: "003", name: "상가/사무실 시공", count: reviews.filter(r => r.serviceCd === "003").length },
    { id: "004", name: "메트리스 청소(케어)", count: reviews.filter(r => r.serviceCd === "004").length },
    { id: "005", name: "세탁키 케어", count: reviews.filter(r => r.serviceCd === "005").length },
    { id: "006", name: "욕실 전문 시공", count: reviews.filter(r => r.serviceCd === "006").length },
    { id: "007", name: "환풍기 설치", count: reviews.filter(r => r.serviceCd === "007").length },
    { id: "008", name: "프리미엄 주방케어", count: reviews.filter(r => r.serviceCd === "008").length }
  ];
  const filteredReviews = selectedCategory === "all" 
    ? reviews 
    : reviews.filter(r => r.serviceCd === selectedCategory); 
  
    

  const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (        
    <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 bg-white">      
      <div className="flex items-start gap-4" onClick={() => {setNewReview({ reviewSeq: review.reviewSeq, reviewNm: review.reviewNm, serviceCd: review.serviceCd, starRate: review.starRate, reviewCn: review.reviewCn, svcDate: "2025-05-05", pw:"" }); review.reviewSeq; setIsDialogOpen(true)}}>
        <Quote className="h-8 w-8 text-primary/20 flex-shrink-0" />
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg review-title">{review.reviewNm}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="review-service">{review.serviceNm}</span>
                <span>•</span>
                <span className="whitespace-nowrap">{review.rgsDt}</span>
              </div>
            </div>
            <div className="flex gap-0.5 flex-shrink-0 ml-2">
              {[...Array(review.starRate)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed review-content">
            {review.reviewCn}
          </p>    
        </div>
      </div>
    </Card>
  );

  if (isLoadingReviews) {
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
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-full review-card p-6 bg-white">
                <div className="flex items-start gap-4 flex-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !reviews || reviews.length === 0 || (reviews.length === 1 && !reviews[0].reviewSeq)) {
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
          <div className="text-center py-24 border-2 border-dashed rounded-lg bg-gray-50/50">
            <p className="text-xl text-muted-foreground">등록된 리뷰가 없습니다.</p>
            <p className="text-muted-foreground mt-2">
              {error ? '데이터를 불러오는 중 오류가 발생했습니다.' : '첫 번째 후기를 작성해주세요.'}
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-6">후기 작성하기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>후기 작성</DialogTitle>
                <DialogDescription>
                  케어빌 서비스에 대한 솔직한 후기를 남겨주세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reviewNm" className="text-right">
                      이름
                    </Label>
                    <div className="col-span-3">
                      <Input id="reviewNm" name="reviewNm" value={newReview.reviewNm} onChange={handleInputChange} className={errors.reviewNm ? 'border-red-500' : ''} />
                      {errors.reviewNm && <p className="text-red-500 text-xs mt-1">{errors.reviewNm}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reviewNm" className="text-right">
                      비밀번호
                    </Label>
                    <div className="col-span-3">
                      <Input id="pw" name="pw" value={newReview.pw} onChange={NumInputChange} className={errors.pw ? 'border-red-500' : ''} />
                      {errors.pw && <p className="text-red-500 text-xs mt-1">{errors.pw}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="serviceCd" className="text-right">
                      서비스
                    </Label>
                    <div className="col-span-3">
                      <Select onValueChange={handleServiceChange} value={newReview.serviceCd}>
                        <SelectTrigger className={errors.serviceCd ? 'border-red-500' : ''}>
                          <SelectValue placeholder="서비스를 선택하세요" />
                        </SelectTrigger>
                          <SelectContent>
                          {serviceCdList.map((service) => (
                            <SelectItem key={service.serviceCd} value={service.serviceCd}>
                              {service.serviceNm}
                            </SelectItem>
                          ))}
                          </SelectContent>                  

                      </Select>
                      {errors.serviceCd && <p className="text-red-500 text-xs mt-1">{errors.serviceCd}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="svcDate" className="text-right">
                      서비스 날짜
                    </Label>
                    <div className="col-span-3">
                    <Input id="svcDate" name="svcDate" type="date" value={newReview.svcDate} onChange={dateHandleInputChange} />
                    {errors.svcDate && <p className="text-red-500 text-xs mt-1">{errors.svcDate}</p>}                     
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reviewCn" className="text-right">
                      내용
                    </Label>
                    <div className="col-span-3">
                      <Textarea id="reviewCn" name="reviewCn" value={newReview.reviewCn} onChange={handleInputChange} className={errors.reviewCn ? 'border-red-500' : ''} />
                      {errors.reviewCn && <p className="text-red-500 text-xs mt-1">{errors.reviewCn}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      별점
                    </Label>
                    <div className="col-span-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${newReview.starRate >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            onClick={() => handleRatingChange(star)}
                          />
                        ))}
                      </div>
                      {errors.starRate && <p className="text-red-500 text-xs mt-1">{errors.starRate}</p>}
                    </div>
                  </div>

                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '제출 중...' : '제출하기'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </section>
    );
  }

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
          <Dialog open={isDialogOpen} onOpenChange={(open) => {              
              setIsDialogOpen(open);              
              if (!open) {
                // 다이얼로그 닫힐 때 초기화  
                setNewReview({reviewSeq: "",  reviewNm: "", serviceCd: "", starRate: 0, reviewCn: "", svcDate: "", pw:"" }); 
                setErrors({ reviewNm: "", serviceNm: "", reviewCn: "", starRate: "" ,svcDate:"", serviceCd:"", pw:""});
              }
            }}>
            <DialogTrigger asChild>
              <Button className="mt-4">후기 작성하기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>후기 작성</DialogTitle>
                <DialogDescription>
                  케어빌 서비스에 대한 솔직한 후기를 남겨주세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">          
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reviewNm" className="text-right">                      
                      이름
                    </Label>
                    <div className="col-span-3">
                      <Input id="reviewNm" name="reviewNm" value={newReview.reviewNm} onChange={handleInputChange} className={errors.reviewNm ? 'border-red-500' : ''} />
                      {errors.reviewNm && <p className="text-red-500 text-xs mt-1">{errors.reviewNm}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reviewNm" className="text-right">
                      비밀번호
                    </Label>
                    <div className="col-span-3">
                      <Input id="pw" name="pw" value={newReview.pw} type="password" onChange={NumInputChange} className={errors.pw ? 'border-red-500' : ''} />
                      {errors.pw && <p className="text-red-500 text-xs mt-1">{errors.pw}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="serviceCd" className="text-right">
                      서비스
                    </Label>
                    <div className="col-span-3">
                      <Select onValueChange={handleServiceChange} value={newReview.serviceCd}>
                        <SelectTrigger className={errors.serviceCd ? 'border-red-500' : ''}>
                          <SelectValue placeholder="서비스를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceCdList.map((service) => (
                            <SelectItem key={service.serviceCd} value={service.serviceCd}>
                              {service.serviceNm}
                            </SelectItem>
                          ))}
                          </SelectContent>    
                      </Select>
                      {errors.serviceCd && <p className="text-red-500 text-xs mt-1">{errors.serviceCd}</p>}
                    </div>             
                  </div>
                         
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="svcDate" className="text-right">
                      서비스 날짜
                    </Label>
                    <div className="col-span-3">
                    <Input id="svcDate" name="svcDate" type="date" value={newReview.svcDate} onChange={dateHandleInputChange} />
                    {errors.svcDate && <p className="text-red-500 text-xs mt-1">{errors.svcDate}</p>}                     
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reviewCn" className="text-right">
                      내용
                    </Label>
                    <div className="col-span-3">
                      <Textarea id="reviewCn" name="reviewCn" value={newReview.reviewCn} onChange={handleInputChange} className={errors.reviewCn ? 'border-red-500' : ''} />
                      {errors.reviewCn && <p className="text-red-500 text-xs mt-1">{errors.reviewCn}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      별점
                    </Label>
                    <div className="col-span-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${newReview.starRate >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            onClick={() => handleRatingChange(star)}
                          />
                        ))}
                      </div>
                      {errors.starRate && <p className="text-red-500 text-xs mt-1">{errors.starRate}</p>}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '제출 중...' : '제출하기'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
            className="absolute left-0 top-[50%] -translate-y-[50%] -translate-x-6 md:-translate-x-14 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-[50%] -translate-y-[50%] translate-x-6 md:translate-x-14 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Grid, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            grid={{
              rows: 2,
              fill: 'row'
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
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
            className="reviews-swiper"
          >
            {filteredReviews.map((review) => (
              <SwiperSlide key={review.reviewSeq}>
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


