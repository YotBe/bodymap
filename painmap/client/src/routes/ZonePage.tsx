import { useParams } from 'react-router-dom';
import { ZonePrompt } from '../components/ZonePrompt';
import { PaneEyebrow } from '../components/PaneEyebrow';
import type { ZoneId } from '../components/BodyMap/zones';

interface Props {
  onPickSubArea: (subAreaId: string, primaryExerciseId: string | null) => void;
}

export function ZonePage({ onPickSubArea }: Props) {
  const { zoneId } = useParams<{ zoneId: string }>();
  return (
    <>
      <PaneEyebrow num="02" label="AWAITING SUB-AREA" />
      <ZonePrompt zoneId={(zoneId ?? '') as ZoneId} onPickSubArea={onPickSubArea} />
    </>
  );
}
