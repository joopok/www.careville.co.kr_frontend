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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  zip: z.string().min(1, "우편번호를 입력해주세요."),
  svcCnCd: z.string().min(1, "서비스 내용을 선택해주세요."),
  hopeDay: z.string().min(1, "희망일자를 선택해주세요."),
  inqryCn: z.string().min(1, "상담 내용을 입력해주세요."),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
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

  const onSubmit = (values: ContactFormValues) => {
    console.log("Form submitted:", values);
    // Here you would typically send the data to your backend API
    onClose(); // Close the modal after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>상담 신청</DialogTitle>
          <DialogDescription>
            문의 내용을 작성해주시면 빠르게 연락드리겠습니다.
          </DialogDescription>
        </DialogHeader>
        <Card className="p-6 border-none shadow-none">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <div>
              <Label htmlFor="zip">우편번호</Label>
              <Input id="zip" placeholder="우편번호" {...form.register("zip")} />
              {form.formState.errors.zip && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.zip.message}
                </p>
              )}
            </div>
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
              <Input id="svcCnCd" placeholder="예: 홈클리닝, 사업장클리닝" {...form.register("svcCnCd")} />
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
