"use client"

import useScreenSize from "./hooks/useScreenSize";
import Four04 from './four04/four04'
import Four04Mobile from './four04/four04-mobile'


export default function Home() {
    const size = useScreenSize()

    // if (!size) return null // or loading
    if (size === 'mobile') return <Four04Mobile />
    return <Four04 />
}
