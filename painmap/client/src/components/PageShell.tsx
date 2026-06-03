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
import { ZonePage } from '../routes/ZonePage';
import { ExercisePage } from '../routes/ExercisePage';
import { AboutPage } from '../routes/AboutPage';
import { LegalPage } from '../routes/LegalPage';
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
import { BodyAreaStep } from './Flow/BodyAreaStep';
import { AssessmentFlow } from './Flow/AssessmentFlow';

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

export function PageShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { data: zones } = useZones();
  const { t } = useTranslation();

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
      navigate(`/zone/${zoneId}`);
    },
    [navigate]
  );

  const handleSubAreaSelect = useCallback(
    (subAreaId: string, primaryExerciseId?: string | null) => {
      const exId = primaryExerciseId ?? subAreaToExerciseId.get(subAreaId) ?? null;
      const zoneId = selectedZone ?? subAreaToZoneId.get(subAreaId) ?? null;

      if (zoneId) setSelectedZone(zoneId);
      setSelectedSubArea(subAreaId);
      if (exId) {
        navigate(`/exercise/${exId}`);
      } else {
        navigate('/flow/map');
      }
    },
    [navigate, selectedZone, subAreaToExerciseId, subAreaToZoneId]
  );

  const handleBack = useCallback(() => {
    if (selectedSubArea) {
      if (selectedZone) navigate(`/zone/${selectedZone}`);
      else navigate('/flow/map');
    } else {
      navigate('/');
    }
  }, [navigate, selectedZone, selectedSubArea]);

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
    location.pathname === '/clinician-finder';

  const routeKind: 'map' | 'zone' | 'exercise' | 'page' = isStaticPage
    ? 'page'
    : location.pathname.startsWith('/exercise')
      ? 'exercise'
      : location.pathname.startsWith('/zone')
        ? 'zone'
        : 'map';

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
              <Route path="/" element={<Navigate to="/flow/map" replace />} />

              <Route
                path="/flow/map"
                element={
                  <MapRoute
                    onReset={() => {
                      setSelectedZone(null);
                      setSelectedSubArea(null);
                    }}
                    eyebrow={t('flow.pane.bodyArea')}
                  />
                }
              />

              <Route
                path="/flow/assessment"
                element={<AssessmentFlow />}
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

/**
 * The /flow/map route content. Rendered as a named component so it can call
 * useEffect at the top level (Rules of Hooks), resetting map selection once on
 * route-enter without an infinite loop.
 */
function MapRoute({ onReset, eyebrow }: { onReset: () => void; eyebrow: string }) {
  useEffect(() => {
    onReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flow-scroll">
      <PaneEyebrow num="01" label={eyebrow} />
      <BodyAreaStep />
    </div>
  );
}
