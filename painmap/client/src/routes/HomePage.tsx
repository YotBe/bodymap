import { useTranslation } from 'react-i18next';
import { EmptyState } from '../components/EmptyState';
import { PaneEyebrow } from '../components/PaneEyebrow';
import type { ZoneId } from '../components/BodyMap/zones';

interface Props {
  onPickZone: (zoneId: ZoneId) => void;
}

export function HomePage({ onPickZone }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <PaneEyebrow num={t('pane.awaitingNum')} label={t('pane.awaitingSelectionLabel')} />
      <EmptyState onPickZone={onPickZone} />
    </>
  );
}
