import { useNavigate } from 'react-router-dom';
import type { Exercise } from '../types';
import { EvidencePill } from './EvidencePill';
import { BandChip } from './BandChip';
import { VideoEmbed } from './VideoEmbed';
import { PrescriptionBlock } from './PrescriptionBlock';

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  const navigate = useNavigate();
  const location = `${exercise.subArea.zoneName.toUpperCase()} / ${exercise.subArea.name.toUpperCase()}`;

  return (
    <article className="exercise-card" aria-labelledby="ex-name">
      <button
        type="button"
        className="ex-back"
        onClick={() => navigate(-1)}
        aria-label="Back to body map"
      >
        <span aria-hidden="true">‹</span>
        <span>Back</span>
      </button>

      <div className="ex-location">{location}</div>
      <h2 className="ex-name" id="ex-name">
        {exercise.name}
      </h2>

      <EvidencePill evidence={exercise.evidence} />

      <VideoEmbed
        videoId={exercise.videoId}
        videoUrl={exercise.videoUrl}
        exerciseName={exercise.name}
      />

      <section className="ex-section">
        <p className="ex-why">{exercise.mechanism}</p>
      </section>

      <PrescriptionBlock
        sets={exercise.sets}
        reps={exercise.reps}
        tempo={exercise.tempo}
        frequency={exercise.frequency}
      />

      <BandChip band={exercise.band} />

      <section className="ex-section">
        <h3 className="ex-h3">Instructions</h3>
        <ol className="ex-steps">
          {exercise.instructions.map((step, i) => (
            <li key={i}>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <details className="ex-collapse">
        <summary>
          <span>Target muscles</span>
          <span className="acc-chev" aria-hidden="true"></span>
        </summary>
        <div className="ex-collapse-body">
          <p className="ex-why" style={{ fontSize: 14 }}>{exercise.targetMuscles}</p>
        </div>
      </details>

      <details className="ex-collapse">
        <summary>
          <span>
            <svg
              className="warn-icon"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <path d="M8 2 L14 13 L2 13 Z" />
              <path d="M8 7 L8 10" />
              <circle cx="8" cy="11.5" r="0.3" fill="currentColor" />
            </svg>
            {' '}Common mistakes
          </span>
          <span className="acc-chev" aria-hidden="true"></span>
        </summary>
        <div className="ex-collapse-body">
          <ul className="ex-bullets">
            {exercise.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </details>

      {exercise.beginnerModification && (
        <details className="ex-collapse">
          <summary>
            <span>For beginners or in acute pain</span>
            <span className="acc-chev" aria-hidden="true"></span>
          </summary>
          <div className="ex-collapse-body">{exercise.beginnerModification}</div>
        </details>
      )}

      <aside className="contraindications" role="note">
        <div className="ci-label">Contraindications</div>
        <div className="ci-body">{exercise.contraindications.join(' · ')}</div>
      </aside>

      <details className="ex-collapse">
        <summary>
          <span>Full citation</span>
          <span className="acc-chev" aria-hidden="true"></span>
        </summary>
        <div className="ex-collapse-body">
          <div className="cit-text">{exercise.evidence.full}</div>
        </div>
      </details>
    </article>
  );
}
