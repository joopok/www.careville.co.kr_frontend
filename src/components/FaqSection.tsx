import { useMemo, memo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display?: boolean;
  order?: number;
};

interface FaqSectionProps {
  faqList: FaqItem[];
  loading: boolean;
}

const FaqSection = ({ faqList, loading }: FaqSectionProps) => {
  // props로 받은 데이터를 필터링/정렬 (useMemo로 최적화)
  const faqs = useMemo(() => {
    return (faqList || [])
      .filter((x: FaqItem) => x.display !== false)
      .sort((a: FaqItem, b: FaqItem) => (a.order || 0) - (b.order || 0));
  }, [faqList]);

  return (
    <section id="notice" className="py-20 bg-gradient-to-b from-white to-accent/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4">
            <Bell className="h-5 w-5 text-accent-foreground" />
            <span className="text-accent-foreground font-semibold">자주 묻는 질문</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">궁금한 점을 해결해보세요</h2>
          <p className="text-muted-foreground text-lg">서비스 이용에 대해 가장 자주 묻는 질문들을 모았습니다</p>
        </div>

        {loading ? (
          <Card className="p-8 text-center">불러오는 중…</Card>
        ) : faqs.length === 0 ? (
          <Card className="p-8 text-center">등록된 FAQ가 없습니다.</Card>
        ) : (
          <div className="grid md:grid-cols-1 gap-8 py-[5px]">
            <div>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem
                    value={faq.id}
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm mb-3 px-4 animate-fadeIn border"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(FaqSection);

