import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: {
    productNo: string;
    productNm: string;
    salePrice: number;
    serviceTime: string;
  } | null;
}

const BookingModal = ({ isOpen, onClose, selectedService }: BookingModalProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    timeSlot: "",
    additionalRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSlotChange = (value: string) => {
    setFormData(prev => ({ ...prev, timeSlot: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "이름을 입력해주세요",
        description: "예약자 성함을 입력해주세요."
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        variant: "destructive",
        title: "연락처를 입력해주세요",
        description: "연락 가능한 전화번호를 입력해주세요."
      });
      return false;
    }

    // 전화번호 형식 검증 (간단한 검증)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        variant: "destructive",
        title: "올바른 전화번호를 입력해주세요",
        description: "숫자와 하이픈(-)만 입력 가능합니다."
      });
      return false;
    }

    if (!date) {
      toast({
        variant: "destructive",
        title: "날짜를 선택해주세요",
        description: "예약 희망 날짜를 선택해주세요."
      });
      return false;
    }

    if (!formData.timeSlot) {
      toast({
        variant: "destructive",
        title: "시간대를 선택해주세요",
        description: "예약 희망 시간대를 선택해주세요."
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // 제출 데이터 구성
    const bookingData = {
      service: selectedService ? {
        productNo: selectedService.productNo,
        productNm: selectedService.productNm,
        salePrice: selectedService.salePrice,
        serviceTime: selectedService.serviceTime
      } : null,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null
      },
      booking: {
        date: date ? format(date, "yyyy-MM-dd") : null,
        timeSlot: formData.timeSlot,
        additionalRequests: formData.additionalRequests || null
      },
      createdAt: new Date().toISOString()
    };

    try {
      // API 연동: 실제 백엔드 API 호출
      const apiUrl = import.meta.env.DEV
        ? '/api/v1/booking'
        : `${import.meta.env.VITE_API_URL}/api/v1/booking`;

      // API 요청 데이터 구성
      const requestData = {
        productNo: selectedService?.productNo,
        productNm: selectedService?.productNm || "일반 문의",
        salePrice: selectedService?.salePrice || 0,
        serviceTime: selectedService?.serviceTime || "",
        customerName: bookingData.customer.name,
        customerPhone: bookingData.customer.phone,
        customerEmail: bookingData.customer.email,
        bookingDate: date ? format(date, "yyyyMMdd") : "",
        timeSlot: bookingData.booking.timeSlot,
        additionalRequests: bookingData.booking.additionalRequests
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "예약 신청이 완료되었습니다! ✨",
          description: `담당자가 확인 후 연락드리겠습니다. (예약번호: ${result.bookingSeq || '처리중'})`,
          className: "bg-primary text-white"
        });
      } else {
        throw new Error(result.message || "예약 처리 중 오류가 발생했습니다.");
      }

      // 폼 초기화
      setFormData({
        name: "",
        phone: "",
        email: "",
        timeSlot: "",
        additionalRequests: ""
      });
      setDate(undefined);

      // 모달 닫기
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {
      console.error("예약 신청 오류:", error);
      const errorMessage = error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.";
      toast({
        variant: "destructive",
        title: "예약 신청 실패",
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumberComma = (value: number): string => {
    return Number(value).toLocaleString('ko-KR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            서비스 예약
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 선택된 서비스 정보 */}
          {selectedService && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{selectedService.productNm}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedService.serviceTime}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white">
                    {formatNumberComma(selectedService.salePrice)}원
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 고객 정보 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              고객 정보
            </h4>

            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                name="name"
                placeholder="예약자 성함을 입력하세요"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">연락처 *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 (선택)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 예약 정보 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              예약 정보
            </h4>

            <div className="space-y-2">
              <Label>희망 날짜 *</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ko}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                />
              </div>
              {date && (
                <p className="text-sm text-muted-foreground text-center">
                  선택된 날짜: {format(date, "PPP", { locale: ko })}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">희망 시간대 *</Label>
              <Select value={formData.timeSlot} onValueChange={handleTimeSlotChange}>
                <SelectTrigger>
                  <SelectValue placeholder="시간대를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 추가 요청사항 */}
          <div className="space-y-2">
            <Label htmlFor="additionalRequests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              추가 요청사항 (선택)
            </Label>
            <Textarea
              id="additionalRequests"
              name="additionalRequests"
              placeholder="특별히 요청하실 사항이 있으시면 입력해주세요"
              value={formData.additionalRequests}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "처리 중..." : "예약 신청하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
