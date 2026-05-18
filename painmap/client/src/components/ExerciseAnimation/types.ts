export type AnimationView =
  | 'standing-front'
  | 'standing-side'
  | 'seated-side'
  | 'supine'
  | 'side-lying'
  | 'arm-close-up'
  | 'leg-close-up'
  | 'hand-close-up';

export interface ExerciseAnimationConfig {
  exerciseId: string;
  view: AnimationView;
  animationClass: string;
  caption: string;
  captionHe?: string;
  durationMs: number;
}
