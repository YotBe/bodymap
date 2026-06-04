import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Exercise } from '../types';
import { BandChip } from './BandChip';
import { ExerciseAnimation } from './ExerciseAnimation';
import { YouTubeFacade } from './YouTubeFacade';
import { PrescriptionBlock } from './PrescriptionBlock';
import { ZONE_LABELS, type ZoneId } from './BodyMap/zones';
import { hasHebrewOverride } from '../api/exercises';

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
        <div className="done-card">
          <div className="done-eyebrow">{location}</div>
          <h2 className="done-title" id="ex-done-title">
            {t('exercise.doneTitle')}
          </h2>
          <p className="done-sub">{t('exercise.doneSub', { name: exercise.name })}</p>
          <div className="done-actions">
            <button type="button" className="btn-primary" onClick={() => navigate('/flow/map')}>
              {t('exercise.pickAnother')}
            </button>
            <button type="button" className="btn-secondary" onClick={restart}>
              {t('exercise.again')}
            </button>
          </div>
        </div>
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
          <div
            className="ex-setdots"
            role="img"
            aria-label={t('exercise.setProgress', { done: setsDone, total: totalSets })}
          >
            {Array.from({ length: totalSets }).map((_, i) => (
              <span key={i} className={i < setsDone ? 'set-dot is-done' : 'set-dot'} aria-hidden="true" />
            ))}
          </div>
          <button type="button" className="btn-secondary ex-finish-set" onClick={finishSet}>
            {t('exercise.finishSet')}
          </button>
          <button type="button" className="btn-primary" onClick={() => setFinished(true)}>
            {t('exercise.finishExercise')}
          </button>
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
