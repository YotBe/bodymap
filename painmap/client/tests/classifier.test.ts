import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAssessment } from '../src/flow/classifier';
import type { AssessmentAnswers } from '../src/flow/types';

const base: AssessmentAnswers = {
  painIntensity: 5,
  painDuration: '1to6w',
  symptomBehavior: 'mixed',
  aggravatingMovement: 'sittingLong',
  deskHours: '6to8',
  movementBreaks: '1to2',
  equipmentAccess: 'bandOnly',
  redFlags: {
    recentTrauma: false,
    radiatingSymptoms: false,
    systemicSymptoms: false,
    nightPain: false,
  },
};

function make(overrides: Partial<AssessmentAnswers>): AssessmentAnswers {
  return {
    ...base,
    ...overrides,
    redFlags: {
      ...base.redFlags,
      ...(overrides.redFlags ?? {}),
    },
  };
}

test('fixture 1: low-risk strength foundation profile', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 3,
      painDuration: 'gt6w',
      symptomBehavior: 'betterWithMovement',
      aggravatingMovement: 'overheadReach',
      deskHours: '4to6',
      movementBreaks: '3plus',
      equipmentAccess: 'fullSet',
    })
  );
  assert.equal(out.riskTier, 'low');
  assert.equal(out.primaryTrack, 'strength-foundation');
});

test('fixture 2: red flag always escalates to clinician referral', () => {
  const out = classifyAssessment(
    make({
      redFlags: { radiatingSymptoms: true },
      painIntensity: 2,
      painDuration: 'lt1w',
      equipmentAccess: 'bandAndChair',
    })
  );
  assert.equal(out.riskTier, 'high');
  assert.equal(out.primaryTrack, 'clinician-referral');
  assert.equal(out.intensity, 'low');
});

test('fixture 3: severe pain + poor breaks yields high risk', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 9,
      painDuration: '1to6w',
      symptomBehavior: 'worseWithMovement',
      aggravatingMovement: 'typingMouse',
      movementBreaks: 'rarely',
      deskHours: 'gt8',
    })
  );
  assert.equal(out.riskTier, 'high');
  assert.equal(out.primaryTrack, 'clinician-referral');
});

test('fixture 4: mixed subacute profile routes to stability-posture', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 4,
      painDuration: '1to6w',
      symptomBehavior: 'mixed',
      aggravatingMovement: 'liftingCarry',
      deskHours: '4to6',
      movementBreaks: '1to2',
      equipmentAccess: 'bandAndChair',
    })
  );
  assert.equal(out.primaryTrack, 'stability-posture');
});

test('fixture 5: movement-aggravated symptoms go to mobility-reset', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 7,
      painDuration: 'lt1w',
      symptomBehavior: 'worseWithMovement',
      aggravatingMovement: 'bendingTwisting',
      deskHours: 'lt4',
      movementBreaks: '3plus',
      equipmentAccess: 'bandAndChair',
    })
  );
  assert.equal(out.primaryTrack, 'mobility-reset');
});

test('fixture 6: low score produces high intensity', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 2,
      painDuration: 'lt1w',
      symptomBehavior: 'betterWithMovement',
      aggravatingMovement: 'overheadReach',
      deskHours: 'lt4',
      movementBreaks: '3plus',
      equipmentAccess: 'fullSet',
    })
  );
  assert.equal(out.riskTier, 'low');
  assert.equal(out.intensity, 'high');
  assert.equal(out.sessionMinutes, 18);
});

test('fixture 7: medium score produces medium intensity', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 5,
      painDuration: '1to6w',
      symptomBehavior: 'mixed',
      aggravatingMovement: 'stairsWalk',
      deskHours: '4to6',
      movementBreaks: '1to2',
      equipmentAccess: 'bandAndChair',
    })
  );
  assert.equal(out.riskTier, 'low');
  assert.equal(out.intensity, 'medium');
  assert.equal(out.sessionMinutes, 14);
});

test('fixture 8: limited equipment contributes risk score', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 4,
      painDuration: '1to6w',
      symptomBehavior: 'mixed',
      equipmentAccess: 'bandOnly',
    })
  );
  assert.ok(out.rationale.length > 0);
});

test('fixture 9: high desk hours reflected in rationale', () => {
  const out = classifyAssessment(
    make({
      deskHours: 'gt8',
      movementBreaks: 'rarely',
      aggravatingMovement: 'typingMouse',
    })
  );
  assert.ok(out.rationale.some((line) => line.includes('desk load')));
});

test('fixture 10: moderate risk with movement benefit still strength track', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 6,
      painDuration: 'gt6w',
      symptomBehavior: 'betterWithMovement',
      aggravatingMovement: 'sittingLong',
      deskHours: '6to8',
      movementBreaks: '1to2',
      equipmentAccess: 'bandOnly',
    })
  );
  assert.equal(out.riskTier, 'moderate');
  assert.equal(out.primaryTrack, 'strength-foundation');
});
