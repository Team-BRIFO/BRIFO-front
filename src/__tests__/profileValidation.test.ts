import { describe, expect, it } from 'vitest'

import {
  DEFAULT_COMPANY_NAME,
  normalizeProfileText,
  validateCompanyName,
  validateInterestStockIds,
  validateNickname,
} from '@/utils/profileValidation'

describe('profile validation', () => {
  it.each([
    ['', '닉네임을 입력해주세요.'],
    [' ', '닉네임을 입력해주세요.'],
    ['가', '닉네임은 공백을 제외하고 2~10자로 입력해주세요.'],
    ['가나다라마바사아자차카', '닉네임은 공백을 제외하고 2~10자로 입력해주세요.'],
    ['  브리포  ', undefined],
  ])('validates nickname with trimmed length: %j', (value, expectedError) => {
    expect(validateNickname(value)).toBe(expectedError)
  })

  it.each([
    ['', '회사명을 입력해주세요.'],
    [' ', '회사명을 입력해주세요.'],
    ['가', '회사명은 공백을 제외하고 2~10자로 입력해주세요.'],
    ['가나다라마바사아자차카', '회사명은 공백을 제외하고 2~10자로 입력해주세요.'],
    ['  내 투자회사  ', undefined],
  ])('validates company name with trimmed length: %j', (value, expectedError) => {
    expect(validateCompanyName(value)).toBe(expectedError)
  })

  it.each([
    [[], '관심종목을 1개 이상 선택해주세요.'],
    [['one'], undefined],
    [['one', 'two', 'three'], undefined],
    [['one', 'two', 'three', 'four'], '관심종목은 최대 3개까지 선택할 수 있어요.'],
  ])('validates an interest-stock count of %j', (stockIds, expectedError) => {
    expect(validateInterestStockIds(stockIds)).toBe(expectedError)
  })

  it('rejects duplicated interest stocks and normalizes values before serialization', () => {
    expect(validateInterestStockIds(['one', 'one'])).toBe('중복된 관심종목이 포함되어 있어요.')
    expect(normalizeProfileText('  브리포  ')).toBe('브리포')
    expect(DEFAULT_COMPANY_NAME).toBe('내 투자회사')
  })
})
