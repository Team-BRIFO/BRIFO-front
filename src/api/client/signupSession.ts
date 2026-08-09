const SIGNUP_CSRF_HEADER = 'X-Signup-CSRF-Token'

let signupSessionActive = false
let signupCsrfToken: string | null = null

export const signupSession = {
  activate() {
    signupSessionActive = true
  },
  clear() {
    signupSessionActive = false
    signupCsrfToken = null
  },
  isActive() {
    return signupSessionActive
  },
  setCsrfToken(token: string) {
    signupCsrfToken = token
  },
  getCsrfToken() {
    return signupCsrfToken
  },
  getCsrfHeaderName() {
    return SIGNUP_CSRF_HEADER
  },
}
