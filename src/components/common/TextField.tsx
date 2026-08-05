import type { ReactNode } from 'react'
import { useId } from 'react'

import { Icon } from '@/components/common/Icon'

type TextFieldVariant = 'field' | 'search'

export interface TextFieldProps {
  /** 입력 필드 id */
  id?: string

  /** 입력 필드 이름 */
  name?: string

  /** 입력값 (Controlled) */
  value: string

  /** 입력값 변경 이벤트 */
  onChange: React.ChangeEventHandler<HTMLInputElement>

  /** 입력 목적 */
  variant?: TextFieldVariant

  /** label 텍스트 */
  label?: string

  /** placeholder 텍스트 */
  placeholder?: string

  /** 보조 설명 텍스트 */
  helperText?: string

  /** 오류 메시지 — 유효한 문자열이 전달되면 자동으로 오류 상태로 판정 */
  errorMessage?: string

  /** 입력 비활성화 여부 */
  disabled?: boolean

  /** 읽기 전용 여부 */
  readOnly?: boolean

  /** 필수 입력 여부 */
  required?: boolean

  /** 입력 타입 */
  type?: 'text' | 'search' | 'email' | 'password' | 'number'

  /** 왼쪽 아이콘 */
  leftIcon?: ReactNode

  /** 오른쪽 아이콘 */
  rightIcon?: ReactNode

  /** 추가 스타일 className */
  className?: string

  /**
   * variant="search"일 때 Clear(X) 버튼 클릭 핸들러.
   * 전달하지 않으면 Clear 버튼이 표시되지 않습니다.
   */
  onClear?: () => void
}

/**
 * TextField
 *
 * 사용자의 텍스트 입력값을 부모가 제어할 수 있게 렌더링하는 공용 입력 컴포넌트.
 * - 내부 state 없이 value/onChange로 완전 제어(Controlled UI)됩니다.
 * - errorMessage에 문자열이 전달되면 자동으로 오류 상태(border, aria-invalid, aria-describedby)로 전환합니다.
 * - validation 로직, API 호출, 전역 상태 접근은 이 컴포넌트의 책임 밖입니다.
 */
export const TextField = ({
  id: externalId,
  name,
  value,
  onChange,
  variant = 'field',
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  readOnly = false,
  required = false,
  type = 'text',
  leftIcon,
  rightIcon,
  className = '',
  onClear,
}: TextFieldProps) => {
  const generatedId = useId()
  const inputId = externalId ?? generatedId
  const descriptionId = `${inputId}-description`

  const isError = Boolean(errorMessage && errorMessage.length > 0)
  const isSearch = variant === 'search'
  const showClearButton = isSearch && onClear && value.length > 0

  // ─── Border 색상 ───
  // 오류: Pink-30 | 기본: Gray-2
  const borderClass = isError ? 'border-Pink-30' : 'border-Gray-2'

  // ─── focus-within & hover 테두리: 오류 상태가 아닐 때만 적용 ───
  const wrapperFocusClass =
    !isError && !disabled ? 'focus-within:border-Yellow-50 hover:border-Yellow-50' : ''

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`pretendard-Body2-Regular ${disabled ? 'text-Gray-5' : 'text-Gray-9'}`}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-Pink-30 ml-0.5">
              *
            </span>
          )}
        </label>
      )}

      {/* Input Wrapper */}
      <div
        className={[
          'flex h-11.75 w-full items-center gap-3',
          'bg-White rounded-[20px] border',
          'px-6 py-3 transition-colors duration-150',
          borderClass,
          wrapperFocusClass,
          disabled ? 'cursor-not-allowed opacity-40' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* 왼쪽 아이콘: 전달된 leftIcon 우선, variant="search"이면 검색 아이콘 기본 표시 */}
        {(leftIcon || isSearch) && (
          <span className="text-Gray-5 flex shrink-0 items-center">
            {leftIcon ?? <Icon name="search" size={20} isDecorative />}
          </span>
        )}

        {/* Input */}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={isError}
          aria-describedby={isError || helperText ? descriptionId : undefined}
          aria-label={!label ? placeholder : undefined}
          className={[
            'pretendard-Body2-Medium min-w-0 flex-1 bg-transparent',
            isError ? 'text-Pink-30' : 'text-Gray-9',
            'placeholder:text-Gray-5',
            'outline-none focus-visible:outline-none',
            disabled ? 'cursor-not-allowed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* 오른쪽: Search Clear 버튼 우선, 그 다음 에러 아이콘, 마지막으로 rightIcon */}
        {showClearButton ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="입력 내용 지우기"
            className="text-Gray-5 hover:text-Gray-8 focus-visible:ring-Yellow-45 flex shrink-0 items-center focus-visible:ring-2 focus-visible:outline-none"
          >
            <Icon name="close" size={20} isDecorative />
          </button>
        ) : isError ? (
          <span className="text-Pink-30 flex shrink-0 items-center">
            <Icon name="alert-circle" size={20} isDecorative />
          </span>
        ) : (
          rightIcon && <span className="text-Gray-5 flex shrink-0 items-center">{rightIcon}</span>
        )}
      </div>

      {/* Helper / Error 텍스트 */}
      {(isError || helperText) && (
        <span
          id={descriptionId}
          role={isError ? 'alert' : undefined}
          className={`pretendard-Caption2 ${isError ? 'text-Pink-30' : 'text-Gray-6'}`}
        >
          {isError ? errorMessage : helperText}
        </span>
      )}
    </div>
  )
}
