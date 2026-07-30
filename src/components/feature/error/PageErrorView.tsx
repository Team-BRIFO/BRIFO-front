import { isAxiosError } from 'axios'

import { ApiError } from '@/api/client/ApiError'
import LoaderIcon from '@/assets/icons/loader-1.svg?react'
import { ErrorView, type ErrorViewProps } from '@/components/feature/error/ErrorView'
import { type AgentStatusMap, Office } from '@/components/feature/office/Office'

interface PageErrorViewProps extends Partial<ErrorViewProps> {
  onRetry?: () => void
  agentStatusMap?: AgentStatusMap
  error?: unknown
  headerText?: string
}

export function PageErrorView({
  error,
  headerText: initialHeaderText,
  title: initialTitle,
  description: initialDescription,
  onRetry,
  agentStatusMap,
  ...props
}: PageErrorViewProps) {
  let headerText = initialHeaderText
  let title = initialTitle ?? '데이터를 불러오지 못했어요'
  let description = initialDescription ?? '잠시 후 다시 시도해 주세요.'

  let status: number | undefined
  let isNetworkError = false

  if (error instanceof ApiError) {
    if (error.kind === 'network') isNetworkError = true
    else if (error.kind === 'http') status = error.status
  } else if (isAxiosError(error)) {
    if (!error.response) isNetworkError = true
    else status = error.response.status
  }

  if (isNetworkError) {
    // Network Error
    headerText = '네트워크 연결 오류'
    title = '인터넷이 불안정해요'
    description = '연결 상태를 확인하고\n다시 시도해 주세요.'
  } else if (status === 404) {
    // Not Found
    headerText = '404 Not Found'
    title = '길을 잘못 드셨어요'
    description = '찾는 페이지가 없어요.\n홈으로 돌아갈까요?'
  } else if (status && status >= 500) {
    // Server Error
    headerText = '서버 오류'
    title = '사원이 잠깐 쉬고 있어요'
    description = '서버에 문제가 생겼어요.\n잠시 후 다시 시도해 주세요.'
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto px-4 pt-3 pb-10">
      {headerText && (
        <div className="flex items-center justify-center gap-2.5">
          <LoaderIcon
            className="text-Gray-5 h-4 w-4 animate-spin"
            style={{ animationDuration: '3s' }}
          />
          <span className="pretendard-Caption1 text-Gray-5">{headerText}</span>
        </div>
      )}
      <Office agentStatusMap={agentStatusMap} isOffline={isNetworkError} />
      <ErrorView
        title={title}
        description={<span className="block text-center whitespace-pre-line">{description}</span>}
        buttonText={onRetry ? '다시 시도' : props.buttonText}
        onButtonClick={onRetry ? onRetry : props.onButtonClick}
        {...props}
      />
    </div>
  )
}
