import { useTranslation } from 'react-i18next';
import { PaneEyebrow } from '../components/PaneEyebrow';
import { HeroValueProp } from '../components/Flow/HeroValueProp';
import { BodyAreaStep } from '../components/Flow/BodyAreaStep';
import { TrustBoundaries } from '../components/Flow/TrustBoundaries';

interface Props {
  onStartScan: () => void;
  onOpenAssessment: () => void;
}

export function HomePage({ onStartScan, onOpenAssessment }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flow-scroll space-y-4">
      <PaneEyebrow num="01" label={t('flow.pane.getStarted')} />
      <HeroValueProp onStartScan={onStartScan} onOpenAssessment={onOpenAssessment} />
      <TrustBoundaries />
      <BodyAreaStep />
    </div>
  );
}
