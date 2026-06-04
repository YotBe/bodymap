import { lazy, Suspense, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HumanFigure } from './HumanFigure';
import { MuscleOverlay } from './MuscleOverlay';
import { MUSCLE_OVERLAYS } from './muscles';
import { VideoDemo } from './VideoDemo';
import { ANIMATION_CONFIGS } from './exerciseAnimations';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './exerciseAnimation.css';

// lottie-react is sizeable and only needed when an exercise actually ships a
// `demoLottie`. Load it on demand so it stays out of the bundle otherwise.
const LottieDemo = lazy(() => import('./LottieDemo').then((m) => ({ default: m.LottieDemo })));

interface Props {
  exerciseId: string;
  exerciseName: string;
  /* Optional Lottie JSON URL/path. Highest priority demo source. */
  lottieUrl?: string | null;
  /* Optional self-hosted MP4 URL/path. Used when no Lottie is available. */
  mp4Url?: string | null;
  /* Reps spec (e.g., "10-12") — used for the Lottie rep counter overlay. */
  reps?: string;
}

function parseRepTarget(reps: string | undefined): number {
  if (!reps) return 0;
  // Skip static-hold prescriptions like "30-second hold each side" — they
  // don't have a per-rep cadence.
  if (/hold|second/i.test(reps)) return 0;
  const m = reps.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function ExerciseAnimation({
  exerciseId,
  exerciseName,
  lottieUrl,
  mp4Url,
  reps,
}: Props) {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const config = ANIMATION_CONFIGS[exerciseId];
  const [paused, setPaused] = useState(false);
  const [slow, setSlow] = useState(false);
  const [videoErrored, setVideoErrored] = useState(false);
  const [lottieErrored, setLottieErrored] = useState(false);
  const [repCount, setRepCount] = useState(0);

  const repTarget = parseRepTarget(reps);
  const isSetComplete = repTarget > 0 && repCount >= repTarget;

  useEffect(() => {
    setPaused(false);
    setSlow(false);
    setVideoErrored(false);
    setLottieErrored(false);
    setRepCount(0);
  }, [exerciseId]);

  const showLottie = lottieUrl && !lottieErrored;
  const showVideo = !showLottie && mp4Url && !videoErrored;
  const showSvg = !showLottie && !showVideo && !!config;

  const controls = (
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
      {repTarget > 0 && (
        <button
          type="button"
          className={isSetComplete ? 'ea-btn ea-btn-rep ea-btn-rep-done' : 'ea-btn ea-btn-rep'}
          onClick={() =>
            setRepCount((c) => (isSetComplete ? 0 : c + 1))
          }
        >
          <CheckIcon />
          <span>
            {isSetComplete
              ? t('animation.setComplete')
              : t('animation.doneRep', { current: repCount, target: repTarget })}
          </span>
        </button>
      )}
    </div>
  );

  if (showLottie) {
    return (
      <div className="exercise-animation">
        <Suspense fallback={null}>
          <LottieDemo
            src={lottieUrl!}
            exerciseName={exerciseName}
            paused={paused}
            slow={slow}
            prefersReducedMotion={prefersReducedMotion}
            reps={reps}
            onError={() => setLottieErrored(true)}
          />
        </Suspense>
        {controls}
      </div>
    );
  }

  if (showVideo) {
    return (
      <VideoDemo
        src={mp4Url!}
        exerciseName={exerciseName}
        onError={() => setVideoErrored(true)}
      />
    );
  }

  if (!showSvg) {
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
        <HumanFigure view={config.view}>
          <MuscleOverlay exerciseId={exerciseId} />
        </HumanFigure>
        {MUSCLE_OVERLAYS[exerciseId] && (
          <span className="ea-muscle-label" aria-hidden="true">
            {(isHebrew && MUSCLE_OVERLAYS[exerciseId].labelHe) || MUSCLE_OVERLAYS[exerciseId].label}
          </span>
        )}
        <span className="ea-caption">{caption}</span>
        {paused && <span className="ea-paused-badge">{t('animation.paused')}</span>}
      </div>
      {controls}
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M3 8 L7 12 L13 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
