import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAssessment } from '../src/flow/classifier';
import type { AssessmentAnswers } from '../src/flow/types';

const base: AssessmentAnswers = {
  painIntensity: 5,
  painDuration: 'subacute',
  symptomBehavior: 'mixed',
  deskHours: '6to8',
  movementBreaks: '1to2',
  equipmentAccess: 'lightBand',
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
      painDuration: 'chronic',
      symptomBehavior: 'betterWithMovement',
      deskHours: '4to6',
      movementBreaks: '3plus',
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
      painDuration: 'acute',
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
      painDuration: 'subacute',
      symptomBehavior: 'worseWithMovement',
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
      painDuration: 'subacute',
      symptomBehavior: 'mixed',
      deskHours: '4to6',
      movementBreaks: '1to2',
    })
  );
  assert.equal(out.primaryTrack, 'stability-posture');
});

test('fixture 5: movement-aggravated symptoms go to mobility-reset', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 7,
      painDuration: 'acute',
      symptomBehavior: 'worseWithMovement',
      deskHours: 'lt4',
      movementBreaks: '3plus',
    })
  );
  assert.equal(out.primaryTrack, 'mobility-reset');
});

test('fixture 6: low score produces high intensity', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 2,
      painDuration: 'acute',
      symptomBehavior: 'betterWithMovement',
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
      painDuration: 'subacute',
      symptomBehavior: 'mixed',
      deskHours: '4to6',
      movementBreaks: '1to2',
      equipmentAccess: 'lightBand',
    })
  );
  assert.equal(out.riskTier, 'low');
  assert.equal(out.intensity, 'medium');
  assert.equal(out.sessionMinutes, 14);
});

test('fixture 8: no equipment contributes risk score', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 4,
      painDuration: 'subacute',
      symptomBehavior: 'mixed',
      equipmentAccess: 'none',
    })
  );
  assert.ok(out.rationale.length > 0);
});

test('fixture 9: high desk hours reflected in rationale', () => {
  const out = classifyAssessment(
    make({
      deskHours: 'gt8',
      movementBreaks: 'rarely',
    })
  );
  assert.ok(out.rationale.some((line) => line.includes('desk load')));
});

test('fixture 10: moderate risk with movement benefit still strength track', () => {
  const out = classifyAssessment(
    make({
      painIntensity: 6,
      painDuration: 'chronic',
      symptomBehavior: 'betterWithMovement',
      deskHours: '6to8',
      movementBreaks: '1to2',
    })
  );
  assert.equal(out.riskTier, 'moderate');
  assert.equal(out.primaryTrack, 'strength-foundation');
});
