"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Saved from './saved'
import SavedMobile from './saved-mobile'


export default function SavedPage() {
    const size = useScreenSize()

    // if (!size) return null // or loading
    if (size === 'mobile') return <SavedMobile />
    return <Saved />
}