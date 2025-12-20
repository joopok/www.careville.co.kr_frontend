import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, Building2, User, Phone, Mail, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string | null;
  category?: "홈클리닝" | "사업장 클리닝";
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const ServiceRequestModal = ({ isOpen, onClose, serviceName, category = "사업장 클리닝" }: ServiceRequestModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form when modal opens
      setFormData({
        name: "",
        phone: "",
        email: "",
        companyName: "",
        preferredDate: "",
        preferredTime: "",
        message: ""
      });
      setIsSuccess(false);
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else if (!/^[0-9-]{10,13}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = "올바른 연락처를 입력해주세요";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    const numbers = value.replace(/[^0-9]/g, '');
    let formatted = numbers;

    if (numbers.length > 3 && numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length > 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would normally send data to your backend
    console.log("Service Request:", {
      service: serviceName,
      ...formData
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    // Auto close after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "협의 후 결정"
  ];

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-primary text-white p-6 z-10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">{category}</p>
                  <h2 className="text-xl font-bold">{serviceName || "서비스 신청"}</h2>
                </div>
              </div>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">신청 완료!</h3>
                <p className="text-primary font-semibold mb-2">{serviceName}</p>
                <p className="text-gray-600">
                  빠른 시일 내에 연락드리겠습니다.
                </p>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Service Type - Read Only */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                    <CheckCircle className="w-4 h-4" />
                    신청 서비스
                  </label>
                  <p className="text-lg font-bold text-gray-900">{serviceName}</p>
                </div>

                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="홍길동"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="010-1234-5678"
                    maxLength={13}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    이메일 <span className="text-gray-400 text-xs">(선택)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    업체명 <span className="text-gray-400 text-xs">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="회사/매장명"
                  />
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      희망 날짜
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                      min={getMinDate()}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      희망 시간
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">선택</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    상세 요청사항 <span className="text-gray-400 text-xs">(선택)</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="청소 면적, 특별 요청사항 등을 입력해주세요"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-semibold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      신청 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      서비스 신청하기
                    </>
                  )}
                </Button>

                {/* Privacy Notice */}
                <p className="text-xs text-gray-500 text-center">
                  신청 시 <span className="text-primary">개인정보 수집 및 이용</span>에 동의합니다.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceRequestModal;
