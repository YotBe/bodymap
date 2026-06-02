import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AssessmentAnswers } from '../../flow/types';

interface Props {
  initial: AssessmentAnswers;
  onSubmit: (answers: AssessmentAnswers) => void;
  onChangeArea: () => void;
}

function hasRedFlag(answers: AssessmentAnswers): boolean {
  const r = answers.redFlags;
  return r.recentTrauma || r.radiatingSymptoms || r.systemicSymptoms || r.nightPain;
}

export function AssessmentStep({ initial, onSubmit, onChangeArea }: Props) {
  const [form, setForm] = useState<AssessmentAnswers>(initial);
  const redFlagPresent = hasRedFlag(form);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-rule bg-surface p-6 shadow-card"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">STEP 2 OF 3</p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-ink">Quick discomfort intake</h2>
        </div>
        <div className="text-right text-xs text-ink-muted">
          <p>Takes about 2 minutes</p>
          <p>4 quick questions</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onChangeArea}
          className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
        >
          Change pain area
        </button>
        <button
          type="submit"
          form="assessment-step-form"
          disabled={redFlagPresent}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          Get your plan
        </button>
      </div>

      <form
        id="assessment-step-form"
        className="grid gap-4 pb-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!redFlagPresent) onSubmit(form);
        }}
      >
        <label className="grid gap-1 text-sm text-ink">
          Pain severity (0-10)
          <input
            type="range"
            min={0}
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
            <option value="lt1w">Less than 1 week</option>
            <option value="1to6w">1-6 weeks</option>
            <option value="gt6w">More than 6 weeks</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          What usually aggravates it most?
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.aggravatingMovement}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, aggravatingMovement: e.target.value as AssessmentAnswers['aggravatingMovement'] }))
            }
          >
            <option value="overheadReach">Overhead reach</option>
            <option value="sittingLong">Sitting long</option>
            <option value="typingMouse">Typing / mouse work</option>
            <option value="liftingCarry">Lifting / carrying</option>
            <option value="stairsWalk">Walking / stairs</option>
            <option value="bendingTwisting">Bending / twisting</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          Available equipment
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.equipmentAccess}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, equipmentAccess: e.target.value as AssessmentAnswers['equipmentAccess'] }))
            }
          >
            <option value="bandOnly">Resistance band only</option>
            <option value="bandAndChair">Band + chair</option>
            <option value="fullSet">Band set + anchor + chair</option>
          </select>
        </label>

        <fieldset className="rounded-xl border border-rule p-3">
          <legend className="px-1 text-sm text-ink">Red-flag check: any of these?</legend>
          <div className="grid gap-2 text-sm text-ink md:grid-cols-2">
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
              Radiating numbness, tingling, or weakness
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
              Night pain waking you from sleep
            </label>
          </div>
        </fieldset>

        {redFlagPresent && (
          <div className="rounded-xl border border-accent bg-accent-soft p-3 text-sm text-ink">
            One or more red flags were selected. Pause self-guided exercise and see a clinician.
            <div className="mt-2">
              <a className="text-accent underline" href="/clinician-finder">Find a clinician</a>
            </div>
          </div>
        )}

        <div className="h-1" />
      </form>
    </motion.section>
  );
}
