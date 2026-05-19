import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FULL_VIEWBOX,
  MOBILE_ZONE_VIEWBOX,
  ZONE_LABELS,
  ZONE_VIEWBOX,
  ZONES_BY_VIEW,
  type BodyView,
  type ZoneId,
} from './zones';
import { AnteriorView } from './AnteriorView';
import { PosteriorView } from './PosteriorView';
import { HitRegions } from './HitRegions';
import { SubAreaHotspots } from './SubAreaHotspots';

interface Props {
  view: BodyView;
  selectedZone: ZoneId | null;
  selectedSubAreaId: string | null;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  onViewChange: (view: BodyView) => void;
  onZoneSelect: (zoneId: ZoneId) => void;
  onSubAreaSelect: (subAreaId: string) => void;
  onBack: () => void;
}

const ZOOM_DURATION = 700;
const RESET_DURATION = 600;

function animateViewBox(
  from: string,
  to: string,
  duration: number,
  onUpdate: (vb: string) => void
): () => void {
  const a = from.split(' ').map(Number);
  const b = to.split(' ').map(Number);
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  let rafId = 0;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    const e = ease(t);
    const vb = a.map((v, i) => v + (b[i] - v) * e).join(' ');
    onUpdate(vb);
    if (t < 1) rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

export function BodyMap({
  view,
  selectedZone,
  selectedSubAreaId,
  prefersReducedMotion,
  isMobile,
  onViewChange,
  onZoneSelect,
  onSubAreaSelect,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const zoneViewboxMap = isMobile ? MOBILE_ZONE_VIEWBOX : ZONE_VIEWBOX;
  const [viewBox, setViewBox] = useState(
    selectedZone ? zoneViewboxMap[selectedZone] : FULL_VIEWBOX
  );
  const [showSubs, setShowSubs] = useState<boolean>(!!selectedZone);
  const [hoverZone, setHoverZone] = useState<ZoneId | null>(null);
  const lastZoneRef = useRef<ZoneId | null>(selectedZone);

  useEffect(() => {
    if (lastZoneRef.current === selectedZone) return;
    lastZoneRef.current = selectedZone;

    let cleanup: (() => void) | null = null;
    const currentVb = viewBox;

    if (selectedZone) {
      const target = zoneViewboxMap[selectedZone];
      if (prefersReducedMotion) {
        setViewBox(target);
        setShowSubs(true);
      } else {
        setShowSubs(false);
        cleanup = animateViewBox(currentVb, target, ZOOM_DURATION, setViewBox);
        const reveal = window.setTimeout(() => setShowSubs(true), ZOOM_DURATION);
        const prev = cleanup;
        cleanup = () => {
          prev?.();
          window.clearTimeout(reveal);
        };
      }
    } else {
      setShowSubs(false);
      if (prefersReducedMotion) {
        setViewBox(FULL_VIEWBOX);
      } else {
        cleanup = animateViewBox(currentVb, FULL_VIEWBOX, RESET_DURATION, setViewBox);
      }
    }

    return () => cleanup?.();
    // viewBox intentionally omitted: we want the latest committed value at the time
    // the zone changes (read via closure on currentVb above) but not to re-run
    // this effect for every animation frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone, prefersReducedMotion, zoneViewboxMap]);

  const enabledZones = ZONES_BY_VIEW[view];
  const zoneLabelFor = (z: ZoneId) => t(`zones.${z}`, { defaultValue: ZONE_LABELS[z] });
  const tooltip = !selectedZone && hoverZone ? zoneLabelFor(hoverZone) : null;

  const ViewSvg = view === 'anterior' ? AnteriorView : PosteriorView;

  return (
    <div className="bodymap-wrap">
      <div className="bodymap-topbar">
        {selectedZone ? (
          <button
            type="button"
            className="breadcrumb"
            onClick={onBack}
            aria-label={t('bodyMap.backToFullBodyAria')}
          >
            <span className="chev">‹</span>
            <span className="bc-text">
              {t('bodyMap.bodyLabel')} <span className="bc-sep">/</span> {zoneLabelFor(selectedZone)}
            </span>
          </button>
        ) : (
          <div className="bodymap-label">{t('bodyMap.fullBody')}</div>
        )}

        <div className="view-toggle" role="tablist" aria-label={t('bodyMap.viewToggleAria')}>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'anterior'}
            className={view === 'anterior' ? 'vt-btn active' : 'vt-btn'}
            onClick={() => onViewChange('anterior')}
          >
            {t('bodyMap.anterior')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'posterior'}
            className={view === 'posterior' ? 'vt-btn active' : 'vt-btn'}
            onClick={() => onViewChange('posterior')}
          >
            {t('bodyMap.posterior')}
          </button>
        </div>
      </div>

      <div className="bodymap-canvas">
        <svg
          viewBox={viewBox}
          className="body-svg-outer"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={view === 'anterior' ? t('bodyMap.ariaAnterior') : t('bodyMap.ariaPosterior')}
        >
          <ViewSvg
            hitLayer={
              <HitRegions
                view={view}
                enabledZones={enabledZones}
                hoverZone={hoverZone}
                selectedZone={selectedZone}
                onZoneEnter={setHoverZone}
                onZoneLeave={() => setHoverZone(null)}
                onZoneClick={onZoneSelect}
              />
            }
          />

          {showSubs && selectedZone && (
            <SubAreaHotspots
              view={view}
              zoneId={selectedZone}
              selectedSubAreaId={selectedSubAreaId}
              prefersReducedMotion={prefersReducedMotion}
              viewBoxScale={(parseFloat(viewBox.split(' ')[2] || '400') || 400) / 400}
              onSelect={onSubAreaSelect}
            />
          )}
        </svg>

        {tooltip && (
          <div className="map-tooltip" role="tooltip">
            {tooltip}
          </div>
        )}
      </div>
    </div>
  );
}
