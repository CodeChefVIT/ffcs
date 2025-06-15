"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Shared from './shared'
import SharedMobile from './shared-mobile'
import Loader from '@/components/ui/Loader'

export default function Page() {
  const size = useScreenSize()

  if (size === null) return <Loader />;
  if (size === 'mobile') return <SharedMobile />
  return <Shared />
}
