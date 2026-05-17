import { useTranslation } from 'react-i18next';

interface Props {
  sets: number;
  reps: string;
  tempo: string | null;
  frequency: string;
}

export function PrescriptionBlock({ sets, reps, tempo, frequency }: Props) {
  const { t } = useTranslation();
  return (
    <section className="prescription">
      <div className="rx-col">
        <div className="rx-label">{t('prescription.setsReps')}</div>
        <div className="rx-value">
          {sets} × {reps}
        </div>
      </div>
      <div className="rx-divider" aria-hidden="true" />
      <div className="rx-col">
        <div className="rx-label">{t('prescription.tempo')}</div>
        <div className="rx-value">{tempo ?? '—'}</div>
        {tempo && tempo !== 'Static hold' && (
          <div className="rx-foot">{t('prescription.tempoFoot')}</div>
        )}
      </div>
      <div className="rx-divider" aria-hidden="true" />
      <div className="rx-col">
        <div className="rx-label">{t('prescription.frequency')}</div>
        <div className="rx-value">{frequency}</div>
      </div>
    </section>
  );
}
