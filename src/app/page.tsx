"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Landing from './landing/landing'
import LandingMobile from './landing/landing-mobile'
import Loader from '@/components/ui/Loader'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <Loader />;
  if (size === 'mobile') return <LandingMobile />
  return <Landing />
}
