const MIN_PROFILE_NAME_LENGTH = 4
const MAX_PROFILE_NAME_LENGTH = 5
const PROFILE_NAME_PATTERN = /^[가-힣A-Za-z0-9]+$/
const PROFILE_NAME_ERROR_MESSAGE = '4~5글자 제한을 넘거나 특수문자가 있어요'

interface ProfileNameValidationResult {
  isValid: boolean
  errorMessage: string
}

export function validateProfileName(value: string): ProfileNameValidationResult {
  if (value.length === 0) {
    return {
      isValid: false,
      errorMessage: '',
    }
  }

  const hasValidLength =
    value.length >= MIN_PROFILE_NAME_LENGTH && value.length <= MAX_PROFILE_NAME_LENGTH
  const hasOnlyAllowedCharacters = PROFILE_NAME_PATTERN.test(value)
  const isValid = hasValidLength && hasOnlyAllowedCharacters

  return {
    isValid,
    errorMessage: isValid ? '' : PROFILE_NAME_ERROR_MESSAGE,
  }
}

export function useProfileNameValidation(value: string): ProfileNameValidationResult {
  return validateProfileName(value)
}
