"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Slots from './slots'
import SlotsMobile from './slots-mobile'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <div>Loading...</div>;
  if (size === 'mobile') return <SlotsMobile />
  return <Slots />
}
