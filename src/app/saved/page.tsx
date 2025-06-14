"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Saved from './saved'
import SavedMobile from './saved-mobile'
import Loader from '@/components/ui/Loader'

export default function View() {
  const size = useScreenSize()

  if (size === null) return <Loader />;
  if (size === 'mobile') return <SavedMobile />
  return <Saved />
}
