'use client';

import useScreenSize from '@/hooks/useScreenSize';
import Loader from '@/components/ui/Loader';
import FourNotFound from '@/app/four04/404';

export default function NotFound() {
  const size = useScreenSize();

  if (size === null) return <Loader />;
  return <FourNotFound isMobile={size === 'mobile'} />;
}
