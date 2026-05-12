import { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SafetyBanner } from './SafetyBanner';
import { TopHeader } from './TopHeader';
import { SiteFooter } from './SiteFooter';
import { BodyMap } from './BodyMap/BodyMap';
import { PaneEyebrow } from './PaneEyebrow';
import { HomePage } from '../routes/HomePage';
import { ZonePage } from '../routes/ZonePage';
import { ExercisePage } from '../routes/ExercisePage';
import { useZones } from '../api/exercises';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  type BodyView,
  type ZoneId,
  ZONES_BY_VIEW,
} from './BodyMap/zones';

const ALL_ZONE_IDS: readonly ZoneId[] = ['neck', 'shoulders', 'back', 'hands-wrists'] as const;

function isZoneId(value: string | undefined): value is ZoneId {
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

function HomeRouteSync({ onSync }: { onSync: () => void }) {
  useEffect(() => {
    onSync();
  }, [onSync]);
  return null;
}

export function PageShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { data: zones } = useZones();

  const [view, setView] = useState<BodyView>('anterior');
  const [bannerVisible, setBannerVisible] = useState(true);
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

  // Auto-flip view when the selected zone is posterior-only and user is on anterior.
  useEffect(() => {
    if (selectedZone === 'back' && view === 'anterior') {
      setView('posterior');
    }
  }, [selectedZone, view]);

  // If user is on a back-zone route and flips back to anterior, send them home.
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
      const exId =
        primaryExerciseId ?? subAreaToExerciseId.get(subAreaId) ?? null;
      if (exId) navigate(`/exercise/${exId}`);
    },
    [navigate, subAreaToExerciseId]
  );

  const handleBack = useCallback(() => {
    if (selectedSubArea) {
      if (selectedZone) navigate(`/zone/${selectedZone}`);
      else navigate('/');
    } else {
      navigate('/');
    }
  }, [navigate, selectedZone, selectedSubArea]);

  // Esc handler: pop one level at a time.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selectedSubArea && selectedZone) {
        navigate(`/zone/${selectedZone}`);
      } else if (selectedZone) {
        navigate('/');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, selectedSubArea, selectedZone]);

  const enabledZonesForView = ZONES_BY_VIEW[view];
  // Display a still-disabled selected zone (e.g. back on anterior) but the
  // auto-flip effect above will switch the view momentarily.
  const isZoneInView = selectedZone ? enabledZonesForView.includes(selectedZone) : true;

  const routeKind: 'home' | 'zone' | 'exercise' = location.pathname.startsWith('/exercise')
    ? 'exercise'
    : location.pathname.startsWith('/zone')
      ? 'zone'
      : 'home';

  return (
    <>
      {bannerVisible && <SafetyBanner onDismiss={() => setBannerVisible(false)} />}
      <TopHeader />

      <main className="layout" data-route={routeKind}>
        <section className="pane pane-left">
          <PaneEyebrow num="01" label="SELECT" />
          <h1 className="page-title">
            <span className="pt-serif">Where</span>
            <span className="pt-serif pt-italic"> does it hurt?</span>
          </h1>
          <p className="page-sub">
            Click a highlighted area on the body. We&apos;ll surface the single resistance-band
            exercise with the strongest evidence for that pain location.
          </p>

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
                    <HomeRouteSync
                      onSync={() => {
                        setSelectedZone(null);
                        setSelectedSubArea(null);
                      }}
                    />
                    <HomePage onPickZone={handleZoneSelect} />
                  </>
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
            </Routes>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
