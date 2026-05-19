import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';

interface Props {
  src: string;
  exerciseName: string;
  paused: boolean;
  slow: boolean;
  prefersReducedMotion: boolean;
  /* Sets/reps spec (e.g., "10-12") — used to derive the rep overlay max count. */
  reps?: string;
  onError: () => void;
}

function parseRepCount(reps: string | undefined): number {
  if (!reps) return 0;
  // Pull the first number from strings like "10-12", "8", "30-second hold".
  const m = reps.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function LottieDemo({
  src,
  exerciseName,
  paused,
  slow,
  prefersReducedMotion,
  reps,
  onError,
}: Props) {
  const { t } = useTranslation();
  const ref = useRef<LottieRefCurrentProps | null>(null);
  const [data, setData] = useState<object | null>(null);
  const [loopCount, setLoopCount] = useState(0);
  const repsMax = parseRepCount(reps);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoopCount(0);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Lottie HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) onError();
      });
    return () => {
      cancelled = true;
    };
  }, [src, onError]);

  useEffect(() => {
    const inst = ref.current;
    if (!inst) return;
    if (paused || prefersReducedMotion) inst.pause();
    else inst.play();
  }, [paused, data, prefersReducedMotion]);

  useEffect(() => {
    const inst = ref.current;
    if (!inst) return;
    inst.setSpeed(slow ? 0.5 : 1);
  }, [slow, data]);

  if (!data) {
    return (
      <div className="ea-stage ea-stage-lottie" aria-label={exerciseName} />
    );
  }

  const currentRep = repsMax > 0 ? (loopCount % repsMax) + 1 : 0;

  return (
    <div
      className="ea-stage ea-stage-lottie"
      role="img"
      aria-label={t('animation.aria', { name: exerciseName })}
    >
      <Lottie
        lottieRef={ref}
        animationData={data}
        loop
        autoplay={!prefersReducedMotion}
        className="ea-lottie"
        onLoopComplete={() => setLoopCount((c) => c + 1)}
      />
      {repsMax > 0 && (
        <span className="ea-rep-counter" aria-hidden="true">
          {t('animation.rep', { current: currentRep })} / {repsMax}
        </span>
      )}
      {paused && <span className="ea-paused-badge">{t('animation.paused')}</span>}
    </div>
  );
}
