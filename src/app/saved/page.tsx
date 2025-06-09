"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Shared from './saved'
import SharedMobile from './saved-mobile'


export default function Home() {
    const size = useScreenSize()

    // if (!size) return null // or loading
    if (size === 'mobile') return <SharedMobile />
    return <Shared />
}
