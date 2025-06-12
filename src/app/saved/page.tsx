"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Saved from './saved'
import SavedMobile from './saved-mobile'
import Loading from '../loading/loading'

export default function View() {
  const size = useScreenSize()

  if (size === null) return <Loading />;
  if (size === 'mobile') return <SavedMobile />
  return <Saved />
}
