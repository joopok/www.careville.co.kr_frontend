/**
 * 리뷰 관련 TanStack Query 훅
 * - 리뷰 목록 조회
 * - 리뷰 생성/수정/삭제
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

// 타입 정의
export interface Review {
  serviceNm: string;
  reviewSeq: string;
  svcDate: string;
  dispYn: string;
  serviceCd: string;
  starRate: number;
  reviewNm: string;
  rgsDt: string;
  reviewCn: string;
}

export interface ServiceCdItem {
  serviceCd: string;
  serviceNm: string;
}

export interface ReviewsResponse {
  serviceCdList: ServiceCdItem[];
  data: Review[];
}

export interface ReviewFormData {
  reviewSeq?: string;
  reviewNm: string;
  serviceCd: string;
  starRate: number;
  reviewCn: string;
  svcDate: string;
  pw: string;
}

// API 경로 설정
const getApiBase = () => import.meta.env.VITE_API_URL || '';
const REVIEW_LIST_PATH = import.meta.env.VITE_REVIEW_LIST_PATH ?? '/api/reviews/all';
const REVIEW_CREATE_PATH = import.meta.env.VITE_REVIEW_CREATE_PATH ?? '/api/reviews';
const REVIEW_UPDATE_PATH = (id: string) => {
  const p = import.meta.env.VITE_REVIEW_UPDATE_PATH;
  return p ? p.replace(':id', id) : `/api/reviews/${id}`;
};
const REVIEW_DELETE_PATH = (id: string) => {
  const p = import.meta.env.VITE_REVIEW_DELETE_PATH;
  return p ? p.replace(':id', id) : `/api/reviews/${id}/delete`;
};

// API 요청 헬퍼 (JSON 우선, 폼 폴백)
async function sendRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  data?: Record<string, unknown>
): Promise<Response> {
  const apiBase = getApiBase();
  const fullUrl = url.startsWith('http') ? url : `${apiBase}${url}`;

  // 1차: JSON 요청
  let resp = await fetch(fullUrl, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  // 폴백: 403/415/405 → 폼 데이터로 재시도
  if (!resp.ok && (resp.status === 403 || resp.status === 415 || resp.status === 405)) {
    const form = new URLSearchParams();
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => form.set(k, String(v ?? '')));
    }
    resp = await fetch(fullUrl, {
      method: method === 'PUT' || method === 'PATCH' ? 'POST' : method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: data ? form.toString() : undefined,
    });
  }

  return resp;
}

/**
 * 리뷰 목록 조회 훅
 */
export function useReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.list(),
    queryFn: async (): Promise<ReviewsResponse> => {
      const resp = await sendRequest(REVIEW_LIST_PATH, 'GET');
      if (!resp.ok) {
        throw new Error('리뷰 목록을 불러오는데 실패했습니다.');
      }
      return resp.json();
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

/**
 * 리뷰 생성 뮤테이션
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const submitData = {
        ...data,
        starRate: Number(data.starRate),
        svcDate: data.svcDate?.replace(/-/g, '') || '',
      };

      const resp = await sendRequest(REVIEW_CREATE_PATH, 'POST', submitData as unknown as Record<string, unknown>);

      if (!resp.ok) {
        throw new Error('리뷰 등록에 실패했습니다.');
      }

      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success('리뷰가 등록되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '리뷰 등록 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 리뷰 수정 뮤테이션
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewFormData) => {
      if (!data.reviewSeq) {
        throw new Error('리뷰 ID가 필요합니다.');
      }

      const submitData = {
        ...data,
        starRate: Number(data.starRate),
        svcDate: data.svcDate?.replace(/-/g, '') || '',
      };

      const resp = await sendRequest(
        REVIEW_UPDATE_PATH(data.reviewSeq),
        'PUT',
        submitData as unknown as Record<string, unknown>
      );

      if (!resp.ok) {
        throw new Error('리뷰 수정에 실패했습니다.');
      }

      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success('리뷰가 수정되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '리뷰 수정 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 리뷰 삭제 뮤테이션
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewSeq, pw }: { reviewSeq: string; pw: string }) => {
      const resp = await sendRequest(
        REVIEW_DELETE_PATH(reviewSeq),
        'DELETE',
        { pw }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || '리뷰 삭제에 실패했습니다.');
      }

      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success('리뷰가 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '리뷰 삭제 중 오류가 발생했습니다.');
    },
  });
}

export default useReviews;
