import type { ReactNode } from 'react';
import { useViewportGate } from '../hooks/useViewportGate';

interface Props {
  children: ReactNode;
}

export function DesktopOnlyGate({ children }: Props) {
  const tooSmall = useViewportGate();

  if (tooSmall) {
    return (
      <main className="desktop-only-gate">
        <div className="dog-eyebrow">PAINMAP</div>
        <h1 className="dog-title">Optimized for desktop.</h1>
        <p className="dog-sub">
          PainMap relies on a wide body map and side-by-side exercise detail. Open this page on a
          screen at least 1024 px wide to continue.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
