import { MUSCLE_OVERLAYS } from './muscles';

interface Props {
  exerciseId: string;
}

/* Renders the prime-mover muscle paths over the figure. The pulse
   animation is driven by .anim-<class> .ea-muscle keyframes in
   exerciseAnimation.css, synced to the exercise's contraction phase. */
export function MuscleOverlay({ exerciseId }: Props) {
  const overlay = MUSCLE_OVERLAYS[exerciseId];
  if (!overlay) return null;
  return (
    <g className="ea-muscle" aria-hidden="true">
      {overlay.paths.map((d, i) => (
        <path key={i} d={d} className="ea-muscle-shape" />
      ))}
    </g>
  );
}
