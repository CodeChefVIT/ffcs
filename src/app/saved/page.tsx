"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Saved from './saved'
import SavedMobile from './saved-mobile'


export default function Page() {
  const size = useScreenSize()

  if (size === 'mobile') return <SavedMobile />
  return <Saved />
}
