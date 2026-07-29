const DEFAULT_API_BASE_URL = 'https://api.example.com'

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
}
