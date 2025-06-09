"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Four04 from './four04/four04'
import Four04Mobile from './four04/four04-mobile'


export default function four04() {
    const size = useScreenSize()

    if (size === 'mobile') return <Four04Mobile />
    return <Four04 />
}
