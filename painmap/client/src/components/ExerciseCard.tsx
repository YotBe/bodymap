import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Exercise } from '../types';
import { EvidencePill } from './EvidencePill';
import { BandChip } from './BandChip';
import { ExerciseAnimation } from './ExerciseAnimation';
import { PrescriptionBlock } from './PrescriptionBlock';
import { ZONE_LABELS, type ZoneId } from './BodyMap/zones';
import { hasHebrewOverride } from '../api/exercises';

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const zoneId = exercise.subArea.zoneId as ZoneId;
  const localizedZone = t(`zones.${zoneId}`, {
    defaultValue: ZONE_LABELS[zoneId] ?? exercise.subArea.zoneName,
  });
  const location = `${localizedZone.toUpperCase()} / ${exercise.subArea.name.toUpperCase()}`;
  const isHebrew = (i18n.language || 'en').startsWith('he');
  const showTranslationPending = isHebrew && !hasHebrewOverride(exercise.id);

  return (
    <article className="exercise-card" aria-labelledby="ex-name">
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
        <EvidencePill evidence={exercise.evidence} />
        {showTranslationPending && (
          <div className="translation-pending" role="note">
            {t('exercise.translationPending')}
          </div>
        )}
      </header>

      <div className="ex-demo">
        <ExerciseAnimation
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          mp4Url={exercise.demoVideoMp4}
          lottieUrl={exercise.demoLottie}
          reps={exercise.reps}
        />
        {exercise.videoUrl && (
          <a
            className="video-fallback"
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('video.watchReal')}
          </a>
        )}
      </div>

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

      <section className="ex-instructions">
        <h3 className="ex-h3">{t('exercise.instructions')}</h3>
        <ol className="ex-steps">
          {exercise.instructions.map((step, i) => (
            <li key={i}>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="ex-mistakes">
        <h3 className="ex-h3">
          <svg
            className="warn-icon"
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M8 2 L14 13 L2 13 Z" />
            <path d="M8 7 L8 10" />
            <circle cx="8" cy="11.5" r="0.3" fill="currentColor" />
          </svg>
          {t('exercise.commonMistakes')}
        </h3>
        <ul className="ex-bullets">
          {exercise.commonMistakes.slice(0, 3).map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <aside className="ex-contra contraindications" role="note">
        <div className="ci-label">{t('exercise.contraindications')}</div>
        <div className="ci-body">{exercise.contraindications.join(' · ')}</div>
      </aside>

      <div className="ex-citation citation-footer">
        <div className="cit-label">{t('exercise.fullCitation')}</div>
        <div className="cit-text" title={exercise.evidence.full}>
          {exercise.evidence.full}
        </div>
      </div>
    </article>
  );
}
