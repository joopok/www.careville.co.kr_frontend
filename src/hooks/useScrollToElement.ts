/**
 * 스크롤 유틸리티 훅
 * - 요소로 부드럽게 스크롤
 * - lazy-loading 요소 대응
 * - 헤더 오프셋 지원
 */

import { useCallback, useRef } from 'react';

interface ScrollOptions {
  /** 헤더 높이 오프셋 (기본: 80px) */
  headerOffset?: number;
  /** 스크롤 동작 (기본: 'smooth') */
  behavior?: ScrollBehavior;
  /** 재시도 최대 횟수 (기본: 15) */
  maxAttempts?: number;
  /** 재시도 간격 ms (기본: 100) */
  retryInterval?: number;
  /** 초기 지연 ms (기본: 300) */
  initialDelay?: number;
}

interface UseScrollToElementReturn {
  /** 요소 ID로 스크롤 */
  scrollToId: (targetId: string, options?: ScrollOptions) => void;
  /** href (#id 형식)로 스크롤 */
  scrollToHref: (href: string, options?: ScrollOptions) => void;
  /** 페이지 상단으로 스크롤 */
  scrollToTop: (behavior?: ScrollBehavior) => void;
  /** 빠른 문의 섹션으로 스크롤 */
  scrollToQuickInquiry: () => void;
}

const DEFAULT_OPTIONS: Required<ScrollOptions> = {
  headerOffset: 80,
  behavior: 'smooth',
  maxAttempts: 15,
  retryInterval: 100,
  initialDelay: 300,
};

/**
 * 스크롤 유틸리티 훅
 */
export function useScrollToElement(): UseScrollToElementReturn {
  const attemptsRef = useRef(0);

  /**
   * 요소로 스크롤 실행
   */
  const performScroll = useCallback((
    element: HTMLElement,
    headerOffset: number,
    behavior: ScrollBehavior
  ): boolean => {
    const elementRect = element.getBoundingClientRect();
    const absoluteTop = elementRect.top + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: Math.max(0, absoluteTop),
      behavior,
    });
    return true;
  }, []);

  /**
   * 요소 ID로 스크롤
   */
  const scrollToId = useCallback((
    targetId: string,
    options: ScrollOptions = {}
  ): void => {
    const {
      headerOffset,
      behavior,
      maxAttempts,
      retryInterval,
      initialDelay,
    } = { ...DEFAULT_OPTIONS, ...options };

    const tryScroll = (): boolean => {
      const element = document.getElementById(targetId);
      if (element) {
        return performScroll(element, headerOffset, behavior);
      }
      return false;
    };

    // 즉시 시도
    if (tryScroll()) return;

    // lazy-loading 트리거를 위해 페이지 끝으로 이동
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });

    // 재시도 로직
    attemptsRef.current = 0;
    const checkAndScroll = () => {
      attemptsRef.current++;
      if (tryScroll()) return;
      if (attemptsRef.current < maxAttempts) {
        setTimeout(checkAndScroll, retryInterval);
      }
    };

    setTimeout(checkAndScroll, initialDelay);
  }, [performScroll]);

  /**
   * href (#id 형식)로 스크롤
   */
  const scrollToHref = useCallback((
    href: string,
    options: ScrollOptions = {}
  ): void => {
    const targetId = href.replace('#', '');
    scrollToId(targetId, options);
  }, [scrollToId]);

  /**
   * 페이지 상단으로 스크롤
   */
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth'): void => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  /**
   * 빠른 문의 섹션으로 스크롤
   */
  const scrollToQuickInquiry = useCallback((): void => {
    const element = document.getElementById('quick-inquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // contact 섹션으로 폴백
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 재시도
    let attempts = 0;
    const retryInterval = setInterval(() => {
      attempts++;
      const el = document.getElementById('quick-inquiry');
      if (el || attempts >= 10) {
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearInterval(retryInterval);
      }
    }, 200);
  }, []);

  return {
    scrollToId,
    scrollToHref,
    scrollToTop,
    scrollToQuickInquiry,
  };
}

/**
 * 스탠드얼론 스크롤 함수 (훅 외부에서 사용)
 */
export function scrollToElementById(
  targetId: string,
  headerOffset = 80
): boolean {
  const element = document.getElementById(targetId);
  if (element) {
    const elementRect = element.getBoundingClientRect();
    const absoluteTop = elementRect.top + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: Math.max(0, absoluteTop),
      behavior: 'smooth',
    });
    return true;
  }
  return false;
}

export default useScrollToElement;
