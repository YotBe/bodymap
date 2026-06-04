import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Exercise } from '../types';
import { BandChip } from './BandChip';
import { ExerciseAnimation } from './ExerciseAnimation';
import { YouTubeFacade } from './YouTubeFacade';
import { PrescriptionBlock } from './PrescriptionBlock';
import { ZONE_LABELS, type ZoneId } from './BodyMap/zones';
import { hasHebrewOverride } from '../api/exercises';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const CONFETTI_DOTS = [
  { color: '#C8442C', x: -101, y: -123, size: 10 },
  { color: '#2E5C4A', x: 101,  y: -123, size: 8 },
  { color: '#F59E0B', x: -140, y: 17,   size: 9 },
  { color: '#8B5CF6', x: 140,  y: 17,   size: 7 },
  { color: '#C8442C', x: -70,  y: 140,  size: 8 },
  { color: '#2E5C4A', x: 70,   y: 140,  size: 10 },
  { color: '#F59E0B', x: 0,    y: -151, size: 7 },
  { color: '#8B5CF6', x: -151, y: -62,  size: 9 },
  { color: '#C8442C', x: 151,  y: -62,  size: 7 },
  { color: '#2E5C4A', x: 0,    y: 162,  size: 8 },
] as const;

interface Props {
  exercise: Exercise;
  /** Autoplay the demo immediately. Defaults to true on the exercise page. */
  autoStartVideo?: boolean;
}

export function ExerciseCard({ exercise, autoStartVideo = true }: Props) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const zoneId = exercise.subArea.zoneId as ZoneId;
  const localizedZone = t(`zones.${zoneId}`, {
    defaultValue: ZONE_LABELS[zoneId] ?? exercise.subArea.zoneName,
  });
  const location = `${localizedZone.toUpperCase()} / ${exercise.subArea.name.toUpperCase()}`;
  const isHebrew = (i18n.language || 'en').startsWith('he');
  const showTranslationPending = isHebrew && !hasHebrewOverride(exercise.id);

  const totalSets = exercise.sets;
  const [setsDone, setSetsDone] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [copied, setCopied] = useState(false);
  const encouragementIdx = useMemo(() => Math.floor(Math.random() * 5), []);
  const reduceMotion = usePrefersReducedMotion();

  const howToBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const closeInstructions = () => {
    setShowInstructions(false);
    howToBtnRef.current?.focus();
  };

  // Move focus into the dialog when it opens so its Escape handler (which stops
  // propagation) intercepts the key before the page-level Escape navigation.
  useEffect(() => {
    if (showInstructions) modalRef.current?.focus();
  }, [showInstructions]);

  const finishSet = () => {
    setSetsDone((n) => {
      const next = Math.min(n + 1, totalSets);
      if (next >= totalSets) setFinished(true);
      return next;
    });
  };

  const restart = () => {
    setSetsDone(0);
    setFinished(false);
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. non-HTTPS dev)
    }
  }, []);

  // Done state — shown after the last set, or when "Finish exercise" is tapped.
  if (finished) {
    return (
      <article className="exercise-card exercise-done" aria-labelledby="ex-done-title">
        {/* Confetti burst, centered over the check mark */}
        <div className="done-confetti" aria-hidden="true">
          {CONFETTI_DOTS.map((dot, i) => (
            <span
              key={i}
              className="done-confetti-dot"
              style={{
                background: dot.color,
                width: dot.size,
                height: dot.size,
                '--dx': `${dot.x}px`,
                '--dy': `${dot.y}px`,
                animationDelay: `${0.12 + i * 0.04}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <motion.div
          className="done-card"
          initial={{ scale: 0.82, opacity: 0, y: 28 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <motion.div
            className="done-check"
            aria-hidden="true"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 16, delay: 0.15 }}
          >
            ✓
          </motion.div>

          <motion.div
            className="done-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.28 }}
          >
            {location}
          </motion.div>

          <motion.h2
            className="done-title"
            id="ex-done-title"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.28 }}
          >
            {t('exercise.doneTitle')}
          </motion.h2>

          <motion.p
            className="done-encouragement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.46, duration: 0.28 }}
          >
            {t(`exercise.encouragement${encouragementIdx}` as const)}
          </motion.p>

          <motion.div
            className="done-stats"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.28 }}
          >
            <div className="done-stat">
              <span className="done-stat-num">{totalSets}</span>
              <span className="done-stat-label">{t('exercise.statSets')}</span>
            </div>
            <span className="done-stat-div" aria-hidden="true" />
            <div className="done-stat">
              <span className="done-stat-num">{exercise.reps}</span>
              <span className="done-stat-label">{t('exercise.statReps')}</span>
            </div>
          </motion.div>

          <motion.p
            className="done-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58, duration: 0.28 }}
          >
            {exercise.name}
          </motion.p>

          <motion.div
            className="done-actions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64, duration: 0.28 }}
          >
            <button type="button" className="btn-primary" onClick={() => navigate('/flow/map')}>
              {t('exercise.pickAnother')}
            </button>
            <button type="button" className="btn-secondary" onClick={restart}>
              {t('exercise.again')}
            </button>
          </motion.div>
        </motion.div>
      </article>
    );
  }

  return (
    <article className="exercise-card exercise-card-v2" aria-labelledby="ex-name">
      <div className="ex-nav">
        <button
          type="button"
          className="ex-back"
          onClick={() => navigate(-1)}
          aria-label={t('exercise.backAria')}
        >
          <span aria-hidden="true">‹</span>
          <span>{t('exercise.back')}</span>
        </button>
        <button
          type="button"
          className="ex-copy-link"
          onClick={handleCopyLink}
          aria-label={t('exercise.copyLinkAria')}
        >
          {copied ? t('exercise.linkCopied') : t('exercise.copyLink')}
        </button>
      </div>

      <header className="ex-header">
        <div className="ex-location">{location}</div>
        <h2 className="ex-name" id="ex-name">
          {exercise.name}
        </h2>
        <p className="ex-target">{exercise.targetMuscles}</p>
        {showTranslationPending && (
          <div className="translation-pending" role="note">
            {t('exercise.translationPending')}
          </div>
        )}
      </header>

      <div className="ex-demo">
        {exercise.videoUrl ? (
          <YouTubeFacade
            videoUrl={exercise.videoUrl}
            title={exercise.name}
            autoStart={autoStartVideo}
          />
        ) : (
          <ExerciseAnimation
            exerciseId={exercise.id}
            exerciseName={exercise.name}
            mp4Url={exercise.demoVideoMp4}
            lottieUrl={exercise.demoLottie}
            reps={exercise.reps}
          />
        )}
      </div>

      <div className="ex-meta">
        <div className="ex-rx">
          <PrescriptionBlock
            sets={exercise.sets}
            reps={exercise.reps}
            tempo={exercise.tempo}
            frequency={exercise.frequency}
          />
        </div>
        <div className="ex-band">
          <BandChip band={exercise.band} />
        </div>
      </div>

      <div className="ex-actions">
        <button
          ref={howToBtnRef}
          type="button"
          className="ex-howto"
          onClick={() => setShowInstructions(true)}
        >
          {t('exercise.howTo')}
        </button>
        <div className="ex-finish">
          <div className="ex-setprogress">
            <div
              className="ex-setdots"
              role="img"
              aria-label={t('exercise.setProgress', { done: setsDone, total: totalSets })}
            >
              {Array.from({ length: totalSets }).map((_, i) => {
                const isDone = i < setsDone;
                return (
                  <motion.span
                    key={i}
                    className={isDone ? 'set-dot is-done' : 'set-dot'}
                    aria-hidden="true"
                    animate={{ scale: isDone ? (reduceMotion ? 1.05 : [1, 1.4, 1.05]) : 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.4, times: [0, 0.6, 1], ease: 'easeOut' }
                    }
                  />
                );
              })}
            </div>
            <span className="ex-setcount" aria-hidden="true">
              <motion.span
                key={setsDone}
                className="ex-setcount-done"
                initial={reduceMotion ? false : { scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 480, damping: 18 }}
              >
                {setsDone}
              </motion.span>
              <span>/{totalSets}</span>
            </span>
          </div>
          <motion.button
            type="button"
            className="btn-secondary ex-finish-set"
            onClick={finishSet}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          >
            {t('exercise.finishSet')}
          </motion.button>
          <motion.button
            type="button"
            className="btn-primary"
            onClick={() => setFinished(true)}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          >
            {t('exercise.finishExercise')}
          </motion.button>
        </div>
      </div>

      <aside className="ex-contra contraindications" role="note">
        <div className="ci-label">{t('exercise.contraindications')}</div>
        <div className="ci-body">{exercise.contraindications.join(' · ')}</div>
      </aside>

      <div className="ex-evidence">
        <button
          type="button"
          className="ev-toggle"
          onClick={() => setShowEvidence((v) => !v)}
          aria-expanded={showEvidence}
        >
          <span className="ev-short">{exercise.evidence.short}</span>
          <span aria-hidden="true">{showEvidence ? '▲' : '▼'}</span>
        </button>
        {showEvidence && (
          <div className="ev-body">
            <p className="ev-summary">{exercise.evidence.summary}</p>
            <p className="ev-full">{exercise.evidence.full}</p>
          </div>
        )}
      </div>

      {showInstructions && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeInstructions();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              closeInstructions();
            }
          }}
        >
          <div
            ref={modalRef}
            className="modal modal-instructions"
            role="dialog"
            aria-modal="true"
            aria-label={t('exercise.instructionsTitle')}
            tabIndex={-1}
          >
            <div className="modal-eyebrow">{exercise.name}</div>
            <h2 className="modal-title">{t('exercise.instructionsTitle')}</h2>
            <ol className="ex-steps modal-steps">
              {exercise.instructions.map((step, i) => (
                <li key={i}>
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
            {exercise.commonMistakes.length > 0 && (
              <div className="modal-mistakes">
                <h3 className="ex-h3">{t('exercise.commonMistakes')}</h3>
                <ul className="ex-bullets">
                  {exercise.commonMistakes.slice(0, 4).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={closeInstructions}
              >
                {t('exercise.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
