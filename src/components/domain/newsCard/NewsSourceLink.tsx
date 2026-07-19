export interface NewsSourceLinkProps {
  source: string
  className?: string
}

export function NewsSourceLink({ source, className = '' }: NewsSourceLinkProps) {
  return <span className={`text-Gray-5 pretendard-Caption2 ${className}`}>{source}</span>
}
