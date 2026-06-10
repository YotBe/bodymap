import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { classifyAssessment } from '../../flow/classifier';
import type { AssessmentAnswers, AssessmentResult } from '../../flow/types';
import { useExercisesByIds, TRACK_EXERCISES } from '../../api/exercises';
import { trackLabelKey, prescriptionLabelKey } from '../../flow/labels';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { PaneEyebrow } from '../PaneEyebrow';

export function AssessmentFlow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();

  const [step, setStep] = useState(0); // 0: intro, 1: red flags, 2: pain profile, 3: pain behavior, 4: work & equip, 5: results
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    painIntensity: 5,
    painDuration: '1to6w',
    symptomBehavior: 'mixed',
    aggravatingMovement: 'sittingLong',
    deskHours: '6to8',
    movementBreaks: '1to2',
    equipmentAccess: 'bandOnly',
    redFlags: {
      recentTrauma: false,
      radiatingSymptoms: false,
      systemicSymptoms: false,
      nightPain: false,
    },
  });

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const trackIds = result
    ? TRACK_EXERCISES[result.primaryTrack] ?? []
    : ['ex-band-shrug', 'ex-chin-tuck-band', 'ex-seated-row', 'ex-banded-glute-bridge'];
  const { data: routineExercises } = useExercisesByIds(trackIds);

  const handleRedFlagChange = (key: keyof AssessmentAnswers['redFlags']) => {
    setAnswers((prev) => ({
      ...prev,
      redFlags: {
        ...prev.redFlags,
        [key]: !prev.redFlags[key],
      },
    }));
  };

  const handleAnswerChange = <K extends keyof AssessmentAnswers>(
    key: K,
    value: AssessmentAnswers[K]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = () => {
    const res = classifyAssessment(answers);
    setResult(res);
    setStep(5);
  };

  const handleSaveFavorites = () => {
    if (!result) return;
    localStorage.setItem('painmap.assessment.result', JSON.stringify({ answers, result }));
    setIsSaved(true);
    setHasSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getTrackName = (track: AssessmentResult['primaryTrack']) => t(trackLabelKey(track));
  const getPrescriptionText = (track: AssessmentResult['primaryTrack']) =>
    t(prescriptionLabelKey(track));

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Step 0: Welcome / Intro
  if (step === 0) {
    return (
      <div className="flow-scroll">
        <PaneEyebrow num="01" label={t('flow.pane.getStarted')} />
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-4"
        >
          <h2 className="font-display text-3xl leading-tight text-ink">{t('assessment.title')}</h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            {t('assessment.intro')}
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <button type="button" className="btn-primary w-full text-center" onClick={handleNext}>
              {t('assessment.start')}
            </button>
            <button
              type="button"
              className="btn-secondary w-full text-center"
              onClick={() => navigate('/flow/map')}
            >
              {t('assessment.back')}
            </button>
          </div>
        </motion.section>
      </div>
    );
  }

  // Step 5: Results View
  if (step === 5 && result) {
    const isHighRisk = result.riskTier === 'high';

    const containerV: Variants = {
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.09,
          delayChildren: reduceMotion ? 0 : 0.05,
        },
      },
    };
    const itemV: Variants = {
      hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0.001 : 0.34, ease: 'easeOut' },
      },
    };

    return (
      <div className="flow-scroll">
        <PaneEyebrow num="02" label={t('pane.exerciseLabel')} />
        <motion.article
          variants={containerV}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5 pb-8"
        >
          {/* Diagnostic Block */}
          <motion.div
            variants={itemV}
            className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b border-rule pb-3">
              <h2 className="font-display text-2xl text-ink">{t('assessment.resultsTitle')}</h2>
              <motion.span
                initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 18, delay: reduceMotion ? 0 : 0.18 }}
                className={`inline-block font-mono text-xs uppercase px-2.5 py-1 rounded ${
                  isHighRisk
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : result.riskTier === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {t('assessment.riskLabel')} {result.riskTier}
              </motion.span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <p className="text-xs font-mono text-ink-muted uppercase">{t('assessment.trackLabel')}</p>
                <p className="font-display text-lg text-ink">{getTrackName(result.primaryTrack)}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-ink-muted uppercase">{t('assessment.durationLabel')}</p>
                <p className="font-display text-lg text-ink">
                  {t('assessment.minutes', { count: result.sessionMinutes })}
                </p>
              </div>
            </div>

            {isHighRisk && (
              <div className="rounded-lg border border-accent/30 bg-accent-soft p-4 text-sm text-ink-muted mt-2">
                <p className="font-bold text-accent mb-1">⚠️ {t('assessment.trackClinician')}</p>
                <p>{t('assessment.clinicianWarning')}</p>
              </div>
            )}

            {/* Rationale list */}
            {result.rationale.length > 0 && (
              <div className="border-t border-rule pt-3 mt-1">
                <h3 className="text-xs font-mono text-ink-muted uppercase mb-2">
                  {t('assessment.rationaleTitle')}
                </h3>
                <ul className="list-disc pl-4 text-xs text-ink-muted flex flex-col gap-1.5 leading-relaxed">
                  {result.rationale.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {!isHighRisk && (
              <button
                type="button"
                className="btn-secondary w-full text-center mt-3 text-xs"
                onClick={handleSaveFavorites}
              >
                {isSaved ? t('assessment.savedSuccess') : t('assessment.saveFavorites')}
              </button>
            )}
            {!isHighRisk && hasSaved && (
              <motion.button
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="btn-primary w-full text-center mt-1 text-xs"
                onClick={() => navigate('/routine')}
              >
                {t('assessment.viewRoutine')}
              </motion.button>
            )}
          </motion.div>

          {/* Routine Exercises List */}
          {!isHighRisk && (
            <motion.div
              variants={itemV}
              className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-4"
            >
              <h3 className="font-display text-xl text-ink">{t('assessment.routineTitle')}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {t('assessment.routineText', {
                  track: getTrackName(result.primaryTrack),
                  intensity: result.intensity,
                })}
              </p>

              <motion.div className="flex flex-col gap-2.5 mt-2" variants={containerV}>
                {routineExercises?.map((ex) => (
                  <motion.div
                    key={ex.id}
                    variants={itemV}
                    className="flex justify-between items-center border border-rule rounded-xl p-3 bg-bg/50 hover:bg-bg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-ink truncate">{ex.name}</p>
                      <p className="text-xs font-mono text-ink-muted mt-1">
                        {getPrescriptionText(result.primaryTrack)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary py-1.5 px-3 text-xs flex-shrink-0"
                      onClick={() => navigate(`/exercise/${ex.id}`)}
                    >
                      {t('assessment.viewExercise')}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          <motion.div variants={itemV} className="flex gap-3">
            <button
              type="button"
              className="btn-secondary w-full text-center"
              onClick={() => {
                setResult(null);
                setStep(1);
              }}
            >
              {t('assessment.back')}
            </button>
            <button
              type="button"
              className="btn-primary w-full text-center"
              onClick={() => navigate('/flow/map')}
            >
              {t('notFound.returnHome')}
            </button>
          </motion.div>
        </motion.article>
      </div>
    );
  }

  // Multi-step questionnaire forms
  return (
    <div className="flow-scroll">
      <PaneEyebrow num={`01.${step}`} label={t('flow.pane.getStarted')} />
      <div className="relative overflow-hidden min-h-[380px] flex flex-col justify-between rounded-2xl border border-rule bg-surface p-6 shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-start gap-4"
          >
            {/* Step 1: Red Flags / Safety Screen */}
            {step === 1 && (
              <>
                <h3 className="font-display text-2xl text-ink leading-snug">
                  {t('assessment.qRedFlags')}
                </h3>
                <div className="flex flex-col gap-3 mt-2">
                  <label className="flex items-start gap-3 p-3 border border-rule rounded-xl cursor-pointer hover:bg-bg/40 transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={answers.redFlags.recentTrauma}
                      onChange={() => handleRedFlagChange('recentTrauma')}
                    />
                    <span className="text-sm text-ink">{t('assessment.rfTrauma')}</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-rule rounded-xl cursor-pointer hover:bg-bg/40 transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={answers.redFlags.radiatingSymptoms}
                      onChange={() => handleRedFlagChange('radiatingSymptoms')}
                    />
                    <span className="text-sm text-ink">{t('assessment.rfRadiating')}</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-rule rounded-xl cursor-pointer hover:bg-bg/40 transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={answers.redFlags.systemicSymptoms}
                      onChange={() => handleRedFlagChange('systemicSymptoms')}
                    />
                    <span className="text-sm text-ink">{t('assessment.rfSystemic')}</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-rule rounded-xl cursor-pointer hover:bg-bg/40 transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={answers.redFlags.nightPain}
                      onChange={() => handleRedFlagChange('nightPain')}
                    />
                    <span className="text-sm text-ink">{t('assessment.rfNight')}</span>
                  </label>
                </div>
              </>
            )}

            {/* Step 2: Pain Profile (Intensity & Duration) */}
            {step === 2 && (
              <>
                <h3 className="font-display text-2xl text-ink leading-snug">
                  {t('assessment.qIntensity')}
                </h3>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex justify-between font-mono text-xs text-ink-muted">
                    <span>1 (Mild)</span>
                    <span className="text-lg font-bold text-accent">{answers.painIntensity}</span>
                    <span>10 (Severe)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={answers.painIntensity}
                    onChange={(e) => handleAnswerChange('painIntensity', Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer h-2 bg-rule rounded-lg appearance-none"
                  />
                </div>

                <h3 className="font-display text-xl text-ink leading-snug mt-4">
                  {t('assessment.qDuration')}
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  {(['lt1w', '1to6w', 'gt6w'] as const).map((duration) => (
                    <label
                      key={duration}
                      className="flex items-center gap-3 p-3 border border-rule rounded-xl cursor-pointer hover:bg-bg/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="painDuration"
                        checked={answers.painDuration === duration}
                        onChange={() => handleAnswerChange('painDuration', duration)}
                      />
                      <span className="text-sm text-ink">
                        {duration === 'lt1w'
                          ? t('assessment.durationLt1w')
                          : duration === '1to6w'
                            ? t('assessment.duration1to6w')
                            : t('assessment.durationGt6w')}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Pain Behavior & Aggravating Movements */}
            {step === 3 && (
              <>
                <h3 className="font-display text-2xl text-ink leading-snug">
                  {t('assessment.qBehavior')}
                </h3>
                <div className="flex flex-col gap-2 mt-1">
                  {(['betterWithMovement', 'worseWithMovement', 'mixed'] as const).map((behavior) => (
                    <label
                      key={behavior}
                      className="flex items-center gap-3 p-3 border border-rule rounded-xl cursor-pointer hover:bg-bg/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="symptomBehavior"
                        checked={answers.symptomBehavior === behavior}
                        onChange={() => handleAnswerChange('symptomBehavior', behavior)}
                      />
                      <span className="text-sm text-ink">
                        {behavior === 'betterWithMovement'
                          ? t('assessment.behaviorBetter')
                          : behavior === 'worseWithMovement'
                            ? t('assessment.behaviorWorse')
                            : t('assessment.behaviorMixed')}
                      </span>
                    </label>
                  ))}
                </div>

                <h3 className="font-display text-xl text-ink leading-snug mt-3">
                  {t('assessment.qAggravating')}
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(
                    [
                      'sittingLong',
                      'overheadReach',
                      'typingMouse',
                      'liftingCarry',
                      'bendingTwisting',
                      'stairsWalk',
                    ] as const
                  ).map((movement) => (
                    <label
                      key={movement}
                      className="flex items-center gap-2 p-2 border border-rule rounded-lg cursor-pointer hover:bg-bg/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="aggravatingMovement"
                        checked={answers.aggravatingMovement === movement}
                        onChange={() => handleAnswerChange('aggravatingMovement', movement)}
                      />
                      <span className="text-xs text-ink">
                        {movement === 'sittingLong'
                          ? t('assessment.aggSitting')
                          : movement === 'overheadReach'
                            ? t('assessment.aggOverhead')
                            : movement === 'typingMouse'
                              ? t('assessment.aggTyping')
                              : movement === 'liftingCarry'
                                ? t('assessment.aggLifting')
                                : movement === 'bendingTwisting'
                                  ? t('assessment.aggBending')
                                  : t('assessment.aggStairs')}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Step 4: Desk Lifestyle & Equipment */}
            {step === 4 && (
              <>
                <h3 className="font-display text-lg text-ink leading-snug">
                  {t('assessment.qDesk')}
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['lt4', '4to6', '6to8', 'gt8'] as const).map((hours) => (
                    <label
                      key={hours}
                      className="flex items-center gap-2 p-2 border border-rule rounded-lg cursor-pointer hover:bg-bg/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="deskHours"
                        checked={answers.deskHours === hours}
                        onChange={() => handleAnswerChange('deskHours', hours)}
                      />
                      <span className="text-xs text-ink">
                        {hours === 'lt4'
                          ? t('assessment.deskLt4')
                          : hours === '4to6'
                            ? t('assessment.desk4to6')
                            : hours === '6to8'
                              ? t('assessment.desk6to8')
                              : t('assessment.deskGt8')}
                      </span>
                    </label>
                  ))}
                </div>

                <h3 className="font-display text-lg text-ink leading-snug mt-2">
                  {t('assessment.qBreaks')}
                </h3>
                <div className="flex flex-col gap-1.5 mt-1">
                  {(['3plus', '1to2', 'rarely'] as const).map((breaks) => (
                    <label
                      key={breaks}
                      className="flex items-center gap-2 p-2 border border-rule rounded-lg cursor-pointer hover:bg-bg/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="movementBreaks"
                        checked={answers.movementBreaks === breaks}
                        onChange={() => handleAnswerChange('movementBreaks', breaks)}
                      />
                      <span className="text-xs text-ink">
                        {breaks === '3plus'
                          ? t('assessment.breaks3plus')
                          : breaks === '1to2'
                            ? t('assessment.breaks1to2')
                            : t('assessment.breaksRarely')}
                      </span>
                    </label>
                  ))}
                </div>

                <h3 className="font-display text-lg text-ink leading-snug mt-2">
                  {t('assessment.qEquipment')}
                </h3>
                <div className="flex flex-col gap-1.5 mt-1">
                  {(['bandOnly', 'bandAndChair', 'fullSet'] as const).map((equip) => (
                    <label
                      key={equip}
                      className="flex items-center gap-2 p-2 border border-rule rounded-lg cursor-pointer hover:bg-bg/40 transition-colors"
                    >
                      <input
                        type="radio"
                        name="equipmentAccess"
                        checked={answers.equipmentAccess === equip}
                        onChange={() => handleAnswerChange('equipmentAccess', equip)}
                      />
                      <span className="text-xs text-ink">
                        {equip === 'bandOnly'
                          ? t('assessment.equipBands')
                          : equip === 'bandAndChair'
                            ? t('assessment.equipBandChair')
                            : t('assessment.equipFull')}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6 border-t border-rule pt-4">
          <button type="button" className="btn-secondary w-full text-center" onClick={handleBack}>
            {t('assessment.back')}
          </button>
          {step < 4 ? (
            <button type="button" className="btn-primary w-full text-center" onClick={handleNext}>
              {t('assessment.next')}
            </button>
          ) : (
            <button type="button" className="btn-primary w-full text-center" onClick={handleSubmit}>
              {t('assessment.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
