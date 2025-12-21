import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const phoneRegex = /^[0-9-]{10,13}$/;

const formSchema = z.object({
  nm: z.string().trim().min(1, "고객명을 입력해주세요."),
  tel1: z.string().trim().min(10, "연락처1을 입력해주세요.").regex(phoneRegex, "연락처 형식이 올바르지 않습니다."),
  tel2: z.string().trim().optional().refine((v) => !v || phoneRegex.test(v), { message: "연락처 형식이 올바르지 않습니다." }),
  adres1: z.string().trim().min(1, "주소1을 입력해주세요."),
  adres2: z.string().trim().optional(),
  zip: z.string().trim().optional(),
  svcCnCd: z.string().min(1, "서비스 내용을 선택해주세요."),
  hopeDay: z.string().min(1, "희망일자를 선택해주세요.").refine((v) => {
    if (!v) return false;
    const today = new Date();
    const target = new Date(v);
    // Normalize to date-only comparison
    today.setHours(0,0,0,0);
    return target >= today;
  }, { message: "희망일자는 오늘 이후 날짜를 선택해주세요." }),
  inqryCn: z.string().trim().min(1, "상담 내용을 입력해주세요."),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const serviceOptions = [
    { label: "에어컨 케어 및 세척", value: "001" },
    { label: "설치/교체 서비스", value: "002" },
    { label: "상가/사무실 시공", value: "003" },
    { label: "메트리스 청소(케어)", value: "004" },
    { label: "세탁키 케어", value: "005" },
    { label: "욕실 전문 시공", value: "006" },
    { label: "환풍기 설치", value: "007" },
    { label: "프리미엄 주방케어", value: "008" },
    { label: "특수청소", value: "009" },
    { label: "주방상판", value: "010" },
    { label: "층간소음매트", value: "011" },
  ];

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nm: "",
      tel1: "",
      tel2: "",
      adres1: "",
      adres2: "",
      zip: "",
      svcCnCd: "",
      hopeDay: "",
      inqryCn: "",
    },
  });

  const { setValue } = form;

  // 전화번호 자동 하이픈 포맷터
  const formatPhone = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7,11)}`;
  };

  const handlePhoneChange = (field: 'tel1' | 'tel2') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(field, formatPhone(e.target.value), { shouldValidate: true, shouldTouch: true });
  };

  // 간단 주소 검색 UI
  const [isAddrSearchOpen, setIsAddrSearchOpen] = useState(false);
  const [addrZip, setAddrZip] = useState("");
  const [addrBase, setAddrBase] = useState("");
  const applyAddress = () => {
    if (addrBase.trim()) {
      setValue('zip', addrZip.trim());
      setValue('adres1', addrBase.trim(), { shouldValidate: true });
      setIsAddrSearchOpen(false);
    }
  };

  // 다음 우편번호 API 타입
  interface DaumPostcodeData {
    roadAddress?: string;
    jibunAddress?: string;
    zonecode?: string;
  }

  interface DaumPostcode {
    new (options: {
      oncomplete: (data: DaumPostcodeData) => void;
      width: string;
      height: string;
    }): { embed: (container: HTMLElement) => void };
  }

  interface DaumWindow {
    daum?: { Postcode?: DaumPostcode };
  }

  // 카카오/다음 우편번호 서비스 연동
  const ensureDaumPostcodeScript = () => new Promise<void>((resolve, reject) => {
    const w = window as unknown as DaumWindow;
    if (w.daum && w.daum.Postcode) return resolve();
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('daum postcode script load failed'));
    document.body.appendChild(script);
  });

  const openDaumPostcode = async () => {
    setIsAddrSearchOpen(true);
    try {
      await ensureDaumPostcodeScript();
      const w = window as unknown as DaumWindow;
      const container = document.getElementById('daum-postcode-container');
      if (!container || !w.daum?.Postcode) return;
      new w.daum.Postcode({
        oncomplete: (data: DaumPostcodeData) => {
          const road = data.roadAddress?.trim();
          const jibun = data.jibunAddress?.trim();
          const addr = road || jibun || '';
          const zone = data.zonecode || '';
          if (addr) setValue('adres1', addr, { shouldValidate: true });
          if (zone) setValue('zip', zone);
          setIsAddrSearchOpen(false);
        },
        width: '100%',
        height: '360px'
      }).embed(container);
    } catch (e) {
      // 스크립트 로드 실패 시 기존 간이 입력 UI 사용
      console.warn('Daum postcode unavailable, fallback to manual input');
      setIsAddrSearchOpen(true);
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    // API URL
    const baseUrl = `${import.meta.env.VITE_API_URL}/cnsltReg.do`;

    const dataToSend = { ...values };

    // Remove hyphens from hopeDay
    if (dataToSend.hopeDay) {
      dataToSend.hopeDay = dataToSend.hopeDay.replace(/-/g, "");
    }

    const formData = new URLSearchParams();
    for (const key in dataToSend) {
      formData.append(key, dataToSend[key as keyof ContactFormValues] || "");
    }

    const finalUrl = `${baseUrl}?${formData.toString()}`;

    console.log("Sending POST request to:", finalUrl);

    try {
      const response = await fetch(finalUrl, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 안전한 응답 처리 (JSON 또는 텍스트)
      const contentType = response.headers.get('content-type');
      let result: Record<string, unknown> = {};

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // JSON이 아닌 경우 성공으로 간주
        toast.success("상담 신청이 성공적으로 접수되었습니다.");
        form.reset();
        onClose();
        return;
      }

      if (result.isError === "false" || result.isError === false) {
        toast.success("상담 신청이 성공적으로 접수되었습니다.");
        form.reset();
        onClose();
      } else if (result.isError === "true" || result.isError === true) {
        toast.error(
          `상담 신청 실패: ${
            result.excpMsg || result.excpCdMsg || "알 수 없는 오류"
          }`
        );
        console.error("Submission error:", result);
      } else {
        // isError 필드가 없는 경우 성공으로 간주
        toast.success("상담 신청이 성공적으로 접수되었습니다.");
        form.reset();
        onClose();
      }
    } catch (error) {
      toast.error("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error("Network or submission error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-0">
          <DialogTitle>상담 신청</DialogTitle>
          <DialogDescription className="py-0 mb-0">
            문의 내용을 작성해주시면 빠르게 연락드리겠습니다.
          </DialogDescription>
        </DialogHeader>
        <Card className="px-6 pb-0 pt-0 border-none shadow-none">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nm">고객명</Label>
                <Input id="nm" placeholder="이름" {...form.register("nm")} />
                {form.formState.errors.nm && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.nm.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="tel1">연락처1</Label>
                <Input
                  id="tel1"
                  placeholder="010-1234-5678"
                  inputMode="tel"
                  {...form.register("tel1")}
                  onChange={handlePhoneChange('tel1')}
                />
                {form.formState.errors.tel1 && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.tel1.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="tel2">연락처2 (선택)</Label>
              <Input
                id="tel2"
                placeholder="추가 연락처"
                inputMode="tel"
                {...form.register("tel2")}
                onChange={handlePhoneChange('tel2')}
              />
            </div>
            {/*
            <div>
              <Label htmlFor="zip">우편번호</Label>
              <Input id="zip" placeholder="우편번호" {...form.register("zip")} />
              {form.formState.errors.zip && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.zip.message}
                </p>
              )}
            </div>
            */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="adres1">주소1</Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={openDaumPostcode}
                  >
                    주소 검색
                  </button>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:underline"
                    onClick={() => setIsAddrSearchOpen((v)=>!v)}
                  >
                    {isAddrSearchOpen ? '간이 입력 닫기' : '간이 입력'}
                  </button>
                </div>
              </div>
              <Input
                id="adres1"
                placeholder="기본 주소"
                {...form.register("adres1")}
              />
              {form.formState.errors.adres1 && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.adres1.message}
                </p>
              )}
              {isAddrSearchOpen && (
                <div className="mt-3 p-3 border rounded-lg space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="우편번호" value={addrZip} onChange={(e) => setAddrZip(e.target.value)} />
                    <div className="col-span-2 flex gap-2">
                      <Input placeholder="주소 검색 결과 입력" value={addrBase} onChange={(e) => setAddrBase(e.target.value)} />
                      <button type="button" className="px-3 py-2 rounded-md bg-primary text-white" onClick={applyAddress}>적용</button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">실 서비스 연동 전 간이 입력 창입니다.</p>
                </div>
              )}
              {/* 다음 우편번호 embed 컨테이너 */}
              <div id="daum-postcode-container" className="mt-3 border rounded-lg overflow-hidden" style={{ display: isAddrSearchOpen ? 'none' : undefined }} />
            </div>
            <div>
              <Label htmlFor="adres2">주소2 (상세 주소)</Label>
              <Input
                id="adres2"
                placeholder="상세 주소"
                {...form.register("adres2")}
              />
            </div>
            <div>
              <Label htmlFor="svcCnCd">서비스 내용</Label>
              <Controller
                name="svcCnCd"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="svcCnCd" className="w-full">
                      <SelectValue placeholder="서비스를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[280px]">
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.svcCnCd && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.svcCnCd.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="hopeDay">희망일자</Label>
              <Input
                id="hopeDay"
                type="date"
                min={todayDate}
                {...form.register("hopeDay")}
              />
              {form.formState.errors.hopeDay && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.hopeDay.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="inqryCn">상담 내용</Label>
              <Textarea
                id="inqryCn"
                placeholder="자세한 문의 내용을 입력해주세요"
                className="min-h-[120px]"
                {...form.register("inqryCn")}
              />
              {form.formState.errors.inqryCn && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.inqryCn.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                상담 신청
              </Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
