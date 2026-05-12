import { useState } from 'react';
import type { Exercise } from '../types';
import { EvidencePill } from './EvidencePill';
import { BandChip } from './BandChip';
import { VideoEmbed } from './VideoEmbed';
import { PrescriptionBlock } from './PrescriptionBlock';

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  const [modOpen, setModOpen] = useState(false);

  const location = `${exercise.subArea.zoneName.toUpperCase()} / ${exercise.subArea.name.toUpperCase()}`;

  return (
    <article className="exercise-card" aria-labelledby="ex-name">
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
        <h3 className="ex-h3">Target muscles</h3>
        <p className="ex-why" style={{ fontSize: 14 }}>{exercise.targetMuscles}</p>
      </section>

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

      <section className="ex-section">
        <h3 className="ex-h3">
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
          Common mistakes
        </h3>
        <ul className="ex-bullets">
          {exercise.commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      {exercise.beginnerModification && (
        <section className="ex-section">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => setModOpen(!modOpen)}
            aria-expanded={modOpen}
          >
            <span>For beginners or in acute pain</span>
            <span className="acc-chev" aria-hidden="true">{modOpen ? '−' : '+'}</span>
          </button>
          {modOpen && <div className="accordion-body">{exercise.beginnerModification}</div>}
        </section>
      )}

      <aside className="contraindications" role="note">
        <div className="ci-label">Contraindications</div>
        <div className="ci-body">{exercise.contraindications.join(' · ')}</div>
      </aside>

      <footer className="citation-footer">
        <div className="cit-label">Full citation</div>
        <div className="cit-text">{exercise.evidence.full}</div>
      </footer>
    </article>
  );
}
