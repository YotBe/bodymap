import { useTranslation } from 'react-i18next';

interface Props {
  /** 1-based index of the step currently on screen. */
  current: number;
  total: number;
}

/**
 * Progress indicator for the multi-step questionnaire. The questionnaire
 * otherwise gives no sense of how much is left, which reads as open-ended.
 */
export function AssessmentStepper({ current, total }: Props) {
  const { t } = useTranslation();
  const label = t('assessment.stepOf', { current, total });

  return (
    <div className="flex items-center gap-3 mb-3" role="group" aria-label={label}>
      <div className="flex gap-1.5 flex-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < current ? 'bg-accent' : 'bg-rule'
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-ink-muted flex-shrink-0">{label}</span>
    </div>
  );
}
