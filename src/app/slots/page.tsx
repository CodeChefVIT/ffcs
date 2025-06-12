"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Slots from './slots'
import SlotsMobile from './slots-mobile'
import Loading from '../loading/loading'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <Loading />;
  if (size === 'mobile') return <SlotsMobile />
  return <Slots />
}
