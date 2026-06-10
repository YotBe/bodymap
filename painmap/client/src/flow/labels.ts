import type { AssessmentResult } from './types';

type Track = AssessmentResult['primaryTrack'];

/** i18n key for a track's display name (shared by results + routine views). */
export function trackLabelKey(track: Track): string {
  switch (track) {
    case 'strength-foundation':
      return 'assessment.trackStrength';
    case 'stability-posture':
      return 'assessment.trackStability';
    case 'mobility-reset':
      return 'assessment.trackMobility';
    case 'clinician-referral':
      return 'assessment.trackClinician';
  }
}

/** i18n key for a track's sets×reps prescription line. */
export function prescriptionLabelKey(track: Track): string {
  switch (track) {
    case 'clinician-referral':
      return 'assessment.prescriptionClinician';
    case 'stability-posture':
      return 'assessment.prescriptionStability';
    case 'strength-foundation':
      return 'assessment.prescriptionStrength';
    case 'mobility-reset':
      return 'assessment.prescriptionMobility';
  }
}
