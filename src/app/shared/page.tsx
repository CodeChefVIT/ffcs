"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Shared from './shared'
import SharedMobile from './shared-mobile'
import Loading from '../loading/loading'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <Loading />;
  if (size === 'mobile') return <SharedMobile />
  return <Shared />
}
