import { useEffect, useState } from 'react';

const MIN_WIDTH = 1024;

export function useViewportGate(): boolean {
  const [tooSmall, setTooSmall] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MIN_WIDTH
  );

  useEffect(() => {
    const onResize = () => setTooSmall(window.innerWidth < MIN_WIDTH);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return tooSmall;
}
