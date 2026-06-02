import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">{t('flow.assessment.step')}</p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{t('flow.assessment.heading')}</h2>
        </div>
        <div className="text-right text-xs text-ink-muted">
          <p>{t('flow.assessment.timeNote')}</p>
          <p>{t('flow.assessment.questionCount')}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onChangeArea}
          className="rounded-xl border border-rule bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink hover:bg-bg"
        >
          {t('flow.assessment.changeArea')}
        </button>
        <button
          type="submit"
          form="assessment-step-form"
          disabled={redFlagPresent}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-bg transition enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('flow.assessment.submit')}
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
          {t('flow.assessment.severityLabel')}
          <input
            type="range"
            min={0}
            max={10}
            value={form.painIntensity}
            onChange={(e) => setForm((prev) => ({ ...prev, painIntensity: Number(e.target.value) }))}
          />
          <span className="text-xs text-ink-muted">{t('flow.scale.current', { value: form.painIntensity })}</span>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          {t('flow.assessment.durationLabel')}
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.painDuration}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, painDuration: e.target.value as AssessmentAnswers['painDuration'] }))
            }
          >
            <option value="lt1w">{t('flow.assessment.durationOption.lt1w')}</option>
            <option value="1to6w">{t('flow.assessment.durationOption.1to6w')}</option>
            <option value="gt6w">{t('flow.assessment.durationOption.gt6w')}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          {t('flow.assessment.aggravatingLabel')}
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.aggravatingMovement}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, aggravatingMovement: e.target.value as AssessmentAnswers['aggravatingMovement'] }))
            }
          >
            <option value="overheadReach">{t('flow.assessment.aggravatingOption.overheadReach')}</option>
            <option value="sittingLong">{t('flow.assessment.aggravatingOption.sittingLong')}</option>
            <option value="typingMouse">{t('flow.assessment.aggravatingOption.typingMouse')}</option>
            <option value="liftingCarry">{t('flow.assessment.aggravatingOption.liftingCarry')}</option>
            <option value="stairsWalk">{t('flow.assessment.aggravatingOption.stairsWalk')}</option>
            <option value="bendingTwisting">{t('flow.assessment.aggravatingOption.bendingTwisting')}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-ink">
          {t('flow.assessment.equipmentLabel')}
          <select
            className="rounded-lg border border-rule bg-bg px-3 py-2"
            value={form.equipmentAccess}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, equipmentAccess: e.target.value as AssessmentAnswers['equipmentAccess'] }))
            }
          >
            <option value="bandOnly">{t('flow.assessment.equipmentOption.bandOnly')}</option>
            <option value="bandAndChair">{t('flow.assessment.equipmentOption.bandAndChair')}</option>
            <option value="fullSet">{t('flow.assessment.equipmentOption.fullSet')}</option>
          </select>
        </label>

        <fieldset className="rounded-xl border border-rule p-3">
          <legend className="px-1 text-sm text-ink">{t('flow.assessment.redFlagLegend')}</legend>
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
              {t('flow.assessment.redFlag.recentTrauma')}
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
              {t('flow.assessment.redFlag.radiatingSymptoms')}
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
              {t('flow.assessment.redFlag.systemicSymptoms')}
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
              {t('flow.assessment.redFlag.nightPain')}
            </label>
          </div>
        </fieldset>

        {redFlagPresent && (
          <div className="rounded-xl border border-accent bg-accent-soft p-3 text-sm text-ink">
            {t('flow.assessment.redFlagWarning')}
            <div className="mt-2">
              <a className="text-accent underline" href="/clinician-finder">{t('flow.assessment.findClinician')}</a>
            </div>
          </div>
        )}

        <div className="h-1" />
      </form>
    </motion.section>
  );
}
