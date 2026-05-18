import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  src: string;
  exerciseName: string;
  /* When the video errors or fails to load, this is called so the parent
     can fall back to the SVG animation. */
  onError: () => void;
}

/* Native HTML5 video player for self-hosted exercise demonstrations.
   Bulletproof: no third-party iframe, no embed restrictions. On any
   load/decode error, calls onError so the parent swaps to the SVG. */
export function VideoDemo({ src, exerciseName, onError }: Props) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = slow ? 0.5 : 1;
  }, [slow]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else void v.play().catch(() => {/* autoplay blocked is fine */});
  }, [paused]);

  return (
    <div className="exercise-animation">
      <div className="ea-stage ea-stage-video">
        <video
          ref={videoRef}
          className="ea-video"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={t('animation.aria', { name: exerciseName })}
          onError={onError}
        />
      </div>
      <div className="ea-controls" role="group" aria-label={t('animation.controlsAria')}>
        <button
          type="button"
          className="ea-btn"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
          <span>{paused ? t('animation.play') : t('animation.pause')}</span>
        </button>
        <button
          type="button"
          className="ea-btn"
          onClick={() => setSlow((s) => !s)}
          aria-pressed={slow}
        >
          <span aria-hidden="true">◐</span>
          <span>{slow ? t('animation.normal') : t('animation.slow')}</span>
        </button>
      </div>
    </div>
  );
}
