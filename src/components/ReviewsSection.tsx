import { Card } from "@/components/ui/card";
import { Star, Quote, MessageSquare, ChevronLeft, ChevronRight, Trash2, Edit3 } from "lucide-react";
import { useState, useRef, memo, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import './ReviewsSection.css';

type Review = {
  serviceNm: string;
  reviewSeq: string;
  svcDate: string;
  dispYn: string;
  serviceCd: string;
  starRate: number;
  reviewNm: string;
  rgsDt: string;
  reviewCn: string;
};

type ServiceCdItem = { serviceCd: string; serviceNm: string };

interface ReviewsSectionProps {
  reviewList: Review[];
  serviceCdList: ServiceCdItem[];
  loading: boolean;
}

// props가 전달되지 않아도 안전하게 동작하도록 기본값과 내부 fetch 폴백을 제공
const ReviewsSection = (props: Partial<ReviewsSectionProps> = {}) => {
  const { reviewList, serviceCdList, loading } = props;
  const swiperRef = useRef<SwiperType>(null);
  const [reviews, setReviews] = useState<Review[]>(reviewList ?? []);
  const [svcList, setSvcList] = useState<ServiceCdItem[]>(serviceCdList ?? []);
  const [internalLoading, setInternalLoading] = useState<boolean>(loading ?? false);
  const isLoadingReviews = loading ?? internalLoading;

  // 외부에서 리스트가 주어지면 해당 값으로 동기화
  useEffect(() => {
    if (reviewList) setReviews(reviewList);
  }, [reviewList]);

  useEffect(() => {
    if (serviceCdList) setSvcList(serviceCdList);
  }, [serviceCdList]);

  // 공용 유틸: URL 합성 및 요청 전송 (JSON 우선, 403/415 시 폼으로 폴백)
  const getApiBase = () => import.meta.env.VITE_API_URL || '';
  const isAbsoluteUrl = (u: string) => /^https?:\/\//i.test(u);
  const resolveUrl = (path: string) => (isAbsoluteUrl(path) ? path : `${getApiBase()}${path}`);

  const REVIEW_LIST_PATH = import.meta.env.VITE_REVIEW_LIST_PATH ?? '/api/reviews/all';
  const REVIEW_CREATE_PATH = import.meta.env.VITE_REVIEW_CREATE_PATH ?? '/api/reviews';
  const REVIEW_UPDATE_PATH = (id: string) => {
    const p = import.meta.env.VITE_REVIEW_UPDATE_PATH;
    return p ? p.replace(':id', id) : `/api/reviews/${id}`;
  };
  const REVIEW_DELETE_PATH = (id: string) => {
    const p = import.meta.env.VITE_REVIEW_DELETE_PATH;
    return p ? p.replace(':id', id) : `/api/reviews/${id}/delete`;
  };

  const sendRequest = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', data?: Record<string, unknown>) => {
    // 1차: JSON 요청
    let resp = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    // 일부 서버가 JSON/메서드를 제한하는 경우 폼 방식으로 재시도
    if (!resp.ok && (resp.status === 403 || resp.status === 415 || resp.status === 405)) {
      const form = new URLSearchParams();
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([k, v]) => form.set(k, String(v ?? '')));
      }
      resp = await fetch(url, {
        method: method === 'PUT' || method === 'PATCH' ? 'POST' : method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: data ? form.toString() : undefined,
      });
    }
    return resp;
  };

  // props가 없을 때 내부에서 데이터 로드 (개발 프록시/운영 API 모두 대응)
  useEffect(() => {
    if (reviewList !== undefined && serviceCdList !== undefined) return; // 외부 제공 시 스킵
    let aborted = false;
    const fetchReviews = async () => {
      try {
        setInternalLoading(true);
        const url = resolveUrl(REVIEW_LIST_PATH);
        const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
        if (!resp.ok) throw new Error('Failed to fetch reviews');
        const data: { serviceCdList: ServiceCdItem[]; data: Review[] } = await resp.json();
        if (aborted) return;
        setSvcList(data.serviceCdList || []);
        setReviews(data.data || []);
      } catch (e) {
        if (aborted) return;
        console.error('리뷰 조회 실패:', e);
        setSvcList([]);
        setReviews([]);
      } finally {
        if (!aborted) setInternalLoading(false);
      }
    };
    fetchReviews();
    return () => { aborted = true; };
  }, [reviewList, serviceCdList]);

  const [newReview, setNewReview] = useState<{
    reviewSeq: string;
    reviewNm: string;
    serviceCd: string;
    starRate: number;
    reviewCn: string;
    svcDate: string;
    pw: string;
  }>({
    reviewSeq: "",
    reviewNm: "",
    serviceCd: "",
    starRate: 0, // Set initial to 0 to force user selection
    reviewCn: "",
    svcDate:"",
    pw:""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);  // 수정 모드 구분
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);  // 삭제 확인 다이얼로그
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);  // 삭제 대상 리뷰
  const [deletePassword, setDeletePassword] = useState("");  // 삭제용 비밀번호
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
      pw: newReview.pw === "" || newReview.pw.length < 4 ? "비밀번호를 4자 이상 입력해주세요." : "",
    };

    if (Object.values(newErrors).some(error => error !== "")) {
      setErrors(newErrors);
      return;
    }

    setErrors({ reviewNm: "", serviceNm: "", reviewCn: "", starRate: "" ,svcDate:"", serviceCd:"", pw:""});
    setIsSubmitting(true);

    // 날짜 하이픈 제거 (불변성 유지)
    const submitData = {
      ...newReview,
      svcDate: newReview.svcDate.replace(/-/g, "")
    };

    try {
      // 수정 모드인 경우 (reviewSeq가 있고 isEditMode가 true)
      if (isEditMode && newReview.reviewSeq) {
        const url = resolveUrl(REVIEW_UPDATE_PATH(newReview.reviewSeq));
        const response = await sendRequest(url, 'POST', submitData as unknown as Record<string, unknown>);
        let result: Record<string, unknown> = {};
        try { result = await response.json(); } catch { /* non-JSON 응답 무시 */ }

        if (result.success) {
          toast.success("리뷰가 수정되었습니다.");
          // 수정된 리뷰로 목록 업데이트
          const serviceName = categories.find(c => c.id === newReview.serviceCd)?.name ?? "알 수 없음";
          setReviews(prev => prev.map(r =>
            r.reviewSeq === newReview.reviewSeq
              ? { ...r, reviewNm: newReview.reviewNm, serviceCd: newReview.serviceCd, serviceNm: serviceName, starRate: newReview.starRate, reviewCn: newReview.reviewCn }
              : r
          ));
          setNewReview({ reviewSeq: "", reviewNm: "", serviceCd: "", starRate: 0, reviewCn: "", svcDate: "", pw:"" });
          setIsDialogOpen(false);
          setIsEditMode(false);
        } else if (result.requirePassword || result.passwordValid === false) {
          setErrors(prev => ({ ...prev, pw: (result.message as string) || "비밀번호가 일치하지 않습니다." }));
        } else {
          throw new Error((result.message as string) || '리뷰 수정에 실패했습니다.');
        }
      } else {
        // 신규 등록
        const url = resolveUrl(REVIEW_CREATE_PATH);
        const response = await sendRequest(url, 'POST', submitData as unknown as Record<string, unknown>);
        if (!response.ok) throw new Error('Failed to submit review');
        let result: Record<string, unknown> = {};
        try { result = await response.json(); } catch { /* non-JSON 응답 무시 */ }

        if (result.success) {
          toast.success("리뷰가 등록되었습니다.");
          const name = categories.find(c => c.id === newReview.serviceCd)?.name ?? "알 수 없음";
          const today = new Date();
          const formatted = today.toISOString().split('T')[0];

          // 서버에서 반환된 reviewSeq 사용 (없으면 임시 ID)
          const newReviewSeq = (result.reviewSeq as string) || `temp-${Date.now()}`;

          setReviews(prev => [{
            serviceNm: name,
            reviewSeq: newReviewSeq,
            svcDate: newReview.svcDate,
            dispYn: "Y",
            serviceCd: newReview.serviceCd,
            reviewNm: newReview.reviewNm,
            rgsDt: formatted,
            reviewCn: newReview.reviewCn,
            starRate: newReview.starRate
          }, ...prev]);
          setNewReview({ reviewSeq: "", reviewNm: "", serviceCd: "", starRate: 0, reviewCn: "", svcDate: "", pw:"" });
          setIsDialogOpen(false);
        } else {
          throw new Error((result.message as string) || '리뷰 등록에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "리뷰 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 확인 다이얼로그 열기
  const openDeleteDialog = (review: Review, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(review);
    setDeletePassword("");
    setIsDeleteDialogOpen(true);
  };

  // 리뷰 삭제 처리
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const url = resolveUrl(REVIEW_DELETE_PATH(deleteTarget.reviewSeq));
      const response = await sendRequest(url, 'POST', { pw: deletePassword });
      let result: Record<string, unknown> = {};
      try { result = await response.json(); } catch { /* non-JSON 응답 무시 */ }

      if (result.success) {
        toast.success("리뷰가 삭제되었습니다.");
        setReviews(prev => prev.filter(r => r.reviewSeq !== deleteTarget.reviewSeq));
        setIsDeleteDialogOpen(false);
        setDeleteTarget(null);
        setDeletePassword("");
      } else if (result.requirePassword || result.passwordValid === false) {
        toast.error((result.message as string) || "비밀번호가 일치하지 않습니다.");
      } else {
        throw new Error((result.message as string) || '리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  const categories = [
    { id: "all", name: "전체", count: reviews.length },
    ...svcList
      .filter(service => service.serviceCd && service.serviceNm)
      .map(service => ({
        id: service.serviceCd,
        name: service.serviceNm,
        count: reviews.filter(r => r.serviceCd === service.serviceCd).length
      }))
  ]; 
  
    

  // 수정 다이얼로그 열기
  const openEditDialog = (review: Review) => {
    // svcDate 포맷 변환 (YYYYMMDD → YYYY-MM-DD)
    let formattedDate = review.svcDate || "";
    if (formattedDate && formattedDate.length === 8 && !formattedDate.includes('-')) {
      formattedDate = `${formattedDate.slice(0, 4)}-${formattedDate.slice(4, 6)}-${formattedDate.slice(6, 8)}`;
    }

    setNewReview({
      reviewSeq: review.reviewSeq,
      reviewNm: review.reviewNm,
      serviceCd: review.serviceCd,
      starRate: review.starRate,
      reviewCn: review.reviewCn,
      svcDate: formattedDate,
      pw: ""
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="review-card p-6 hover:shadow-lg transition-all duration-300 bg-white group">
      <div className="flex items-start gap-2">
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
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <div className="flex gap-0.5">
                {[...Array(review.starRate)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {/* 수정/삭제 버튼 - 호버 시 표시 */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditDialog(review)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                  title="수정"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => openDeleteDialog(review, e)}
                  className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
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

  if (!reviews || reviews.length === 0 || (reviews.length === 1 && !reviews[0].reviewSeq)) {
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
              첫 번째 후기를 작성해주세요.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-6">후기 작성하기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "후기 수정" : "후기 작성"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "후기 내용을 수정하려면 비밀번호를 입력해주세요." : "케어빌 서비스에 대한 솔직한 후기를 남겨주세요."}
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
                          {svcList.map((service) => (
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
                    {isSubmitting ? '처리 중...' : (isEditMode ? '수정하기' : '작성하기')}
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
                setIsEditMode(false);
              }
            }}>
            <DialogTrigger asChild>
              <Button className="mt-4">후기 작성하기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "후기 수정" : "후기 작성"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "후기 내용을 수정하려면 비밀번호를 입력해주세요." : "케어빌 서비스에 대한 솔직한 후기를 남겨주세요."}
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
                          {svcList.map((service) => (
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
                    {isSubmitting ? '처리 중...' : (isEditMode ? '수정하기' : '작성하기')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
            aria-label="이전 후기"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
            aria-label="다음 후기"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-primary transition-colors" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Grid]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={false}
            grid={{
              rows: 2,
              fill: 'row'
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
                grid: {
                  rows: 2,
                  fill: 'row'
                }
              }
            }}
            className="reviews-swiper mx-auto"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.reviewSeq || `review-${Math.random()}`}>
                <div className="pb-2 w-full">
                  <ReviewCard review={review} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>후기 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 후기를 삭제하시겠습니까? 삭제된 후기는 복구할 수 없습니다.
              <br />삭제하려면 작성 시 입력한 비밀번호를 입력해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="deletePassword" className="text-sm font-medium">
              비밀번호
            </Label>
            <Input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeletePassword("");
              setDeleteTarget(null);
            }}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={!deletePassword}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default memo(ReviewsSection);
