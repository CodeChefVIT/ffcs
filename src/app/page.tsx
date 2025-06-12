"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Landing from './landing/landing'
import LandingMobile from './landing/landing-mobile'
import Loading from './loading/loading'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <Loading />;
  if (size === 'mobile') return <LandingMobile />
  return <Landing />
}
