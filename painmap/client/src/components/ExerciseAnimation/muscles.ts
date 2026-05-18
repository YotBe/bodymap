/* Prime-mover muscle overlays — one per exercise.
   Each entry is a small SVG path (in the figure's coordinate space) that
   highlights the muscle being primarily targeted by the exercise.
   The overlay pulses in --accent in sync with the exercise's contraction
   phase (handled by the .anim-<class> .ea-muscle CSS keyframes). */

export interface MuscleOverlay {
  /* Path data drawn over the figure. Coordinates match HumanFigure.tsx. */
  paths: string[];
  /* Short clinician-readable label for screen readers / hover state. */
  label: string;
  labelHe?: string;
}

export const MUSCLE_OVERLAYS: Record<string, MuscleOverlay> = {
  /* --- Neck / upper back --- */
  'ex-band-shrug': {
    paths: [
      // Upper trapezius — two soft blobs from neck out to each shoulder
      'M 102 60 Q 92 62 90 64 Q 100 56 118 58 Q 122 60 102 60 Z',
      'M 138 60 Q 148 62 150 64 Q 140 56 122 58 Q 118 60 138 60 Z',
    ],
    label: 'Upper trapezius',
    labelHe: 'טרפז עליון',
  },
  'ex-levator-stretch': {
    // Levator scapulae — stripe from cervical spine to scapula angle
    paths: ['M 106 92 Q 124 100 132 116 Q 122 110 110 102 Z'],
    label: 'Levator scapulae',
    labelHe: 'מרים השכמה',
  },
  'ex-chin-tuck-band': {
    // Deep neck flexors — small region anterior cervical
    paths: ['M 102 76 Q 109 84 112 92 Q 104 88 100 80 Z'],
    label: 'Deep cervical flexors',
    labelHe: 'כופפי צוואר עמוקים',
  },

  /* --- Shoulder --- */
  'ex-band-external-rotation': {
    // Infraspinatus / posterior cuff — back of shoulder
    paths: ['M 116 70 Q 124 78 122 92 Q 116 86 114 76 Z'],
    label: 'Posterior rotator cuff',
    labelHe: 'שרוול מסובב אחורי',
  },
  'ex-lateral-raise': {
    // Lateral deltoids — both sides, top of shoulders
    paths: [
      'M 84 62 Q 78 76 84 88 Q 92 78 90 64 Z',
      'M 156 62 Q 162 76 156 88 Q 148 78 150 64 Z',
    ],
    label: 'Lateral deltoid',
    labelHe: 'דלתא רוחבית',
  },
  'ex-face-pull': {
    // Posterior deltoid + mid trap — upper back
    paths: [
      'M 92 62 Q 100 68 102 78 Q 90 72 88 64 Z',
      'M 148 62 Q 140 68 138 78 Q 150 72 152 64 Z',
      'M 108 70 Q 120 74 132 70 Q 120 76 108 70 Z',
    ],
    label: 'Posterior deltoid + mid trap',
    labelHe: 'דלתא אחורית + טרפז אמצעי',
  },

  /* --- Arm --- */
  'ex-banded-biceps-eccentric': {
    // Biceps brachii — both upper arms
    paths: [
      'M 84 70 Q 78 90 82 108 Q 88 92 90 72 Z',
      'M 156 70 Q 162 90 158 108 Q 152 92 150 72 Z',
    ],
    label: 'Biceps brachii',
    labelHe: 'דו-ראשי זרוע',
  },

  /* --- Upper back / scapular --- */
  'ex-seated-row': {
    // Rhomboids / mid back — paraspinal stripe (seated side view)
    paths: ['M 114 100 Q 120 130 118 158 Q 110 130 110 100 Z'],
    label: 'Rhomboids + mid trapezius',
    labelHe: 'רומבואיד + טרפז אמצעי',
  },
  'ex-ytw': {
    // Scapular stabilizers — three small blobs (Y, T, W positions)
    paths: [
      'M 96 60 Q 102 66 100 74 Q 92 70 92 62 Z',
      'M 144 60 Q 138 66 140 74 Q 148 70 148 62 Z',
      'M 110 66 Q 120 70 130 66 Q 120 74 110 66 Z',
    ],
    label: 'Lower + mid trapezius',
    labelHe: 'טרפז תחתון + אמצעי',
  },

  /* --- Low back / hip hinge --- */
  'ex-good-morning': {
    // Erector spinae — paraspinal stripe along the back (side view)
    paths: ['M 116 70 Q 124 100 122 148 Q 114 100 112 70 Z'],
    label: 'Erector spinae + hamstrings',
    labelHe: 'זקפי הגב + הסטרינג',
  },

  /* --- Forearm / wrist --- */
  'ex-median-nerve-glide': {
    // Median nerve path — wrist + along forearm in hand-close-up view
    paths: ['M 220 60 Q 180 78 140 90 Q 180 84 220 64 Z'],
    label: 'Median nerve',
    labelHe: 'עצב מדיאני',
  },
  'ex-wrist-extension': {
    // Wrist extensors — dorsal forearm (arm-close-up view)
    paths: ['M 130 116 Q 170 112 208 116 Q 170 122 130 122 Z'],
    label: 'Wrist extensors',
    labelHe: 'פושטי שורש כף יד',
  },
  'ex-tyler-twist': {
    // Common extensor origin — lateral elbow (arm-close-up)
    paths: ['M 116 116 Q 124 120 126 128 Q 116 126 112 120 Z'],
    label: 'Common extensor tendon',
    labelHe: 'גיד הפושטים המשותף',
  },
  'ex-reverse-tyler': {
    // Common flexor origin — medial elbow
    paths: ['M 116 124 Q 124 122 128 116 Q 122 130 114 130 Z'],
    label: 'Common flexor tendon',
    labelHe: 'גיד הכופפים המשותף',
  },
  'ex-banded-thumb-eccentric': {
    // APL/EPB — thumb side of forearm
    paths: ['M 198 118 Q 214 110 226 108 Q 214 116 200 122 Z'],
    label: 'Thumb extensors (APL/EPB)',
    labelHe: 'פושטי האגודל',
  },

  /* --- Hip / glutes --- */
  'ex-banded-clamshell': {
    // Glute medius — side-lying view, hip region
    paths: ['M 138 130 Q 152 132 162 140 Q 148 138 138 142 Z'],
    label: 'Gluteus medius',
    labelHe: 'עכוז אמצעי',
  },
  'ex-banded-glute-bridge': {
    // Gluteus maximus — pelvis region (supine view)
    paths: ['M 132 120 Q 152 116 168 120 Q 152 128 132 128 Z'],
    label: 'Gluteus maximus',
    labelHe: 'עכוז גדול',
  },

  /* --- Knee --- */
  'ex-banded-tke': {
    // VMO — medial quadriceps (leg-close-up view)
    paths: ['M 90 110 Q 96 118 96 124 Q 86 120 86 112 Z'],
    label: 'Vastus medialis (VMO)',
    labelHe: 'ראש מדיאלי של הארבע-ראשי',
  },
  'ex-banded-hamstring-curl': {
    // Hamstrings — back of thigh (leg-close-up)
    paths: ['M 110 60 Q 114 90 110 120 Q 106 90 106 60 Z'],
    label: 'Hamstrings',
    labelHe: 'הסטרינג',
  },

  /* --- Foot / ankle --- */
  'ex-eccentric-heel-drop': {
    // Gastrocnemius / soleus — calf (leg-close-up)
    paths: ['M 110 140 Q 116 175 112 205 Q 104 175 104 140 Z'],
    label: 'Gastrocnemius + soleus',
    labelHe: 'תאומים + סוליאוס',
  },
  'ex-plantar-fascia-stretch': {
    // Plantar fascia — arch of foot
    paths: ['M 100 240 Q 122 244 148 240 Q 122 248 100 246 Z'],
    label: 'Plantar fascia',
    labelHe: 'פאסיה פלנטרית',
  },
  'ex-banded-eversion': {
    // Peroneals — lateral lower leg
    paths: ['M 108 130 Q 114 170 108 208 Q 102 170 102 130 Z'],
    label: 'Peroneals',
    labelHe: 'פרונאלים',
  },
};
