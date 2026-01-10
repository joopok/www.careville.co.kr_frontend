import { useState, useEffect } from "react";

// 해상도 브레이크포인트
export const BREAKPOINTS = {
  FULL_HD: { width: 1920, height: 1080 },
  HD: { width: 1280, height: 720 },
  TABLET: { width: 1024, height: 768 },
  MOBILE: { width: 768, height: 1024 },
} as const;

export type ScreenCategory = "full-hd" | "hd" | "tablet" | "mobile";

export interface ScreenSize {
  width: number;
  height: number;
  category: ScreenCategory;
  isFullHD: boolean;
  isHD: boolean;
  isTablet: boolean;
  isMobile: boolean;
  aspectRatio: number;
}

/**
 * 화면 해상도를 감지하고 카테고리를 반환하는 훅
 * Full HD (1920x1080) 기준으로 분류
 */
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    if (typeof window === "undefined") {
      return {
        width: BREAKPOINTS.FULL_HD.width,
        height: BREAKPOINTS.FULL_HD.height,
        category: "full-hd",
        isFullHD: true,
        isHD: false,
        isTablet: false,
        isMobile: false,
        aspectRatio: 16 / 9,
      };
    }
    return getScreenSize();
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", handleResize);

    // 화면 방향 변경 감지 (모바일)
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return screenSize;
}

function getScreenSize(): ScreenSize {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / height;

  let category: ScreenCategory;

  if (width >= BREAKPOINTS.FULL_HD.width) {
    category = "full-hd";
  } else if (width >= BREAKPOINTS.HD.width) {
    category = "hd";
  } else if (width >= BREAKPOINTS.TABLET.width) {
    category = "tablet";
  } else {
    category = "mobile";
  }

  return {
    width,
    height,
    category,
    isFullHD: category === "full-hd",
    isHD: category === "hd",
    isTablet: category === "tablet",
    isMobile: category === "mobile",
    aspectRatio,
  };
}

/**
 * 모달 크기 계산 함수
 * 해상도에 따라 최적의 모달 크기 반환
 */
export function getModalDimensions(screenSize: ScreenSize): {
  maxWidth: string;
  maxHeight: string;
  padding: string;
  imageGridCols: number;
} {
  const { category, width, height } = screenSize;

  switch (category) {
    case "full-hd":
      return {
        maxWidth: "1200px",
        maxHeight: "85vh",
        padding: "2rem",
        imageGridCols: 6,
      };
    case "hd":
      return {
        maxWidth: `${Math.min(width * 0.9, 1000)}px`,
        maxHeight: "88vh",
        padding: "1.5rem",
        imageGridCols: 5,
      };
    case "tablet":
      return {
        maxWidth: `${Math.min(width * 0.92, 900)}px`,
        maxHeight: "90vh",
        padding: "1.25rem",
        imageGridCols: 4,
      };
    case "mobile":
    default:
      return {
        maxWidth: "100%",
        maxHeight: "95vh",
        padding: "1rem",
        imageGridCols: 3,
      };
  }
}

export default useScreenSize;
