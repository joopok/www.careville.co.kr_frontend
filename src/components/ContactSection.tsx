import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, HeadphonesIcon, Send, ArrowRight } from "lucide-react";

const ContactSection = () => {
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
      content: "info@careville.co.kr",
      description: "24시간 접수 가능",
      action: "mailto:info@careville.co.kr"
    },
    {
      icon: MapPin,
      title: "본사 위치",
      content: "경기도 고양시 일산동구",
      description: "전국 서비스 가능"
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

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left - Contact Form */}
          <div>
            <Card className="p-8 rounded-2xl border-border/50 bg-card" id="quick-inquiry">
              <div className="mb-8">
                <h3 className="text-title mb-2">빠른 문의</h3>
                <p className="text-muted-foreground">
                  문의 내용을 남겨주시면 빠르게 연락드리겠습니다
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">이름</label>
                    <Input
                      placeholder="홍길동"
                      className="h-12 rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">연락처</label>
                    <Input
                      placeholder="010-1234-5678"
                      type="tel"
                      className="h-12 rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">이메일</label>
                  <Input
                    placeholder="example@email.com"
                    type="email"
                    className="h-12 rounded-xl border-border/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">문의 내용</label>
                  <Textarea
                    placeholder="문의하실 내용을 자세히 입력해주세요"
                    className="min-h-[140px] rounded-xl border-border/50 focus:border-primary resize-none"
                  />
                </div>

                <Button className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-base transition-all duration-300 group">
                  <Send className="w-5 h-5 mr-2" />
                  문의 전송
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </form>
            </Card>
          </div>

          {/* Right - Contact Info Cards */}
          <div className="space-y-4 lg:pt-8">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className={`group p-6 rounded-2xl border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  info.highlight ? 'bg-primary text-white' : 'bg-card hover:border-primary/30'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {info.action ? (
                  <a href={info.action} className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      info.highlight
                        ? 'bg-white/20'
                        : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      <info.icon className={`h-7 w-7 ${
                        info.highlight ? 'text-white' : 'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${
                        info.highlight ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {info.title}
                      </h4>
                      <p className={`text-xl font-bold mb-1 ${
                        info.highlight ? 'text-white' : 'text-foreground'
                      }`}>
                        {info.content}
                      </p>
                      <p className={`text-sm ${
                        info.highlight ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {info.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-5 h-5 mt-4 transition-all duration-300 ${
                      info.highlight
                        ? 'text-white/50 group-hover:text-white group-hover:translate-x-1'
                        : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                    }`} />
                  </a>
                ) : (
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      <info.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground mb-1">{info.title}</h4>
                      <p className="text-xl font-bold text-foreground mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {/* Trust Note */}
            <div className="pt-4 text-center lg:text-left">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">빠른 답변 보장</span> • 평균 응답 시간 30분 이내
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
