import { useState, useCallback, memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, HeadphonesIcon, Send, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useConfig, defaultConfig } from "@/contexts/ConfigContext";

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

const ContactSection = memo(() => {
  const { getConfig } = useConfig();

  // API에서 로드된 설정값 사용 (없으면 기본값)
  const phoneNumber = getConfig('PHONE', defaultConfig.PHONE);
  const emailAddress = getConfig('EMAIL', defaultConfig.EMAIL);
  const address = getConfig('ADDRESS_HQ', defaultConfig.ADDRESS_HQ);
  const branchName = getConfig('BRANCH_NAME', defaultConfig.BRANCH_NAME);
  const branchAddress = getConfig('ADDRESS_BRANCH', defaultConfig.ADDRESS_BRANCH);

  // 고객센터 운영시간
  const weekdayHours = getConfig('WEEKDAY_HOURS', defaultConfig.WEEKDAY_HOURS);
  const emergencyHours = getConfig('EMERGENCY_HOURS', defaultConfig.EMERGENCY_HOURS);

  // 동적 설정값을 사용하는 contactInfo (useMemo로 최적화)
  const contactInfo = useMemo(() => [
    {
      icon: Phone,
      title: "전화 상담",
      content: phoneNumber,
      description: weekdayHours,
      action: `tel:${phoneNumber}`,
      highlight: true
    },
    {
      icon: Mail,
      title: "이메일 문의",
      content: emailAddress,
      description: "24시간 접수 가능",
      action: `mailto:${emailAddress}`
    },
    {
      icon: MapPin,
      title: "본사",
      content: address.split(',')[0] || address,
      description: address.split(',')[1] || ''
    },
    {
      icon: MapPin,
      title: branchName,
      content: branchAddress.split(',')[0] || branchAddress,
      description: branchAddress.split(',')[1] || ''
    },
    {
      icon: Clock,
      title: "영업 시간",
      content: "연중무휴",
      description: emergencyHours
    }
  ], [phoneNumber, emailAddress, address, branchName, branchAddress, weekdayHours, emergencyHours]);
  const [formData, setFormData] = useState<InquiryForm>({
    name: "",
    phone: "",
    email: "",
    content: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/[^0-9]/g, '');
    let formatted = numbers;

    if (numbers.length > 3 && numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length > 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    setFormData(prev => ({ ...prev, phone: formatted }));
    setErrors(prev => ({ ...prev, phone: "" }));
  }, []);

  const validateForm = useCallback((): boolean => {
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
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 백엔드 cnsltReg.do API 사용 (폼 데이터 형식)
      const apiUrl = `${import.meta.env.VITE_API_URL}/cnsltReg.do`;

      // URL 파라미터 구성 (백엔드가 @RequestParam으로 받음)
      const params = new URLSearchParams();
      params.append('nm', formData.name);
      params.append('tel1', formData.phone.replace(/-/g, ''));
      if (formData.email) params.append('email', formData.email);
      params.append('inqryCn', formData.content);
      params.append('svcCnCd', '000'); // 일반 문의

      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      // 응답 처리 (백엔드가 JSON 또는 텍스트 반환 가능)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.isError === "true") {
          throw new Error(result.excpMsg || '문의 전송에 실패했습니다.');
        }
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
  }, [formData, validateForm]);

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
                <div className="py-12 text-center" role="status" aria-live="polite">
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
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
