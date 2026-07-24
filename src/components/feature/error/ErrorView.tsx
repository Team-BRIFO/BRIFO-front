import Button from '@/components/common/Button'

export interface ErrorViewProps {
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}

export function ErrorView({ title, description, buttonText, onButtonClick }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-White rounded-xl gap-8 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="pretendard-Subtitle6 text-Gray-10">{title}</h2>
        <p className="pretendard-Body2 whitespace-pre-wrap text-Gray-6">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <Button size="lg" color="primary" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  )
}
