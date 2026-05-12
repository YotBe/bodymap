interface Props {
  sets: number;
  reps: string;
  tempo: string | null;
  frequency: string;
}

export function PrescriptionBlock({ sets, reps, tempo, frequency }: Props) {
  return (
    <section className="prescription">
      <div className="rx-col">
        <div className="rx-label">Sets × Reps</div>
        <div className="rx-value">
          {sets} × {reps}
        </div>
      </div>
      <div className="rx-divider" aria-hidden="true" />
      <div className="rx-col">
        <div className="rx-label">Tempo</div>
        <div className="rx-value">{tempo ?? '—'}</div>
        {tempo && tempo !== 'Static hold' && (
          <div className="rx-foot">eccentric-pause-concentric (s)</div>
        )}
      </div>
      <div className="rx-divider" aria-hidden="true" />
      <div className="rx-col">
        <div className="rx-label">Frequency</div>
        <div className="rx-value">{frequency}</div>
      </div>
    </section>
  );
}
