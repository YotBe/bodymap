import { EmptyState } from '../components/EmptyState';
import { PaneEyebrow } from '../components/PaneEyebrow';
import type { ZoneId } from '../components/BodyMap/zones';

interface Props {
  onPickZone: (zoneId: ZoneId) => void;
}

export function HomePage({ onPickZone }: Props) {
  return (
    <>
      <PaneEyebrow num="02" label="AWAITING SELECTION" />
      <EmptyState onPickZone={onPickZone} />
    </>
  );
}
