"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Shared from './shared'
import SharedMobile from './shared-mobile'


export default function Page() {
  const size = useScreenSize()

  if (size === 'mobile') return <SharedMobile />
  return <Shared />
}
