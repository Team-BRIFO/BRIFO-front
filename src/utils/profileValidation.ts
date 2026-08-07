/** 온보딩과 프로필 수정에서 공유하는 입력 정책입니다. */
export const PROFILE_TEXT_MIN_LENGTH = 2
export const PROFILE_TEXT_MAX_LENGTH = 10
export const MIN_INTEREST_STOCK_COUNT = 1
export const MAX_INTEREST_STOCK_COUNT = 3
export const DEFAULT_COMPANY_NAME = '내 투자회사'

export const PROFILE_INPUT_PLACEHOLDER = '공백을 제외하고 2~10자'

const PROFILE_VALIDATION_MESSAGES = {
  nicknameRequired: '닉네임을 입력해주세요.',
  nicknameLength: '닉네임은 공백을 제외하고 2~10자로 입력해주세요.',
  companyNameRequired: '회사명을 입력해주세요.',
  companyNameLength: '회사명은 공백을 제외하고 2~10자로 입력해주세요.',
  interestStocksMin: '관심종목을 1개 이상 선택해주세요.',
  interestStocksMax: '관심종목은 최대 3개까지 선택할 수 있어요.',
  interestStocksDuplicate: '중복된 관심종목이 포함되어 있어요.',
} as const

export function normalizeProfileText(value: string) {
  return value.trim()
}

function validateProfileText(
  value: string,
  messages: { required: string; length: string },
): string | undefined {
  const normalizedValue = normalizeProfileText(value)

  if (normalizedValue.length === 0) return messages.required
  if (
    normalizedValue.length < PROFILE_TEXT_MIN_LENGTH ||
    normalizedValue.length > PROFILE_TEXT_MAX_LENGTH
  ) {
    return messages.length
  }

  return undefined
}

export function validateNickname(value: string) {
  return validateProfileText(value, {
    required: PROFILE_VALIDATION_MESSAGES.nicknameRequired,
    length: PROFILE_VALIDATION_MESSAGES.nicknameLength,
  })
}

export function validateCompanyName(value: string) {
  return validateProfileText(value, {
    required: PROFILE_VALIDATION_MESSAGES.companyNameRequired,
    length: PROFILE_VALIDATION_MESSAGES.companyNameLength,
  })
}

export function validateInterestStockIds(stockIds: readonly string[]) {
  if (stockIds.length < MIN_INTEREST_STOCK_COUNT) {
    return PROFILE_VALIDATION_MESSAGES.interestStocksMin
  }
  if (stockIds.length > MAX_INTEREST_STOCK_COUNT) {
    return PROFILE_VALIDATION_MESSAGES.interestStocksMax
  }
  if (new Set(stockIds).size !== stockIds.length) {
    return PROFILE_VALIDATION_MESSAGES.interestStocksDuplicate
  }

  return undefined
}
