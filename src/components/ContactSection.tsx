import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, HeadphonesIcon } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "전화 상담",
      content: "1600-9762",
      description: "평일 09:00 - 18:00"
    },
    {
      icon: Mail,
      title: "이메일 문의",
      content: "info@careville.co.kr",
      description: "24시간 접수 가능"
    },
    {
      icon: MapPin,
      title: "본사 위치",
      content: "서울특별시 강남구",
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
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <HeadphonesIcon className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold">CS 센터</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            고객님과 함께하는 케어빌
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            편리한 상담 채널로 언제든지 문의하세요. 
            전문 상담사가 친절하게 도와드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">빠른 문의</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="이름" />
                  <Input placeholder="연락처" type="tel" />
                </div>
                <Input placeholder="이메일" type="email" />
                <Textarea 
                  placeholder="문의 내용을 입력해주세요" 
                  className="min-h-[120px]"
                />
                <Button className="w-full bg-primary hover:bg-primary-dark">
                  문의 전송
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <Card 
                key={index}
                className="p-4 hover:shadow-md transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{info.title}</h4>
                    <p className="text-lg font-bold text-primary">{info.content}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;