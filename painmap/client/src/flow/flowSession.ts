import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  DEFAULT_ASSESSMENT,
  DEFAULT_PROGRESS,
  type AssessmentAnswers,
  type ClassificationResult,
  type FlowSessionState,
  type FlowStep,
  type ProgressSnapshot,
  type RoutinePlan,
  type SetupProfile,
} from './types';
import { LocalProgressRepository } from './progressRepository';

const SESSION_KEY = 'physiodesk.flow.session.v1';

const initialState: FlowSessionState = {
  step: 'hero',
  selectedZoneId: null,
  selectedSubAreaId: null,
  selectedExerciseId: null,
  assessment: null,
  classification: null,
  routine: null,
  setup: null,
  progress: DEFAULT_PROGRESS,
  updatedAt: new Date().toISOString(),
};

type FlowAction =
  | { type: 'setStep'; step: FlowStep }
  | { type: 'setPainArea'; zoneId: string | null; subAreaId: string | null; exerciseId: string | null }
  | { type: 'setAssessment'; assessment: AssessmentAnswers }
  | { type: 'setClassification'; classification: ClassificationResult }
  | { type: 'setRoutine'; routine: RoutinePlan }
  | { type: 'setSetup'; setup: SetupProfile }
  | { type: 'setProgress'; progress: ProgressSnapshot }
  | { type: 'resetFlow' };

function reducer(state: FlowSessionState, action: FlowAction): FlowSessionState {
  const stamp = new Date().toISOString();

  switch (action.type) {
    case 'setStep':
      return { ...state, step: action.step, updatedAt: stamp };
    case 'setPainArea':
      return {
        ...state,
        selectedZoneId: action.zoneId,
        selectedSubAreaId: action.subAreaId,
        selectedExerciseId: action.exerciseId,
        classification: null,
        routine: null,
        setup: null,
        step: 'map',
        updatedAt: stamp,
      };
    case 'setAssessment':
      return {
        ...state,
        assessment: action.assessment,
        step: 'assessment',
        updatedAt: stamp,
      };
    case 'setClassification':
      return {
        ...state,
        classification: action.classification,
        step: 'classification',
        updatedAt: stamp,
      };
    case 'setRoutine':
      return {
        ...state,
        routine: action.routine,
        step: 'routine',
        updatedAt: stamp,
      };
    case 'setSetup':
      return {
        ...state,
        setup: action.setup,
        step: 'setup',
        updatedAt: stamp,
      };
    case 'setProgress':
      return {
        ...state,
        progress: action.progress,
        updatedAt: stamp,
      };
    case 'resetFlow':
      return {
        ...state,
        step: 'hero',
        selectedZoneId: null,
        selectedSubAreaId: null,
        selectedExerciseId: null,
        assessment: null,
        classification: null,
        routine: null,
        setup: null,
        updatedAt: stamp,
      };
    default:
      return state;
  }
}

function hydrateInitial(): FlowSessionState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as FlowSessionState;
    return {
      ...initialState,
      ...parsed,
      progress: {
        ...DEFAULT_PROGRESS,
        ...parsed.progress,
      },
      assessment: parsed.assessment
        ? {
            ...DEFAULT_ASSESSMENT,
            ...parsed.assessment,
            redFlags: {
              ...DEFAULT_ASSESSMENT.redFlags,
              ...parsed.assessment.redFlags,
            },
          }
        : null,
    };
  } catch {
    return initialState;
  }
}

export function useFlowSession() {
  const [state, dispatch] = useReducer(reducer, undefined, hydrateInitial);

  const progressRepository = useMemo(
    () => new LocalProgressRepository(DEFAULT_PROGRESS),
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    let mounted = true;
    progressRepository.getSnapshot().then((snapshot) => {
      if (!mounted) return;
      dispatch({ type: 'setProgress', progress: snapshot });
    });
    return () => {
      mounted = false;
    };
  }, [progressRepository]);

  const setStep = useCallback((step: FlowStep) => {
    dispatch({ type: 'setStep', step });
  }, []);

  const setPainArea = useCallback(
    (zoneId: string | null, subAreaId: string | null, exerciseId: string | null) => {
      dispatch({ type: 'setPainArea', zoneId, subAreaId, exerciseId });
    },
    []
  );

  const setAssessment = useCallback((assessment: AssessmentAnswers) => {
    dispatch({ type: 'setAssessment', assessment });
  }, []);

  const setClassification = useCallback((classification: ClassificationResult) => {
    dispatch({ type: 'setClassification', classification });
  }, []);

  const setRoutine = useCallback((routine: RoutinePlan) => {
    dispatch({ type: 'setRoutine', routine });
  }, []);

  const setSetup = useCallback((setup: SetupProfile) => {
    dispatch({ type: 'setSetup', setup });
  }, []);

  const setProgress = useCallback(
    async (progress: ProgressSnapshot) => {
      dispatch({ type: 'setProgress', progress });
      await progressRepository.saveSnapshot(progress);
    },
    [progressRepository]
  );

  const resetFlow = useCallback(() => {
    dispatch({ type: 'resetFlow' });
  }, []);

  return {
    state,
    setStep,
    setPainArea,
    setAssessment,
    setClassification,
    setRoutine,
    setSetup,
    setProgress,
    resetFlow,
  };
}
