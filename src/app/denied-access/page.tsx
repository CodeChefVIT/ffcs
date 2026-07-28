'use client';
import Loader from '@/components/ui/Loader';
import useScreenSize from '@/hooks/useScreenSize';
import AccessDenied from '@/app/denied-access/AccessDenied';

export default function Page() {
  const size = useScreenSize();

  if (size === null) return <Loader />;
  return <AccessDenied isMobile={size === 'mobile'} />;
}
