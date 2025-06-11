"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Landing from './landing/landing'
import LandingMobile from './landing/landing-mobile'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <div>Loading...</div>;
  if (size === 'mobile') return <LandingMobile />
  return <Landing />
}
