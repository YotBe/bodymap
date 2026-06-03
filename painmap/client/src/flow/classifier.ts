import type { AssessmentAnswers, AssessmentResult } from './types';

export function classifyAssessment(answers: AssessmentAnswers): AssessmentResult {
  const {
    painIntensity,
    painDuration,
    symptomBehavior,
    aggravatingMovement,
    deskHours,
    movementBreaks,
    equipmentAccess,
    redFlags,
  } = answers;

  // 1. Red Flags check - any red flag forces a high-risk clinician referral
  const hasRedFlags = Object.values(redFlags).some((val) => val === true);
  if (hasRedFlags) {
    return {
      riskTier: 'high',
      primaryTrack: 'clinician-referral',
      intensity: 'low',
      sessionMinutes: 10,
      rationale: [
        'Red flag symptoms reported (e.g. recent trauma, radiating symptoms, night pain, or systemic symptoms) which warrant immediate clinician referral before initiating any self-guided exercise program.',
      ],
    };
  }

  // 2. Risk scoring calculation
  let riskScore = 0;

  // Pain Intensity (1-10)
  riskScore += painIntensity;

  // Pain Duration
  if (painDuration === '1to6w') {
    riskScore += 1;
  } else if (painDuration === 'gt6w') {
    riskScore += 2;
  }

  // Symptom Behavior
  if (symptomBehavior === 'mixed') {
    riskScore += 1;
  } else if (symptomBehavior === 'worseWithMovement') {
    riskScore += 2;
  }

  // Desk Hours
  if (deskHours === '4to6') {
    riskScore += 1;
  } else if (deskHours === '6to8') {
    riskScore += 2;
  } else if (deskHours === 'gt8') {
    riskScore += 3;
  }

  // Movement Breaks
  if (movementBreaks === '1to2') {
    riskScore += 1;
  } else if (movementBreaks === 'rarely') {
    riskScore += 2;
  }

  // Equipment Access
  if (equipmentAccess === 'bandAndChair') {
    riskScore += 1;
  } else if (equipmentAccess === 'bandOnly') {
    riskScore += 2;
  }

  // 3. Determine Risk Tier
  let riskTier: 'low' | 'moderate' | 'high' = 'low';
  if (painIntensity >= 9 || riskScore >= 15) {
    riskTier = 'high';
  } else if (riskScore >= 12) {
    riskTier = 'moderate';
  }

  // 4. Determine Primary Track
  let primaryTrack:
    | 'strength-foundation'
    | 'clinician-referral'
    | 'stability-posture'
    | 'mobility-reset';

  if (riskTier === 'high') {
    primaryTrack = 'clinician-referral';
  } else {
    if (symptomBehavior === 'betterWithMovement') {
      primaryTrack = 'strength-foundation';
    } else if (symptomBehavior === 'worseWithMovement') {
      primaryTrack = 'mobility-reset';
    } else {
      primaryTrack = 'stability-posture';
    }
  }

  // 5. Determine Intensity and Session Minutes
  let intensity: 'low' | 'medium' | 'high' = 'medium';
  let sessionMinutes = 14;

  if (riskTier === 'high') {
    intensity = 'low';
    sessionMinutes = 10;
  } else {
    if (riskScore <= 5) {
      intensity = 'high';
      sessionMinutes = 18;
    } else if (riskScore <= 11) {
      intensity = 'medium';
      sessionMinutes = 14;
    } else {
      intensity = 'low';
      sessionMinutes = 10;
    }
  }

  // 6. Build rationale explanations
  const rationale: string[] = [];

  if (
    deskHours === 'gt8' ||
    movementBreaks === 'rarely' ||
    aggravatingMovement === 'typingMouse'
  ) {
    rationale.push(
      'High static desk load from prolonged posture configuration with minimal recovery windows.',
    );
  }

  if (equipmentAccess === 'bandOnly') {
    rationale.push(
      'Equipment access is limited (bands only); program adapts by prioritizing bodyweight and simple band movements.',
    );
  }

  if (symptomBehavior === 'worseWithMovement') {
    rationale.push(
      'Symptoms aggravated by movement indicate high tissue irritability; recommended focus is low-intensity mobility and recovery.',
    );
  }

  if (painIntensity >= 7) {
    rationale.push(
      'High pain level suggests beginning with a highly conservative volume and lower band tension.',
    );
  }

  return {
    riskTier,
    primaryTrack,
    intensity,
    sessionMinutes,
    rationale,
  };
}
