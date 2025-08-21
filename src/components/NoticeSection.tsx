import { Card } from "@/components/ui/card";
import { Bell, FileText, Calendar, ChevronRight } from "lucide-react";

const NoticeSection = () => {
  const notices = [
    {
      type: "notice",
      title: "2024년 설 연휴 운영 안내",
      date: "2024.01.20",
      important: true
    },
    {
      type: "event",
      title: "신규 고객 30% 할인 이벤트",
      date: "2024.01.15",
      important: true
    },
    {
      type: "notice",
      title: "서비스 지역 확대 안내 (경기 북부)",
      date: "2024.01.10",
      important: false
    },
    {
      type: "review",
      title: "1월 베스트 리뷰 선정 결과",
      date: "2024.01.05",
      important: false
    }
  ];

  const faqs = [
    {
      question: "예약은 어떻게 하나요?",
      answer: "전화(1600-9762) 또는 온라인 문의를 통해 예약 가능합니다."
    },
    {
      question: "견적은 무료인가요?",
      answer: "네, 방문 견적은 완전 무료입니다."
    },
    {
      question: "작업 시간은 얼마나 걸리나요?",
      answer: "평균 30평 기준 4-6시간 정도 소요됩니다."
    }
  ];

  return (
    <section id="notice" className="py-20 bg-gradient-to-b from-white to-accent/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4">
            <Bell className="h-5 w-5 text-accent-foreground" />
            <span className="text-accent-foreground font-semibold">공지&리뷰</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            온다클린 소식
          </h2>
          <p className="text-muted-foreground text-lg">
            중요한 공지사항과 이벤트 정보를 확인하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              공지사항
            </h3>
            <div className="space-y-3">
              {notices.map((notice, index) => (
                <Card 
                  key={index}
                  className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer group animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {notice.important && (
                          <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded text-xs font-semibold">
                            중요
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                          {notice.type === "notice" ? "공지" : notice.type === "event" ? "이벤트" : "리뷰"}
                        </span>
                      </div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {notice.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {notice.date}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">자주 묻는 질문</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card 
                  key={index}
                  className="p-4 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <details className="group cursor-pointer">
                    <summary className="font-medium flex items-center justify-between list-none">
                      {faq.question}
                      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;