/**
 * TanStack Query 키 관리
 * 일관된 캐시 무효화를 위한 중앙 집중식 키 관리
 */

export const queryKeys = {
  // 리뷰 관련
  reviews: {
    all: ['reviews'] as const,
    list: () => [...queryKeys.reviews.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.reviews.all, 'detail', id] as const,
  },

  // FAQ 관련
  faqs: {
    all: ['faqs'] as const,
    list: () => [...queryKeys.faqs.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.faqs.all, 'detail', id] as const,
  },

  // 설정 관련
  config: {
    all: ['config'] as const,
  },

  // 상품 관련
  products: {
    all: ['products'] as const,
    list: (serviceCd?: string) => [...queryKeys.products.all, 'list', serviceCd] as const,
    detail: (productNo: number) => [...queryKeys.products.all, 'detail', productNo] as const,
  },

  // 포트폴리오 관련
  portfolio: {
    all: ['portfolio'] as const,
    list: () => [...queryKeys.portfolio.all, 'list'] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
