import type { AnimationView } from './types';

interface Props {
  view: AnimationView;
}

export function HumanFigure({ view }: Props) {
  switch (view) {
    case 'standing-front':
      return <StandingFront />;
    case 'standing-side':
      return <StandingSide />;
    case 'seated-side':
      return <SeatedSide />;
    case 'supine':
      return <Supine />;
    case 'side-lying':
      return <SideLying />;
    case 'arm-close-up':
      return <ArmCloseUp />;
    case 'leg-close-up':
      return <LegCloseUp />;
    case 'hand-close-up':
      return <HandCloseUp />;
  }
}

function StandingFront() {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <g className="ea-head-group">
          <circle cx="120" cy="34" r="14" className="ea-head" />
          <line x1="120" y1="48" x2="120" y2="58" className="ea-neck" />
        </g>
        <g className="ea-torso-group">
          <line x1="120" y1="58" x2="120" y2="148" className="ea-spine" />
          <line x1="90" y1="64" x2="150" y2="64" className="ea-shoulders" />
          <line x1="100" y1="148" x2="140" y2="148" className="ea-pelvis" />
        </g>
        <g className="ea-arm-left">
          <line x1="90" y1="64" x2="80" y2="108" className="ea-upperarm-l" />
          <line x1="80" y1="108" x2="78" y2="150" className="ea-forearm-l" />
          <circle cx="78" cy="154" r="3.5" className="ea-hand-l" />
        </g>
        <g className="ea-arm-right">
          <line x1="150" y1="64" x2="160" y2="108" className="ea-upperarm-r" />
          <line x1="160" y1="108" x2="162" y2="150" className="ea-forearm-r" />
          <circle cx="162" cy="154" r="3.5" className="ea-hand-r" />
        </g>
        <g className="ea-leg-left">
          <line x1="100" y1="148" x2="96" y2="206" className="ea-thigh-l" />
          <line x1="96" y1="206" x2="98" y2="258" className="ea-shin-l" />
          <line x1="92" y1="258" x2="106" y2="258" className="ea-foot-l" />
        </g>
        <g className="ea-leg-right">
          <line x1="140" y1="148" x2="144" y2="206" className="ea-thigh-r" />
          <line x1="144" y1="206" x2="142" y2="258" className="ea-shin-r" />
          <line x1="134" y1="258" x2="148" y2="258" className="ea-foot-r" />
        </g>
        <g className="ea-band">
          <path
            d="M 60 158 Q 120 178 180 158 Q 188 200 120 220 Q 52 200 60 158 Z"
            className="ea-band-shape"
          />
        </g>
        <line x1="40" y1="270" x2="200" y2="270" className="ea-floor" />
      </g>
    </svg>
  );
}

function StandingSide() {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <g className="ea-head-group">
          <circle cx="118" cy="34" r="14" className="ea-head" />
          <line x1="118" y1="48" x2="120" y2="58" className="ea-neck" />
        </g>
        <line x1="120" y1="58" x2="122" y2="148" className="ea-spine" />
        <g className="ea-arm-right">
          <line x1="122" y1="68" x2="118" y2="114" className="ea-upperarm-r" />
          <line x1="118" y1="114" x2="148" y2="138" className="ea-forearm-r" />
          <circle cx="152" cy="140" r="3.5" className="ea-hand-r" />
        </g>
        <g className="ea-leg-right">
          <line x1="122" y1="148" x2="124" y2="206" className="ea-thigh-r" />
          <line x1="124" y1="206" x2="120" y2="258" className="ea-shin-r" />
          <line x1="112" y1="258" x2="138" y2="258" className="ea-foot-r" />
        </g>
        <g className="ea-band">
          <path
            d="M 70 200 Q 122 184 174 168"
            className="ea-band-shape"
            fill="none"
          />
        </g>
        <line x1="40" y1="270" x2="200" y2="270" className="ea-floor" />
      </g>
    </svg>
  );
}

function SeatedSide() {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <g className="ea-head-group">
          <circle cx="102" cy="60" r="14" className="ea-head" />
          <line x1="102" y1="74" x2="106" y2="92" className="ea-neck" />
        </g>
        <line x1="106" y1="92" x2="120" y2="158" className="ea-spine" />
        <g className="ea-arm-right">
          <line x1="118" y1="100" x2="138" y2="138" className="ea-upperarm-r" />
          <line x1="138" y1="138" x2="156" y2="160" className="ea-forearm-r" />
          <circle cx="160" cy="162" r="3.5" className="ea-hand-r" />
        </g>
        <g className="ea-leg-right">
          <line x1="120" y1="158" x2="186" y2="158" className="ea-thigh-r" />
          <line x1="186" y1="158" x2="186" y2="222" className="ea-shin-r" />
          <line x1="180" y1="222" x2="200" y2="222" className="ea-foot-r" />
        </g>
        <rect x="118" y="158" width="80" height="6" className="ea-bench" />
        <line x1="40" y1="232" x2="200" y2="232" className="ea-floor" />
      </g>
    </svg>
  );
}

function Supine() {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1="20" y1="160" x2="260" y2="160" className="ea-floor" />
        <g className="ea-head-group">
          <circle cx="42" cy="120" r="14" className="ea-head" />
        </g>
        <line x1="56" y1="120" x2="148" y2="124" className="ea-spine" />
        <line x1="148" y1="124" x2="156" y2="120" className="ea-pelvis" />
        <g className="ea-arm-left">
          <line x1="56" y1="120" x2="78" y2="148" className="ea-upperarm-l" />
          <line x1="78" y1="148" x2="92" y2="155" className="ea-forearm-l" />
        </g>
        <g className="ea-leg-right">
          <line x1="156" y1="120" x2="200" y2="116" className="ea-thigh-r" />
          <line x1="200" y1="116" x2="240" y2="156" className="ea-shin-r" />
        </g>
        <g className="ea-leg-left">
          <line x1="156" y1="124" x2="198" y2="124" className="ea-thigh-l" />
          <line x1="198" y1="124" x2="240" y2="156" className="ea-shin-l" />
        </g>
        <g className="ea-band">
          <path d="M 192 110 Q 200 120 208 110" className="ea-band-shape" fill="none" />
        </g>
      </g>
    </svg>
  );
}

function SideLying() {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1="20" y1="170" x2="260" y2="170" className="ea-floor" />
        <g className="ea-head-group">
          <circle cx="42" cy="130" r="14" className="ea-head" />
        </g>
        <line x1="56" y1="130" x2="148" y2="138" className="ea-spine" />
        <g className="ea-arm-right">
          <line x1="64" y1="128" x2="76" y2="142" className="ea-upperarm-r" />
        </g>
        <g className="ea-leg-bottom">
          <line x1="148" y1="138" x2="200" y2="148" className="ea-thigh-l" />
          <line x1="200" y1="148" x2="200" y2="168" className="ea-shin-l" />
        </g>
        <g className="ea-leg-top">
          <line x1="148" y1="138" x2="200" y2="138" className="ea-thigh-r" />
          <line x1="200" y1="138" x2="200" y2="158" className="ea-shin-r" />
        </g>
        <g className="ea-band">
          <ellipse cx="200" cy="148" rx="14" ry="4" className="ea-band-shape" fill="none" />
        </g>
      </g>
    </svg>
  );
}

function ArmCloseUp() {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1="40" y1="170" x2="240" y2="170" className="ea-floor" />
        <g className="ea-arm-right">
          <line x1="60" y1="80" x2="120" y2="120" className="ea-upperarm-r" />
          <circle cx="120" cy="120" r="5" className="ea-joint-elbow" />
          <line x1="120" y1="120" x2="210" y2="120" className="ea-forearm-r" />
          <g className="ea-hand-group">
            <line x1="210" y1="120" x2="232" y2="118" className="ea-hand-r" />
            <line x1="210" y1="120" x2="226" y2="108" className="ea-thumb" />
          </g>
        </g>
        <g className="ea-band">
          <path d="M 220 130 Q 240 145 232 168" className="ea-band-shape" fill="none" />
        </g>
      </g>
    </svg>
  );
}

function LegCloseUp() {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1="20" y1="270" x2="220" y2="270" className="ea-floor" />
        <line x1="100" y1="40" x2="100" y2="120" className="ea-thigh-r" />
        <circle cx="100" cy="124" r="5" className="ea-joint-knee" />
        <line x1="100" y1="124" x2="100" y2="210" className="ea-shin-r" />
        <g className="ea-foot-group">
          <line x1="100" y1="210" x2="100" y2="240" className="ea-ankle" />
          <line x1="92" y1="240" x2="148" y2="240" className="ea-foot-r" />
          <line x1="148" y1="240" x2="152" y2="232" className="ea-toes" />
        </g>
        <rect x="60" y="240" width="80" height="6" className="ea-step" />
        <g className="ea-band">
          <path d="M 120 220 Q 160 230 170 250" className="ea-band-shape" fill="none" />
        </g>
      </g>
    </svg>
  );
}

function HandCloseUp() {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1="20" y1="170" x2="260" y2="170" className="ea-floor" />
        <g className="ea-shoulder-group">
          <circle cx="50" cy="70" r="6" className="ea-joint-shoulder" />
        </g>
        <line x1="50" y1="70" x2="140" y2="90" className="ea-upperarm-r" />
        <circle cx="140" cy="90" r="5" className="ea-joint-elbow" />
        <g className="ea-forearm-group">
          <line x1="140" y1="90" x2="220" y2="60" className="ea-forearm-r" />
          <g className="ea-hand-group">
            <line x1="220" y1="60" x2="240" y2="48" className="ea-hand-r" />
            <line x1="220" y1="60" x2="232" y2="40" className="ea-fingers" />
          </g>
        </g>
      </g>
    </svg>
  );
}
