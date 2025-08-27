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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  nm: z.string().min(1, "고객명을 입력해주세요."),
  tel1: z.string().min(1, "연락처1을 입력해주세요."),
  tel2: z.string().optional(),
  adres1: z.string().min(1, "주소1을 입력해주세요."),
  adres2: z.string().optional(),
  zip: z.string().optional(),
  svcCnCd: z.string().min(1, "서비스 내용을 선택해주세요."),
  hopeDay: z.string().min(1, "희망일자를 선택해주세요."),
  inqryCn: z.string().min(1, "상담 내용을 입력해주세요."),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const serviceOptions = [
    { label: "입주 청소", value: "001" },
    { label: "이사 청소", value: "002" },
    { label: "거주 청소", value: "003" },
    { label: "욕실 정기서비스", value: "004" },
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

  const onSubmit = async (values: ContactFormValues) => {
    const url = "http://211.236.162.104:8081/cnsltReg.do";
    const formData = new URLSearchParams();
    for (const key in values) {
      formData.append(key, values[key as keyof ContactFormValues] || "");
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.isError === false) {
        toast.success("상담 신청이 성공적으로 접수되었습니다.");
        onClose(); // Close the modal after successful submission
      } else {
        toast.error("상담 신청에 실패했습니다. 다시 시도해주세요.");
        console.error("Submission error:", result);
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
                <Input id="tel1" placeholder="010-XXXX-XXXX" {...form.register("tel1")} />
                {form.formState.errors.tel1 && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.tel1.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="tel2">연락처2 (선택)</Label>
              <Input id="tel2" placeholder="추가 연락처" {...form.register("tel2")} />
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
              <Label htmlFor="adres1">주소1</Label>
              <Input id="adres1" placeholder="기본 주소" {...form.register("adres1")} />
              {form.formState.errors.adres1 && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.adres1.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="adres2">주소2 (상세 주소)</Label>
              <Input id="adres2" placeholder="상세 주소" {...form.register("adres2")} />
            </div>
            <div>
              <Label htmlFor="svcCnCd">서비스 내용</Label>
              <Controller
                name="svcCnCd"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="svcCnCd">
                      <SelectValue placeholder="서비스를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
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
              <Input id="hopeDay" type="date" {...form.register("hopeDay")} />
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
