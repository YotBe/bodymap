import { PaneEyebrow } from '../components/PaneEyebrow';
import { HeroValueProp } from '../components/Flow/HeroValueProp';
import { BodyAreaStep } from '../components/Flow/BodyAreaStep';
import { TrustBoundaries } from '../components/Flow/TrustBoundaries';

interface Props {
  onStartScan: () => void;
  onOpenAssessment: () => void;
}

export function HomePage({ onStartScan, onOpenAssessment }: Props) {
  return (
    <div className="flow-scroll space-y-4">
      <PaneEyebrow num="01" label="GET STARTED" />
      <HeroValueProp onStartScan={onStartScan} onOpenAssessment={onOpenAssessment} />
      <TrustBoundaries />
      <BodyAreaStep />
    </div>
  );
}
