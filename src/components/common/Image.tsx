import type { ImgHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 반응형 최대 크기 제한
   * 'sm': 모바일 기준 소형 이미지 (max-w-[120px] ~ 200px)
   * 'md': 카드 등 중간 크기 (max-w-[200px] ~ 300px)
   * 'lg': 히어로 이미지 등 큰 크기 (w-full)
   * 'none': 제한 없음
   */
  responsiveSize?: 'sm' | 'md' | 'lg' | 'none'
}

/**
 * 기본적으로 w-full h-auto object-cover가 적용되는 반응형 이미지 컴포넌트
 */
export function Image({ responsiveSize = 'none', className, ...props }: ImageProps) {
  let sizeClasses = ''
  if (responsiveSize === 'sm') {
    sizeClasses = 'max-w-[120px] md:max-w-[200px]'
  } else if (responsiveSize === 'md') {
    sizeClasses = 'max-w-[200px] md:max-w-[300px]'
  } else if (responsiveSize === 'lg') {
    sizeClasses = 'max-w-full md:max-w-[500px]'
  }

  return (
    <img
      loading="lazy"
      className={twMerge('h-auto w-full object-cover', sizeClasses, className)}
      {...props}
    />
  )
}
