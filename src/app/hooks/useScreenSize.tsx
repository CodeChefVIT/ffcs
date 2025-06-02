import { useEffect, useState } from 'react'
export default function  useScreenSize() {
  const [size, setSize] = useState<'mobile' | 'desktop' | null>(null)

  useEffect(() => {
    const getSize = (width: number) => {
      if (width < 640) return 'mobile'
      else return 'desktop'
    }

    const handleResize = () => {
      setSize(getSize(window.innerWidth))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}