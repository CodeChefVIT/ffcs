import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { metadata } from '@/app/layout';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  try {
    const shareId = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shared-timetable/${shareId}`);
    if (!res.ok) return metadata;

    const data = await res.json();
    const ttName = data?.timetable?.title;
    if (!ttName) return metadata;

    return {
      title: `${ttName} | FFCS-inator`,
      description:
        'Generate priority-based timetables in seconds with FFCS-inator. No hassle. No stress. No more clashes. The smartest way to plan your VIT FFCS.',
      icons: {
        icon: '/logo_ffcs.svg',
      },
      manifest: '/manifest.webmanifest',

      openGraph: {
        title: `${ttName} | FFCS-inator`,
        description:
          'Generate priority-based timetables in seconds with FFCS-inator. No hassle. No stress. No more clashes. The smartest way to plan your VIT FFCS.',
        siteName: 'FFCS-inator',
        type: 'website',
        images: [
          {
            url: '/og-image.png',
            alt: 'FFCS-inator - Timetable Generator for VIT',
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${ttName} | FFCS-inator`,
        description: 'Generate priority-based timetables in seconds with FFCS-inator.',
        images: ['/og-image.png'],
      },
      robots: 'index, follow',
    };
  } catch {
    return metadata;
  }
}

export default function ShareLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
