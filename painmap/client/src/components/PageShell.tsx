import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SafetyBanner } from './SafetyBanner';
import { TopHeader } from './TopHeader';
import { SiteFooter } from './SiteFooter';
import { BodyMap } from './BodyMap/BodyMap';
import { PaneEyebrow } from './PaneEyebrow';
import { HomePage } from '../routes/HomePage';
import { ZonePage } from '../routes/ZonePage';
import { ExercisePage } from '../routes/ExercisePage';
import { AboutPage } from '../routes/AboutPage';
import { LegalPage } from '../routes/LegalPage';
import { EvidencePage } from '../routes/EvidencePage';
import { ClinicianPage } from '../routes/ClinicianPage';
import { NotFoundPage } from './NotFoundPage';
import { useZones } from '../api/exercises';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  type BodyView,
  type ZoneId,
  ZONES_BY_VIEW,
} from './BodyMap/zones';
import { useFlowSession } from '../flow/flowSession';
import {
  DEFAULT_ASSESSMENT,
  type AssessmentAnswers,
  type ClassificationResult,
  type ProgressSnapshot,
  type RoutinePlan,
  type SetupProfile,
} from '../flow/types';
import { classifyAssessment } from '../flow/classifier';
import { buildRoutinePlan, buildSetupProfile } from '../flow/routine';
import { AssessmentStep } from './Flow/AssessmentStep';
import { BodyAreaStep } from './Flow/BodyAreaStep';
import { ClassificationStep } from './Flow/ClassificationStep';
import { ProgressStep } from './Flow/ProgressStep';
import { RoutineStep } from './Flow/RoutineStep';
import { SetupStep } from './Flow/SetupStep';

const ALL_ZONE_IDS: readonly ZoneId[] = [
  'neck',
  'shoulders',
  'back',
  'hands-wrists',
  'hip-glutes',
  'knees',
  'foot-ankle',
] as const;

function isZoneId(value: string | undefined | null): value is ZoneId {
  return !!value && (ALL_ZONE_IDS as readonly string[]).includes(value);
}

function ExerciseRouteSync({
  onSync,
}: {
  onSync: (subAreaId: string | null, zoneId: ZoneId | null) => void;
}) {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { data: zones } = useZones();

  useEffect(() => {
    if (!exerciseId || !zones) {
      onSync(null, null);
      return;
    }
    for (const z of zones) {
      for (const sa of z.subAreas) {
        if (sa.primaryExerciseId === exerciseId) {
          onSync(sa.id, z.id as ZoneId);
          return;
        }
      }
    }
    onSync(null, null);
  }, [exerciseId, zones, onSync]);

  return null;
}

function ZoneRouteSync({
  onSync,
}: {
  onSync: (zoneId: ZoneId | null) => void;
}) {
  const { zoneId } = useParams<{ zoneId: string }>();

  useEffect(() => {
    if (isZoneId(zoneId)) onSync(zoneId);
    else onSync(null);
  }, [zoneId, onSync]);

  return null;
}

function ResetMapSelectionOnEnter({
  onReset,
}: {
  onReset: () => void;
}) {
  useEffect(() => {
    onReset();
  }, [onReset]);
  return null;
}

function ClassificationRoute({
  assessment,
  selectedZoneId,
  selectedExerciseId,
  fallbackExerciseIds,
  onComplete,
}: {
  assessment: AssessmentAnswers | null;
  selectedZoneId: string | null;
  selectedExerciseId: string | null;
  fallbackExerciseIds: string[];
  onComplete: (
    classification: ClassificationResult,
    routine: RoutinePlan,
    setup: SetupProfile
  ) => void;
}) {
  useEffect(() => {
    if (!assessment || !selectedZoneId) return;

    const timer = window.setTimeout(() => {
      const classification = classifyAssessment(assessment);
      const routine = buildRoutinePlan(classification, selectedExerciseId, fallbackExerciseIds);
      const setup = buildSetupProfile(assessment);
      onComplete(classification, routine, setup);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [assessment, selectedZoneId, selectedExerciseId, fallbackExerciseIds, onComplete]);

  return <ClassificationStep classification={null} />;
}

function startOfDayMillis(iso: string): number {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function durationLabel(value: AssessmentAnswers['painDuration']): string {
  if (value === 'lt1w') return 'Less than 1 week';
  if (value === '1to6w') return '1-6 weeks';
  return 'More than 6 weeks';
}

function aggravatingLabel(value: AssessmentAnswers['aggravatingMovement']): string {
  switch (value) {
    case 'overheadReach':
      return 'Overhead reach';
    case 'sittingLong':
      return 'Sitting long';
    case 'typingMouse':
      return 'Typing / mouse work';
    case 'liftingCarry':
      return 'Lifting / carrying';
    case 'stairsWalk':
      return 'Walking / stairs';
    case 'bendingTwisting':
      return 'Bending / twisting';
    default:
      return 'Mixed movement triggers';
  }
}

export function PageShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { data: zones } = useZones();
  const { t } = useTranslation();

  const flow = useFlowSession();

  const [view, setView] = useState<BodyView>('anterior');
  const [bannerDismissed, setBannerDismissed] = useLocalStorage(
    'painmap.banner.dismissed',
    false
  );
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);
  const [selectedSubArea, setSelectedSubArea] = useState<string | null>(null);

  const subAreaToExerciseId = useMemo(() => {
    const m = new Map<string, string>();
    zones?.forEach((z) => {
      z.subAreas.forEach((sa) => {
        if (sa.primaryExerciseId) m.set(sa.id, sa.primaryExerciseId);
      });
    });
    return m;
  }, [zones]);

  const subAreaToZoneId = useMemo(() => {
    const m = new Map<string, ZoneId>();
    zones?.forEach((z) => {
      z.subAreas.forEach((sa) => {
        if (isZoneId(z.id)) m.set(sa.id, z.id);
      });
    });
    return m;
  }, [zones]);

  const subAreaToDisplayName = useMemo(() => {
    const m = new Map<string, string>();
    zones?.forEach((z) => {
      z.subAreas.forEach((sa) => {
        m.set(sa.id, sa.name);
      });
    });
    return m;
  }, [zones]);

  const zoneToPrimaryExerciseIds = useMemo(() => {
    const m = new Map<ZoneId, string[]>();
    zones?.forEach((z) => {
      if (!isZoneId(z.id)) return;
      m.set(
        z.id,
        z.subAreas
          .map((sa) => sa.primaryExerciseId)
          .filter((id): id is string => !!id)
      );
    });
    return m;
  }, [zones]);

  useEffect(() => {
    if (isZoneId(flow.state.selectedZoneId)) {
      setSelectedZone(flow.state.selectedZoneId);
    }
    if (flow.state.selectedSubAreaId) {
      setSelectedSubArea(flow.state.selectedSubAreaId);
    }
  }, [flow.state.selectedZoneId, flow.state.selectedSubAreaId]);

  // Auto-flip view when the selected zone is posterior-only and user is on anterior.
  useEffect(() => {
    if (selectedZone === 'back' && view === 'anterior') {
      setView('posterior');
    }
  }, [selectedZone, view]);

  const handleViewChange = useCallback(
    (next: BodyView) => {
      setView(next);
      if (next === 'anterior' && selectedZone === 'back') {
        navigate('/');
      }
    },
    [navigate, selectedZone]
  );

  const handleZoneSelect = useCallback(
    (zoneId: ZoneId) => {
      flow.setStep('map');
      navigate(`/zone/${zoneId}`);
    },
    [flow, navigate]
  );

  const handleSubAreaSelect = useCallback(
    (subAreaId: string, primaryExerciseId?: string | null) => {
      const exId = primaryExerciseId ?? subAreaToExerciseId.get(subAreaId) ?? null;
      const zoneId = selectedZone ?? subAreaToZoneId.get(subAreaId) ?? null;

      if (zoneId) setSelectedZone(zoneId);
      setSelectedSubArea(subAreaId);
      flow.setPainArea(zoneId, subAreaId, exId);
      navigate('/flow/assessment');
    },
    [flow, navigate, selectedZone, subAreaToExerciseId, subAreaToZoneId]
  );

  const handleBack = useCallback(() => {
    if (location.pathname.startsWith('/flow/')) {
      setSelectedZone(null);
      setSelectedSubArea(null);
      flow.setPainArea(null, null, null);
      navigate('/flow/map');
      return;
    }

    if (selectedSubArea) {
      if (selectedZone) navigate(`/zone/${selectedZone}`);
      else navigate('/flow/map');
    } else {
      navigate('/');
    }
  }, [flow, location.pathname, navigate, selectedZone, selectedSubArea]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selectedSubArea && selectedZone) {
        navigate(`/zone/${selectedZone}`);
      } else if (selectedZone) {
        navigate('/flow/map');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, selectedSubArea, selectedZone]);

  const enabledZonesForView = ZONES_BY_VIEW[view];
  const isZoneInView = selectedZone ? enabledZonesForView.includes(selectedZone) : true;

  const isStaticPage =
    location.pathname === '/about' ||
    location.pathname === '/legal' ||
    location.pathname === '/evidence' ||
    location.pathname === '/clinician-finder';

  const isFlowPath = location.pathname.startsWith('/flow/');

  const routeKind: 'home' | 'map' | 'zone' | 'exercise' | 'page' | 'flow' = isStaticPage
    ? 'page'
    : location.pathname.startsWith('/exercise')
      ? 'exercise'
      : location.pathname.startsWith('/zone')
        ? 'zone'
        : location.pathname === '/flow/map'
          ? 'map'
          : isFlowPath
            ? 'flow'
            : 'home';

  const fallbackExerciseIds = useMemo(() => {
    if (!isZoneId(flow.state.selectedZoneId)) return [];
    const inZone = zoneToPrimaryExerciseIds.get(flow.state.selectedZoneId) ?? [];
    return inZone.filter((id) => id !== flow.state.selectedExerciseId);
  }, [flow.state.selectedExerciseId, flow.state.selectedZoneId, zoneToPrimaryExerciseIds]);

  const handleStartScan = useCallback(() => {
    flow.setStep('map');
    setSelectedZone(null);
    setSelectedSubArea(null);
    flow.setPainArea(null, null, null);
    navigate('/flow/map');
  }, [flow, navigate]);

  const handleOpenAssessment = useCallback(() => {
    if (flow.state.selectedSubAreaId) {
      navigate('/flow/assessment');
      return;
    }
    navigate('/flow/map');
  }, [flow.state.selectedSubAreaId, navigate]);

  const handleAssessmentSubmit = useCallback(
    (answers: AssessmentAnswers) => {
      flow.setAssessment(answers);
      navigate('/flow/classification');
    },
    [flow, navigate]
  );

  const handleClassificationResolved = useCallback(
    (classification: ClassificationResult, routine: RoutinePlan, setup: SetupProfile) => {
      flow.setClassification(classification);
      flow.setRoutine(routine);
      flow.setSetup(setup);
      navigate('/flow/routine');
    },
    [flow, navigate]
  );

  const completeSession = useCallback(async () => {
    const prev = flow.state.progress;
    const now = new Date().toISOString();

    let streakDays = 1;
    if (prev.lastCompletedAt) {
      const diffDays =
        (startOfDayMillis(now) - startOfDayMillis(prev.lastCompletedAt)) / (1000 * 60 * 60 * 24);
      if (diffDays <= 0) streakDays = prev.streakDays;
      else if (diffDays === 1) streakDays = prev.streakDays + 1;
      else streakDays = 1;
    }

    const completedSessions = prev.completedSessions + 1;
    const adherencePercent = Math.min(
      100,
      Math.round((completedSessions / (completedSessions + 2)) * 100)
    );

    const next: ProgressSnapshot = {
      ...prev,
      completedSessions,
      streakDays,
      adherencePercent,
      lastCompletedAt: now,
    };

    await flow.setProgress(next);
    navigate('/flow/progress');
  }, [flow, navigate]);

  const handlePainScoreUpdate = useCallback(
    async (painScore: number) => {
      const confidenceLevel =
        painScore <= 3 ? 'high' : painScore <= 6 ? 'medium' : 'low';
      await flow.setProgress({
        ...flow.state.progress,
        lastPainScore: painScore,
        confidenceLevel,
      });
    },
    [flow]
  );

  const handleRestart = useCallback(() => {
    flow.resetFlow();
    setSelectedZone(null);
    setSelectedSubArea(null);
    navigate('/');
  }, [flow, navigate]);

  return (
    <div className="app-shell" data-route={routeKind}>
      {!bannerDismissed && <SafetyBanner onDismiss={() => setBannerDismissed(true)} />}
      <TopHeader />

      <main className="layout" data-route={routeKind}>
        <section className="pane pane-left">
          <PaneEyebrow num={t('pane.selectNum')} label={t('pane.selectLabel')} />
          <h1 className="page-title">
            <span className="pt-serif">{t('pageTitle.wherePrefix')}</span>
            <span className="pt-serif pt-italic">{t('pageTitle.whereSuffix')}</span>
          </h1>

          <BodyMap
            view={view}
            selectedZone={isZoneInView ? selectedZone : null}
            selectedSubAreaId={selectedSubArea}
            prefersReducedMotion={prefersReducedMotion}
            isMobile={isMobile}
            onViewChange={handleViewChange}
            onZoneSelect={handleZoneSelect}
            onSubAreaSelect={(sa) => handleSubAreaSelect(sa)}
            onBack={handleBack}
          />
        </section>

        <section className="pane pane-right">
          <div className="fade-stage" key={location.pathname}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ResetMapSelectionOnEnter
                      onReset={() => {
                        setSelectedZone(null);
                        setSelectedSubArea(null);
                        flow.setPainArea(null, null, null);
                      }}
                    />
                    <HomePage
                      onStartScan={handleStartScan}
                      onOpenAssessment={handleOpenAssessment}
                    />
                  </>
                }
              />

              <Route
                path="/flow/map"
                element={
                  <div className="flow-scroll">
                    <ResetMapSelectionOnEnter
                      onReset={() => {
                        setSelectedZone(null);
                        setSelectedSubArea(null);
                        flow.setPainArea(null, null, null);
                      }}
                    />
                    <PaneEyebrow num="01" label="BODY AREA" />
                    <BodyAreaStep />
                  </div>
                }
              />

              <Route
                path="/zone/:zoneId"
                element={
                  <>
                    <ZoneRouteSync
                      onSync={(z) => {
                        setSelectedZone(z);
                        setSelectedSubArea(null);
                      }}
                    />
                    <ZonePage onPickSubArea={handleSubAreaSelect} />
                  </>
                }
              />

              <Route
                path="/flow/assessment"
                element={
                  !flow.state.selectedSubAreaId ? (
                    <Navigate to="/flow/map" replace />
                  ) : (
                    <div className="flow-scroll">
                      <AssessmentStep
                        initial={flow.state.assessment ?? DEFAULT_ASSESSMENT}
                        onSubmit={handleAssessmentSubmit}
                        onChangeArea={() => {
                          setSelectedZone(null);
                          setSelectedSubArea(null);
                          flow.setPainArea(null, null, null);
                          navigate('/flow/map');
                        }}
                      />
                    </div>
                  )
                }
              />

              <Route
                path="/flow/classification"
                element={
                  !flow.state.assessment || !flow.state.selectedZoneId ? (
                    <Navigate to="/flow/assessment" replace />
                  ) : (
                    <div className="flow-scroll">
                      <ClassificationRoute
                        assessment={flow.state.assessment}
                        selectedZoneId={flow.state.selectedZoneId}
                        selectedExerciseId={flow.state.selectedExerciseId}
                        fallbackExerciseIds={fallbackExerciseIds}
                        onComplete={handleClassificationResolved}
                      />
                    </div>
                  )
                }
              />

              <Route
                path="/flow/routine"
                element={
                  !flow.state.routine || !flow.state.classification ? (
                    <Navigate to="/flow/assessment" replace />
                  ) : (
                    <div className="flow-scroll">
                      <RoutineStep
                        plan={flow.state.routine}
                        classification={flow.state.classification}
                        recap={{
                          areaLabel: selectedSubArea
                            ? subAreaToDisplayName.get(selectedSubArea) ??
                              selectedSubArea.replaceAll('-', ' ')
                            : 'Selected pain area',
                          durationLabel: durationLabel(flow.state.assessment?.painDuration ?? '1to6w'),
                          aggravatingLabel: aggravatingLabel(
                            flow.state.assessment?.aggravatingMovement ?? 'sittingLong'
                          ),
                        }}
                        onCompleteSession={completeSession}
                        onContinue={() => navigate('/flow/progress')}
                      />
                    </div>
                  )
                }
              />

              <Route
                path="/flow/progress"
                element={
                  <div className="flow-scroll">
                    <ProgressStep
                      snapshot={flow.state.progress}
                      onUpdatePain={handlePainScoreUpdate}
                      onNext={() => navigate('/flow/routine')}
                    />
                  </div>
                }
              />

              <Route
                path="/flow/setup"
                element={
                  !flow.state.setup ? (
                    <Navigate to="/flow/assessment" replace />
                  ) : (
                    <div className="flow-scroll">
                      <SetupStep setup={flow.state.setup} onRestart={handleRestart} />
                    </div>
                  )
                }
              />

              <Route
                path="/exercise/:exerciseId"
                element={
                  <>
                    <ExerciseRouteSync
                      onSync={(sa, z) => {
                        setSelectedSubArea(sa);
                        if (z) setSelectedZone(z);
                      }}
                    />
                    <ExercisePage />
                  </>
                }
              />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/evidence" element={<EvidencePage />} />
              <Route path="/clinician-finder" element={<ClinicianPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
