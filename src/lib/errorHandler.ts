/**
 * 에러 처리 유틸리티
 * 일관된 toast 기반 에러 핸들링
 */

import { toast } from 'sonner';

// 에러 메시지 타입
export interface ApiError {
  message?: string;
  excpMsg?: string;
  excpCdMsg?: string;
  isError?: boolean | string;
}

/**
 * API 에러 메시지 추출
 */
export function getErrorMessage(error: unknown, defaultMessage = '오류가 발생했습니다.'): string {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    return apiError.message || apiError.excpMsg || apiError.excpCdMsg || defaultMessage;
  }

  return defaultMessage;
}

/**
 * 에러 토스트 표시
 */
export function showError(error: unknown, defaultMessage?: string): void {
  const message = getErrorMessage(error, defaultMessage);
  toast.error(message);
}

/**
 * 성공 토스트 표시
 */
export function showSuccess(message: string): void {
  toast.success(message);
}

/**
 * API 응답 에러 체크
 */
export function checkApiResponse(data: ApiError): boolean {
  // isError가 true, "true", "Y" 등인 경우 에러로 판단
  if (data.isError === true || data.isError === 'true' || data.isError === 'Y') {
    return false;
  }
  return true;
}

/**
 * API 응답 처리
 */
export async function handleApiResponse<T>(
  response: Response,
  successMessage?: string
): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorData, `요청 실패 (${response.status})`));
  }

  const contentType = response.headers.get('content-type');

  // JSON이 아닌 응답 처리
  if (!contentType?.includes('application/json')) {
    if (successMessage) {
      showSuccess(successMessage);
    }
    return {} as T;
  }

  const data = await response.json();

  // API 에러 체크
  if (!checkApiResponse(data)) {
    throw new Error(getErrorMessage(data));
  }

  if (successMessage) {
    showSuccess(successMessage);
  }

  return data as T;
}

export default {
  getErrorMessage,
  showError,
  showSuccess,
  checkApiResponse,
  handleApiResponse,
};
