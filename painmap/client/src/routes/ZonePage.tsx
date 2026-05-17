import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ZonePrompt } from '../components/ZonePrompt';
import { PaneEyebrow } from '../components/PaneEyebrow';
import type { ZoneId } from '../components/BodyMap/zones';

interface Props {
  onPickSubArea: (subAreaId: string, primaryExerciseId: string | null) => void;
}

export function ZonePage({ onPickSubArea }: Props) {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { t } = useTranslation();
  return (
    <>
      <PaneEyebrow num={t('pane.awaitingNum')} label={t('pane.awaitingSubAreaLabel')} />
      <ZonePrompt zoneId={(zoneId ?? '') as ZoneId} onPickSubArea={onPickSubArea} />
    </>
  );
}
