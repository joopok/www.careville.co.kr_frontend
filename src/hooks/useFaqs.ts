/**
 * FAQ 관련 TanStack Query 훅
 * - FAQ 목록 조회
 * - FAQ 생성/수정/삭제
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

// 타입 정의
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display?: boolean;
  order?: number;
}

export interface FaqFormData {
  id?: string;
  question: string;
  answer: string;
  category?: string;
  display?: boolean;
  order?: number;
}

export interface FaqsResponse {
  data: FaqItem[];
}

// API 경로 설정
const getApiBase = () => import.meta.env.VITE_API_URL || '';

// API 요청 헬퍼 (JSON 우선, 폼 폴백)
async function sendRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: Record<string, unknown>
): Promise<Response> {
  const apiBase = getApiBase();
  const fullUrl = url.startsWith('http') ? url : `${apiBase}${url}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (method !== 'GET' && method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
  }

  let resp = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  // 폴백: 403/415/405 → 폼 데이터로 재시도
  if (!resp.ok && (resp.status === 403 || resp.status === 415 || resp.status === 405)) {
    const form = new URLSearchParams();
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => form.set(k, String(v ?? '')));
    }
    resp = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data ? form.toString() : undefined,
    });
  }

  return resp;
}

/**
 * FAQ 목록 조회 훅
 */
export function useFaqs() {
  return useQuery({
    queryKey: queryKeys.faqs.list(),
    queryFn: async (): Promise<FaqItem[]> => {
      const resp = await sendRequest('/api/faqs', 'GET');
      if (!resp.ok) {
        throw new Error('FAQ 목록을 불러오는데 실패했습니다.');
      }
      const json: FaqsResponse = await resp.json();
      return json.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30분 (FAQ는 자주 변경되지 않음)
    gcTime: 1000 * 60 * 60, // 1시간
  });
}

/**
 * FAQ 생성 뮤테이션
 */
export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FaqFormData) => {
      const payload = {
        ...data,
        order: Number(data.order) || 0,
      };

      const resp = await sendRequest('/api/faqs', 'POST', payload as unknown as Record<string, unknown>);

      if (!resp.ok) {
        throw new Error('FAQ 등록에 실패했습니다.');
      }

      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success('FAQ가 등록되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'FAQ 등록 중 오류가 발생했습니다.');
    },
  });
}

/**
 * FAQ 수정 뮤테이션
 */
export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FaqFormData) => {
      if (!data.id) {
        throw new Error('FAQ ID가 필요합니다.');
      }

      const payload = {
        ...data,
        order: Number(data.order) || 0,
      };

      const resp = await sendRequest(`/api/faqs/${data.id}`, 'PUT', payload as unknown as Record<string, unknown>);

      if (!resp.ok) {
        throw new Error('FAQ 수정에 실패했습니다.');
      }

      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success('FAQ가 수정되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'FAQ 수정 중 오류가 발생했습니다.');
    },
  });
}

/**
 * FAQ 삭제 뮤테이션
 */
export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await sendRequest(`/api/faqs/${id}`, 'DELETE');

      if (!resp.ok) {
        throw new Error('FAQ 삭제에 실패했습니다.');
      }

      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success('FAQ가 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'FAQ 삭제 중 오류가 발생했습니다.');
    },
  });
}

export default useFaqs;
