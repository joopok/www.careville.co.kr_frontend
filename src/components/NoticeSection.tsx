import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Bell } from "lucide-react";

const NoticeSection = () => {
	// const notices = [
	// 	{
	// 		type: "notice",
	// 		title: "2024년 설 연휴 운영 안내",
	// 		date: "2024.01.20",
	// 		important: true,
	// 	},
	// 	{
	// 		type: "event",
	// 		title: "신규 고객 30% 할인 이벤트",
	// 		date: "2024.01.15",
	// 		important: true,
	// 	},
	// 	{
	// 		type: "notice",
	// 		title: "서비스 지역 확대 안내 (경기 북부)",
	// 		date: "2024.01.10",
	// 		important: false,
	// 	},
	// 	{
	// 		type: "review",
	// 		title: "1월 베스트 리뷰 선정 결과",
	// 		date: "2024.01.05",
	// 		important: false,
	// 	},
	// ];

	const faqs = [
		{
			question: "예약은 어떻게 하나요?",
			answer  : "전화(1600-9762) 또는 온라인 문의를 통해 예약 가능합니다.",
		},
		{
			question: "견적은 무료인가요?",
			answer  : "네, 방문 견적은 완전 무료입니다.",
		},
		{
			question: "작업 시간은 얼마나 걸리나요?",
			answer  : "평균 30평 기준 4-6시간 정도 소요됩니다.",
		},
		{
			question: "결제는 어떻게 진행되나요?",
			answer  : "서비스 완료 후 현장 결제 또는 계좌 이체를 통해 진행됩니다. 카드 결제도 가능합니다.",
		},
		{
			question: "서비스 전에 준비할 것이 있나요?",
			answer  : "귀중품이나 파손되기 쉬운 물품은 미리 안전한 곳으로 옮겨주시면 더욱 원활한 서비스가 가능합니다.",
		},
	];

	return (
		<section id="notice" className="py-20 bg-gradient-to-b from-white to-accent/10">
			<div className="container mx-auto px-6">
				<div className="text-center mb-12 animate-fadeIn">
					<div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4">
						<Bell className="h-5 w-5 text-accent-foreground" />
						<span className="text-accent-foreground font-semibold">
							자주 묻는 질문
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						궁금한 점을 해결해보세요
					</h2>
					<p className="text-muted-foreground text-lg">
						서비스 이용에 대해 가장 자주 묻는 질문들을 모아봤어요
					</p>
				</div>

				<div className="grid md:grid-cols-1 gap-8 py-[5px]">
					<div>
						{/* <h3 className="text-xl font-bold mb-4">자주 묻는 질문</h3> */}
						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq, index) => (
								<AccordionItem
									value={`item-${index}`}
									key={index}
									className="bg-white rounded-lg shadow-sm mb-3 px-4 animate-fadeIn border"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<AccordionTrigger className="text-left hover:no-underline">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NoticeSection;