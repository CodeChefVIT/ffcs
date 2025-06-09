"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Slots from './slots'
import SlotsMobile from './slots-mobile'


export default function slots() {
    const size = useScreenSize()

    if (size === 'mobile') return <SlotsMobile />
    return <Slots />
}
