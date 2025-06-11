"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Saved from './saved'
import SavedMobile from './saved-mobile'

export default function View() {
  const size = useScreenSize()

  if (size === null) return <div>Loading...</div>;
  if (size === 'mobile') return <SavedMobile />
  return <Saved />
}
