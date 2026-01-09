import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Config 타입
interface ConfigItem {
  configKey: string;
  configValue: string;
  configGroup: string;
  description?: string;
}

// Context 값 타입
interface ConfigContextType {
  config: Record<string, string>;
  loading: boolean;
  getConfig: (key: string, defaultValue?: string) => string;
}

// Context 생성
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Provider Props
interface ConfigProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiBase}/api/v1/configs`);

        if (!response.ok) throw new Error('Failed to fetch config');

        const data = await response.json();
        const configList = data.data || data || [];

        // ConfigItem 배열을 key-value 객체로 변환
        const configMap: Record<string, string> = {};
        configList.forEach((item: ConfigItem) => {
          if (item.configKey) {
            configMap[item.configKey] = item.configValue || '';
          }
        });

        setConfig(configMap);
        console.log('환경설정 로드 완료:', configMap);
      } catch (error) {
        console.error('환경설정 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // 설정값 조회 헬퍼 함수
  const getConfig = (key: string, defaultValue: string = ''): string => {
    return config[key] || defaultValue;
  };

  return (
    <ConfigContext.Provider value={{ config, loading, getConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom Hook
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

// 기본 설정값 (API 로드 전 또는 실패 시 사용)
export const defaultConfig = {
  // 기본 정보
  SITE_NAME: '케어빌',
  PHONE: '1600-9762',
  EMAIL: 'seung0910@naver.com',

  // 사업자 정보
  COMPANY_NAME: '주식회사 케이빌',
  CEO_NAME: '이경숙',
  BUSINESS_NUMBER: '276-87-03677',
  BUSINESS_TYPE: '서비스, 건설업, 도소매',

  // 주소
  ADDRESS: '경기 고양시 일산동구 정발산로 31-10, 806호(장항동, 파크프라자)',
  ADDRESS_HQ: '경기 고양시 일산동구 정발산로 31-10, 806호(장항동, 파크프라자)',
  ADDRESS_BRANCH: '경기 고양시 으뜸로8, 504호(덕은아이에스비즈타워센트럴 1차)',
  BRANCH_NAME: '서울지사',

  // 고객센터 운영시간
  WEEKDAY_HOURS: '평일 09:00 - 18:00',
  WEEKEND_HOURS: '주말 09:00 - 15:00',
  EMERGENCY_HOURS: '연중무휴(긴급 24시간)',
  PHONE_DESCRIPTION: '24시간 상담 가능',
  EMAIL_DESCRIPTION: '이메일 문의',
} as const;

export default ConfigContext;
