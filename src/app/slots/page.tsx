"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Slots from './slots'
import SlotsMobile from './slots-mobile'


export default function Home() {
    const size = useScreenSize()

    // if (!size) return null // or loading
    if (size === 'mobile') return <SlotsMobile />
    return <Slots />
}
