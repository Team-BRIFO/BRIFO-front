export interface NewsPublishedTimeProps {
  time: string
  className?: string
}

export function NewsPublishedTime({ time, className = '' }: NewsPublishedTimeProps) {
  return <time className={`text-Gray-5 pretendard-Caption2 ${className}`}>{time}</time>
}
