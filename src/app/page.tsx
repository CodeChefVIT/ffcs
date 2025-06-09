"use client"

import useScreenSize from '@/hooks/useScreenSize'
import Landing from './landing/landing'
import LandingMobile from './landing/landing-mobile'


export default function landing() {
	const size = useScreenSize()

	if (size === 'mobile') return <LandingMobile />
	return <Landing />
}