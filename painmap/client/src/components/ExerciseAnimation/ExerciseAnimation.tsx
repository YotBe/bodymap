import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HumanFigure } from './HumanFigure';
import { ANIMATION_CONFIGS } from './exerciseAnimations';
import './exerciseAnimation.css';

interface Props {
  exerciseId: string;
  exerciseName: string;
}

export function ExerciseAnimation({ exerciseId, exerciseName }: Props) {
  const { t, i18n } = useTranslation();
  const config = ANIMATION_CONFIGS[exerciseId];
  const [paused, setPaused] = useState(false);
  const [slow, setSlow] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setPaused(false);
    setSlow(false);
  }, [exerciseId]);

  if (!config) {
    return (
      <div className="exercise-animation exercise-animation-missing" role="img" aria-label={exerciseName}>
        <div className="ea-stage ea-stage-fallback">
          <span className="ea-fallback-text">{t('animation.unavailable')}</span>
        </div>
      </div>
    );
  }

  const isHebrew = (i18n.language || 'en').startsWith('he');
  const caption = isHebrew && config.captionHe ? config.captionHe : config.caption;
  const durationStyle = {
    ['--ea-duration' as string]: `${slow ? config.durationMs * 2 : config.durationMs}ms`,
    ['--ea-play-state' as string]: paused ? 'paused' : 'running',
  } as React.CSSProperties;

  return (
    <div className="exercise-animation">
      <div
        className={`ea-stage anim-${config.animationClass}`}
        style={durationStyle}
        role="img"
        aria-label={t('animation.aria', { name: exerciseName })}
      >
        <HumanFigure view={config.view} />
        <span className="ea-caption">{caption}</span>
        {paused && <span className="ea-paused-badge">{t('animation.paused')}</span>}
      </div>
      <div className="ea-controls" role="group" aria-label={t('animation.controlsAria')}>
        <button
          type="button"
          className="ea-btn"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? (
            <>
              <PlayIcon />
              <span>{t('animation.play')}</span>
            </>
          ) : (
            <>
              <PauseIcon />
              <span>{t('animation.pause')}</span>
            </>
          )}
        </button>
        <button
          type="button"
          className="ea-btn"
          onClick={() => setSlow((s) => !s)}
          aria-pressed={slow}
        >
          <SpeedIcon slow={slow} />
          <span>{slow ? t('animation.normal') : t('animation.slow')}</span>
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M3 2 L13 8 L3 14 Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
    </svg>
  );
}

function SpeedIcon({ slow }: { slow: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="8" x2="8" y2={slow ? '4' : '3'} stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="8" x2={slow ? '11' : '12'} y2="8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
