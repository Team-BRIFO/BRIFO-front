import { useState, useEffect } from 'react'

export function useScaleFactor(baseWidth = 360, maxWidth = 768) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = Math.min(window.innerWidth, maxWidth)
      // 화면이 360px보다 작을 때는 1 미만으로, 클 때는 1 이상으로 스케일링
      setScale(currentWidth / baseWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [baseWidth, maxWidth])

  return scale
}
