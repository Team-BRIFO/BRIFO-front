import { ReactNode } from 'react'

import Button from '@/components/common/Button'

export interface ErrorViewProps {
  title: string
  description: ReactNode
  buttonText?: string
  onButtonClick?: () => void
}

export function ErrorView({ title, description, buttonText, onButtonClick }: ErrorViewProps) {
  return (
    <div className="bg-White flex flex-col items-center justify-center gap-8 rounded-xl px-4 py-7">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="dnf-Subtitle2 text-Gray-10">{title}</h2>
        <p className="pretendard-Caption1 text-Gray-6 leading-[132%]">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <Button size="lg" color="primary" className="w-full" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  )
}
