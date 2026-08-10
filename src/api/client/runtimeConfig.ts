export function getApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  // 로컬 dev에서는 Vite proxy(/api → backend)를 통해 same-origin으로 호출해야
  // HttpOnly auth cookie가 localhost에 저장·전송된다.
  if (import.meta.env.DEV) {
    return ''
  }

  return apiBaseUrl
}
