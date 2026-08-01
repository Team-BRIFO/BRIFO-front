import { ApiError } from '@/api/client/ApiError'

const MOCK_NETWORK_DELAY_MS = 500

/**
 * mock API 함수에서 사용하는 네트워크 시뮬레이터.
 *
 * - 오프라인(`navigator.onLine === false`)이면 즉시 네트워크 에러를 던져
 *   실제 API 연결 환경과 동일한 에러 흐름을 로컬에서도 재현할 수 있게 한다.
 * - 온라인이면 지정된 지연 후 콜백 결과를 반환한다.
 *
 * TODO: 실제 API 연결 후 이 유틸리티 및 호출부를 모두 제거한다.
 */
export function mockFetch<T>(
  endpoint: string,
  getData: () => T,
  delayMs: number = MOCK_NETWORK_DELAY_MS,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!navigator.onLine) {
      reject(
        new ApiError({
          kind: 'network',
          endpoint,
          code: 'NETWORK_ERROR',
          message: '네트워크 연결을 확인해 주세요.',
        }),
      )
      return
    }

    setTimeout(() => {
      if (!navigator.onLine) {
        reject(
          new ApiError({
            kind: 'network',
            endpoint,
            code: 'NETWORK_ERROR',
            message: '네트워크 연결을 확인해 주세요.',
          }),
        )
        return
      }
      try {
        resolve(getData())
      } catch (e) {
        reject(e)
      }
    }, delayMs)
  })
}
