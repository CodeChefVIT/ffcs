"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Shared from './shared'
import SharedMobile from './shared-mobile'


export default function Home() {
    const size = useScreenSize()

    // if (!size) return null // or loading
    if (size === 'mobile') return <SharedMobile />
    return <Shared />
}
