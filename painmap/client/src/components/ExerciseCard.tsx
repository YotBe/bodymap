import { useState } from 'react';
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
  /** Autoplay the demo immediately (used when arriving straight from the map). */
  autoStartVideo?: boolean;
}

export function ExerciseCard({ exercise, autoStartVideo = false }: Props) {
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
      <button
        type="button"
        className="ex-back"
        onClick={() => navigate(-1)}
        aria-label={t('exercise.backAria')}
      >
        <span aria-hidden="true">‹</span>
        <span>{t('exercise.back')}</span>
      </button>

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
        <button type="button" className="ex-howto" onClick={() => setShowInstructions(true)}>
          {t('exercise.howTo')}
        </button>
        <div className="ex-finish">
          <span className="ex-setcount">
            {t('exercise.setProgress', { done: setsDone, total: totalSets })}
          </span>
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

      {showInstructions && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t('exercise.instructionsTitle')}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInstructions(false);
          }}
        >
          <div className="modal modal-instructions">
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
                onClick={() => setShowInstructions(false)}
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
