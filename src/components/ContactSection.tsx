import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, HeadphonesIcon, Send, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import ContactModal from "@/components/ContactModal";

interface InquiryForm {
  name: string;
  phone: string;
  email: string;
  content: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  content?: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<InquiryForm>({
    name: "",
    phone: "",
    email: "",
    content: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/[^0-9]/g, '');
    let formatted = numbers;

    if (numbers.length > 3 && numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length > 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else if (!/^[0-9-]{10,13}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = "올바른 연락처를 입력해주세요";
    }

    if (!formData.content.trim()) {
      newErrors.content = "문의 내용을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.DEV
        ? '/api/inquiry'
        : `${import.meta.env.VITE_API_URL}/api/inquiry`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone.replace(/-/g, ''),
          email: formData.email,
          content: formData.content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setIsSuccess(true);
      setFormData({ name: "", phone: "", email: "", content: "" });

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('문의 전송 실패:', error);
      alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 상담 신청 모달 상태
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: "전화 상담",
      content: "1600-9762",
      description: "평일 09:00 - 18:00",
      action: "tel:1600-9762",
      highlight: true
    },
    {
      icon: Mail,
      title: "이메일 문의",
      content: "seung0910@naver.com",
      description: "24시간 접수 가능",
      action: "mailto:seung0910@naver.com"
    },
    {
      icon: MapPin,
      title: "본사",
      content: "경기 고양시 일산동구 정발산로 31-10",
      description: "806호(장항동, 파크프라자)"
    },
    {
      icon: MapPin,
      title: "경기지사",
      content: "경기도 고양시 으뜸로8,",
      description: "덕은아이에스비즈타워신트럴 1차 504호"
    },
    {
      icon: Clock,
      title: "영업 시간",
      content: "연중무휴",
      description: "긴급 상황 24시간 대응"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-organic opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <HeadphonesIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">CS 센터</span>
          </div>

          <h2 className="text-headline mb-6">
            고객님과 함께하는{" "}
            <span className="text-gradient">케어빌</span>
          </h2>

          <p className="text-body-lg text-muted-foreground">
            편리한 상담 채널로 언제든지 문의하세요.
            전문 상담사가 친절하게 도와드립니다
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
          {/* Left - Contact Form */}
          <div className="flex">
            <Card className="p-8 rounded-2xl border-border/50 bg-card flex-1" id="quick-inquiry">
              <div className="mb-8">
                <h3 className="text-title mb-2">빠른 문의</h3>
                <p className="text-muted-foreground">
                  문의 내용을 남겨주시면 빠르게 연락드리겠습니다
                </p>
              </div>

              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">문의가 접수되었습니다!</h4>
                  <p className="text-muted-foreground">
                    빠른 시일 내에 연락드리겠습니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="홍길동"
                        className={`h-12 rounded-xl border-border/50 focus:border-primary ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        연락처 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="010-1234-5678"
                        type="tel"
                        maxLength={13}
                        className={`h-12 rounded-xl border-border/50 focus:border-primary ${errors.phone ? 'border-red-500' : ''}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">이메일</label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      type="email"
                      className="h-12 rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      문의 내용 <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="문의하실 내용을 자세히 입력해주세요"
                      className={`min-h-[140px] rounded-xl border-border/50 focus:border-primary resize-none ${errors.content ? 'border-red-500' : ''}`}
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  </div>

                  <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-base transition-all duration-300 group disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        문의 전송
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 rounded-xl"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    상담 신청
                  </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          {/* Right - Contact Info Cards */}
          <div className="flex flex-col gap-2">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className={`group p-3 rounded-xl border-border/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1 flex items-center ${info.highlight ? 'bg-primary text-white' : 'bg-card hover:border-primary/30'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {info.action ? (
                  <a href={info.action} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${info.highlight
                      ? 'bg-white/20'
                      : 'bg-primary/10 group-hover:bg-primary/20'
                      }`}>
                      <info.icon className={`h-5 w-5 ${info.highlight ? 'text-white' : 'text-primary'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-medium ${info.highlight ? 'text-white/80' : 'text-muted-foreground'
                        }`}>
                        {info.title}
                      </h4>
                      <p className={`text-sm font-bold truncate ${info.highlight ? 'text-white' : 'text-foreground'
                        }`}>
                        {info.content}
                      </p>
                      <p className={`text-xs truncate ${info.highlight ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                        {info.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${info.highlight
                      ? 'text-white/50 group-hover:text-white group-hover:translate-x-1'
                      : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                      }`} />
                  </a>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-muted-foreground">{info.title}</h4>
                      <p className="text-sm font-bold text-foreground truncate">{info.content}</p>
                      <p className="text-xs text-muted-foreground truncate">{info.description}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </div>
    </section>
  );
};

export default ContactSection;
