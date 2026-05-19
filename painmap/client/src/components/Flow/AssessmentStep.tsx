import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { AssessmentAnswers } from '../../flow/types';

interface Props {
  initial: AssessmentAnswers;
  onSubmit: (answers: AssessmentAnswers) => void;
}

export function AssessmentStep({ initial, onSubmit }: Props) {
  const [form, setForm] = useState<AssessmentAnswers>(initial);

  const answered = useMemo(() => {
    let n = 0;
    if (form.painIntensity >= 1) n += 1;
    if (form.painDuration) n += 1;
    if (form.symptomBehavior) n += 1;
    if (form.deskHours) n += 1;
    if (form.movementBreaks) n += 1;
    if (form.equipmentAccess) n += 1;
    n += 1; // red-flag block is always considered answered
    return n;
  }, [form]);

  const progress = Math.round((answered / 7) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 2</p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Quick discomfort assessment</h2>
        </div>
        <div className="w-36">
          <div className="mb-1 flex justify-between text-[11px] text-ink-muted">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-rule">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <label className="grid gap-1 text-sm text-ink">
          Pain intensity (1-10)
          <input
            type="range"
            min={1}
            max={10}
            value={form.painIntensity}
            onChange={(e) => setForm((prev) => ({ ...prev, painIntensity: Number(e.target.value) }))}
          />
          <span className="text-xs text-ink-muted">Current: {form.painIntensity}/10</span>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          Pain duration
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.painDuration}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, painDuration: e.target.value as AssessmentAnswers['painDuration'] }))
            }
          >
            <option value="acute">Acute (&lt;2 weeks)</option>
            <option value="subacute">Subacute (2-12 weeks)</option>
            <option value="chronic">Chronic (&gt;12 weeks)</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          Symptom behavior
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.symptomBehavior}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, symptomBehavior: e.target.value as AssessmentAnswers['symptomBehavior'] }))
            }
          >
            <option value="betterWithMovement">Improves with movement</option>
            <option value="mixed">Mixed response</option>
            <option value="worseWithMovement">Worsens with movement</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          Daily desk hours
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.deskHours}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, deskHours: e.target.value as AssessmentAnswers['deskHours'] }))
            }
          >
            <option value="lt4">Less than 4</option>
            <option value="4to6">4-6</option>
            <option value="6to8">6-8</option>
            <option value="gt8">More than 8</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          Movement breaks per work block
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.movementBreaks}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, movementBreaks: e.target.value as AssessmentAnswers['movementBreaks'] }))
            }
          >
            <option value="rarely">Rarely</option>
            <option value="1to2">1-2 breaks</option>
            <option value="3plus">3+ breaks</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          Equipment access
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.equipmentAccess}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, equipmentAccess: e.target.value as AssessmentAnswers['equipmentAccess'] }))
            }
          >
            <option value="none">No bands yet</option>
            <option value="lightBand">One light band</option>
            <option value="fullSet">Full resistance-band set</option>
          </select>
        </label>

        <fieldset className="rounded-xl border border-rule p-3">
          <legend className="px-1 text-sm text-ink">Red-flag symptoms</legend>
          <div className="grid gap-2 text-sm text-ink">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.redFlags.recentTrauma}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    redFlags: { ...prev.redFlags, recentTrauma: e.target.checked },
                  }))
                }
              />
              Recent trauma
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.redFlags.radiatingSymptoms}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    redFlags: { ...prev.redFlags, radiatingSymptoms: e.target.checked },
                  }))
                }
              />
              Radiating numbness/tingling or weakness
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.redFlags.systemicSymptoms}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    redFlags: { ...prev.redFlags, systemicSymptoms: e.target.checked },
                  }))
                }
              />
              Fever or unexplained weight loss
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.redFlags.nightPain}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    redFlags: { ...prev.redFlags, nightPain: e.target.checked },
                  }))
                }
              />
              Night pain that wakes you from sleep
            </label>
          </div>
        </fieldset>

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent"
          >
            Continue to analysis
          </button>
        </div>
      </form>
    </motion.section>
  );
}
