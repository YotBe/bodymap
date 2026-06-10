import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { AssessmentAnswers, AssessmentResult } from '../flow/types';
import { TRACK_EXERCISES, useExercisesByIds } from '../api/exercises';
import { trackLabelKey, prescriptionLabelKey } from '../flow/labels';
import { computeStreak, lastNDays, localDateKey, readCompletionLog } from '../flow/progress';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { PaneEyebrow } from '../components/PaneEyebrow';

interface SavedAssessment {
  answers: AssessmentAnswers;
  result: AssessmentResult;
}

function readSavedAssessment(): SavedAssessment | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('painmap.assessment.result');
    const parsed = raw ? (JSON.parse(raw) as SavedAssessment) : null;
    if (parsed?.result?.primaryTrack) return parsed;
  } catch {
    /* malformed save — treat as absent */
  }
  return null;
}

export function RoutinePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();

  // The route remounts on navigation (fade-stage keyed by pathname), so a
  // read-once snapshot is always fresh when the user lands here.
  const saved = useMemo(readSavedAssessment, []);
  const log = useMemo(readCompletionLog, []);

  const streak = useMemo(() => computeStreak(log), [log]);
  const week = useMemo(() => lastNDays(log, 7), [log]);
  const doneToday = useMemo(() => new Set(log[localDateKey()] ?? []), [log]);
  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' }),
    [i18n.language]
  );

  const trackIds = saved ? TRACK_EXERCISES[saved.result.primaryTrack] ?? [] : [];
  const { data: routineExercises } = useExercisesByIds(trackIds);
  const doneCount = trackIds.filter((id) => doneToday.has(id)).length;

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

  // No saved routine yet — point at the assessment.
  if (!saved || trackIds.length === 0) {
    return (
      <div className="flow-scroll">
        <PaneEyebrow num="03" label={t('routine.eyebrow')} />
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-4"
        >
          <h2 className="font-display text-3xl leading-tight text-ink">
            {t('routine.emptyTitle')}
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">{t('routine.emptySub')}</p>
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              className="btn-primary w-full text-center"
              onClick={() => navigate('/flow/assessment')}
            >
              {t('routine.emptyCta')}
            </button>
            <button
              type="button"
              className="btn-secondary w-full text-center"
              onClick={() => navigate('/flow/map')}
            >
              {t('notFound.returnHome')}
            </button>
          </div>
        </motion.section>
      </div>
    );
  }

  const { result } = saved;

  return (
    <div className="flow-scroll">
      <PaneEyebrow num="03" label={t('routine.eyebrow')} />
      <motion.article
        variants={containerV}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5 pb-8"
      >
        {/* Streak + week header */}
        <motion.div
          variants={itemV}
          className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-4"
        >
          <div className="flex justify-between items-center border-b border-rule pb-3">
            <h2 className="font-display text-2xl text-ink">{t('routine.title')}</h2>
            <span className="inline-block font-mono text-xs uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              {t(trackLabelKey(result.primaryTrack))}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {streak > 0 ? (
              <div className="rt-streak">
                <span className="rt-flame" aria-hidden="true">
                  🔥
                </span>
                <motion.span
                  className="rt-streak-num"
                  initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 520,
                    damping: 18,
                    delay: reduceMotion ? 0 : 0.2,
                  }}
                >
                  {streak}
                </motion.span>
                <span className="rt-streak-label">
                  {t('routine.streak', { count: streak })}
                </span>
              </div>
            ) : (
              <p className="text-sm italic text-ink-muted m-0">{t('routine.streakZero')}</p>
            )}

            <div className="flex flex-col items-center gap-1.5">
              <div className="rt-week" role="img" aria-label={t('routine.thisWeek')}>
                {week.map((day) => (
                  <div key={day.key} className={day.isToday ? 'rt-day is-today' : 'rt-day'}>
                    <span className={day.done ? 'rt-day-dot is-done' : 'rt-day-dot'} />
                    <span className="rt-day-label" aria-hidden="true">
                      {dayLabel.format(day.date)}
                    </span>
                  </div>
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                {t('routine.thisWeek')}
              </span>
            </div>
          </div>

          <div className="border-t border-rule pt-3 flex justify-between items-center">
            <span className="font-mono text-xs text-ink-muted">
              {t('routine.todayCount', { done: doneCount, total: trackIds.length })}
            </span>
            <span className="font-mono text-xs text-ink-muted">
              {t('assessment.minutes', { count: result.sessionMinutes })}
            </span>
          </div>
        </motion.div>

        {/* Exercise list */}
        <motion.div
          variants={itemV}
          className="rounded-2xl border border-rule bg-surface p-6 shadow-card flex flex-col gap-4"
        >
          <h3 className="font-display text-xl text-ink">{t('assessment.routineTitle')}</h3>

          <motion.div className="flex flex-col gap-2.5" variants={containerV}>
            {routineExercises?.map((ex) => {
              const isDone = doneToday.has(ex.id);
              return (
                <motion.div
                  key={ex.id}
                  variants={itemV}
                  className="flex justify-between items-center gap-3 border border-rule rounded-xl p-3 bg-bg/50 hover:bg-bg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isDone && (
                      <motion.span
                        className="rt-row-check"
                        aria-hidden="true"
                        initial={reduceMotion ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 16 }}
                      >
                        ✓
                      </motion.span>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-ink truncate">
                        {ex.name}
                      </p>
                      <p className="text-xs font-mono text-ink-muted mt-1">
                        {t(prescriptionLabelKey(result.primaryTrack))}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${isDone ? 'btn-secondary' : 'btn-primary'} py-1.5 px-3 text-xs flex-shrink-0`}
                    onClick={() => navigate(`/exercise/${ex.id}`)}
                  >
                    {isDone ? t('exercise.again') : t('assessment.viewExercise')}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div variants={itemV} className="flex gap-3">
          <button
            type="button"
            className="btn-secondary w-full text-center"
            onClick={() => navigate('/flow/assessment')}
          >
            {t('routine.retake')}
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
