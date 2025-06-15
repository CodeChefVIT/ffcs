"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Slots from './slots'
import SlotsMobile from './slots-mobile'
import Loader from '@/components/ui/Loader'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <Loader />;
  if (size === 'mobile') return <SlotsMobile />
  return <Slots />
}
