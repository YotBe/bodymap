import type { ReactNode } from 'react';
import type { AnimationView } from './types';

/* Anatomical-line figures matching the body-map art language
   (painmap/src/components/BodyMap/AnteriorView.tsx).
   - Outlined organic curves, no fills (fills are reserved for muscle overlay).
   - Subtle secondary detail lines at lower opacity.
   - Joint coordinates are STABLE: the existing 22 keyframe rules in
     exerciseAnimation.css rely on these transform-origins. Do not move
     a shoulder/elbow/hip/knee anchor without updating the CSS to match.
   - `children` slot is rendered inside the SVG, behind the moving figure,
     so a muscle overlay shares the figure's coordinate space. */

interface Props {
  view: AnimationView;
  children?: ReactNode;
}

export function HumanFigure({ view, children }: Props) {
  switch (view) {
    case 'standing-front':
      return <StandingFront>{children}</StandingFront>;
    case 'standing-side':
      return <StandingSide>{children}</StandingSide>;
    case 'seated-side':
      return <SeatedSide>{children}</SeatedSide>;
    case 'supine':
      return <Supine>{children}</Supine>;
    case 'side-lying':
      return <SideLying>{children}</SideLying>;
    case 'arm-close-up':
      return <ArmCloseUp>{children}</ArmCloseUp>;
    case 'leg-close-up':
      return <LegCloseUp>{children}</LegCloseUp>;
    case 'hand-close-up':
      return <HandCloseUp>{children}</HandCloseUp>;
  }
}

interface VariantProps {
  children?: ReactNode;
}

function StandingFront({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        {/* Head */}
        <g className="ea-head-group">
          <ellipse cx={120} cy={34} rx={13} ry={16} className="ea-head" />
          <path d="M110,38 Q120,46 130,38" className="ea-detail" />
          <path d="M120,50 L120,58" className="ea-neck" />
        </g>

        {/* Torso */}
        <g className="ea-torso-group">
          {/* shoulder line + clavicle hint */}
          <path d="M90,64 Q120,60 150,64" className="ea-shoulders" />
          <path d="M100,68 Q120,72 140,68" className="ea-detail" />
          {/* ribcage */}
          <path d="M90,64 Q86,100 100,148" className="ea-torso-edge-l" />
          <path d="M150,64 Q154,100 140,148" className="ea-torso-edge-r" />
          {/* sternum / spine */}
          <line x1={120} y1={66} x2={120} y2={148} className="ea-spine ea-detail" />
          {/* pelvis */}
          <path d="M100,148 Q120,154 140,148" className="ea-pelvis" />
        </g>

        {/* Left arm */}
        <g className="ea-arm-left">
          <path d="M90,64 Q82,86 80,108" className="ea-upperarm-l" />
          <circle cx={80} cy={108} r={2.6} className="ea-joint" />
          <path d="M80,108 Q78,130 78,150" className="ea-forearm-l" />
          <circle cx={78} cy={154} r={4} className="ea-hand-l" />
        </g>

        {/* Right arm */}
        <g className="ea-arm-right">
          <path d="M150,64 Q158,86 160,108" className="ea-upperarm-r" />
          <circle cx={160} cy={108} r={2.6} className="ea-joint" />
          <path d="M160,108 Q162,130 162,150" className="ea-forearm-r" />
          <circle cx={162} cy={154} r={4} className="ea-hand-r" />
        </g>

        {/* Left leg */}
        <g className="ea-leg-left">
          <path d="M100,148 Q96,178 96,206" className="ea-thigh-l" />
          <circle cx={96} cy={206} r={2.6} className="ea-joint" />
          <path d="M96,206 Q98,232 98,258" className="ea-shin-l" />
          <path d="M92,258 Q99,262 106,258" className="ea-foot-l" />
        </g>

        {/* Right leg */}
        <g className="ea-leg-right">
          <path d="M140,148 Q144,178 144,206" className="ea-thigh-r" />
          <circle cx={144} cy={206} r={2.6} className="ea-joint" />
          <path d="M144,206 Q142,232 142,258" className="ea-shin-r" />
          <path d="M134,258 Q141,262 148,258" className="ea-foot-r" />
        </g>

        {/* Resistance band */}
        <g className="ea-band">
          <path
            d="M 60 158 Q 120 178 180 158 Q 188 200 120 220 Q 52 200 60 158 Z"
            className="ea-band-shape"
          />
        </g>

        <line x1={40} y1={270} x2={200} y2={270} className="ea-floor" />
        {children}
      </g>
    </svg>
  );
}

function StandingSide({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <g className="ea-head-group">
          <ellipse cx={118} cy={34} rx={13} ry={16} className="ea-head" />
          <path d="M124,30 Q128,32 130,38" className="ea-detail" />
          <path d="M118,50 L120,58" className="ea-neck" />
        </g>

        {/* Torso curve (side view): chest forward, glute back */}
        <path d="M120,58 Q124,90 122,128 Q120,140 122,148" className="ea-spine" />
        <path d="M120,68 Q132,90 128,128" className="ea-torso-edge-r ea-detail" />
        <path d="M120,68 Q108,90 112,128" className="ea-torso-edge-l ea-detail" />

        <g className="ea-arm-right">
          <path d="M122,68 Q120,90 118,114" className="ea-upperarm-r" />
          <circle cx={118} cy={114} r={2.6} className="ea-joint" />
          <path d="M118,114 Q132,128 148,138" className="ea-forearm-r" />
          <circle cx={152} cy={140} r={4} className="ea-hand-r" />
        </g>

        <g className="ea-leg-right">
          <path d="M122,148 Q124,178 124,206" className="ea-thigh-r" />
          <circle cx={124} cy={206} r={2.6} className="ea-joint" />
          <path d="M124,206 Q122,232 120,258" className="ea-shin-r" />
          <path d="M112,258 Q126,262 138,258" className="ea-foot-r" />
        </g>

        <g className="ea-band">
          <path d="M 70 200 Q 122 184 174 168" className="ea-band-shape" fill="none" />
        </g>
        <line x1={40} y1={270} x2={200} y2={270} className="ea-floor" />
        {children}
      </g>
    </svg>
  );
}

function SeatedSide({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <g className="ea-head-group">
          <ellipse cx={102} cy={60} rx={13} ry={16} className="ea-head" />
          <path d="M108,56 Q112,58 113,64" className="ea-detail" />
          <path d="M102,76 Q104,84 106,92" className="ea-neck" />
        </g>

        <path d="M106,92 Q114,124 120,158" className="ea-spine" />
        <path d="M108,100 Q120,124 124,158" className="ea-torso-edge-r ea-detail" />

        <g className="ea-arm-right">
          <path d="M118,100 Q128,118 138,138" className="ea-upperarm-r" />
          <circle cx={138} cy={138} r={2.6} className="ea-joint" />
          <path d="M138,138 Q147,150 156,160" className="ea-forearm-r" />
          <circle cx={160} cy={162} r={4} className="ea-hand-r" />
        </g>

        <g className="ea-leg-right">
          <path d="M120,158 Q153,158 186,158" className="ea-thigh-r" />
          <circle cx={186} cy={158} r={2.6} className="ea-joint" />
          <path d="M186,158 Q186,190 186,222" className="ea-shin-r" />
          <path d="M180,222 Q190,224 200,222" className="ea-foot-r" />
        </g>

        <rect x={118} y={158} width={80} height={6} className="ea-bench" />
        <line x1={40} y1={232} x2={200} y2={232} className="ea-floor" />
        {children}
      </g>
    </svg>
  );
}

function Supine({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1={20} y1={160} x2={260} y2={160} className="ea-floor" />

        <g className="ea-head-group">
          <ellipse cx={42} cy={120} rx={13} ry={15} className="ea-head" />
          <path d="M40,114 Q44,116 48,120" className="ea-detail" />
        </g>

        {/* Spine + torso edge (lying horizontal) */}
        <path d="M56,120 Q102,122 148,124" className="ea-spine" />
        <path d="M56,110 Q102,114 148,118" className="ea-torso-edge-r ea-detail" />
        <path d="M56,130 Q102,134 148,134" className="ea-torso-edge-l ea-detail" />
        <path d="M148,124 Q152,122 156,120" className="ea-pelvis" />

        <g className="ea-arm-left">
          <path d="M56,120 Q68,134 78,148" className="ea-upperarm-l" />
          <circle cx={78} cy={148} r={2.6} className="ea-joint" />
          <path d="M78,148 Q85,152 92,155" className="ea-forearm-l" />
        </g>

        <g className="ea-leg-right">
          <path d="M156,120 Q178,118 200,116" className="ea-thigh-r" />
          <circle cx={200} cy={116} r={2.6} className="ea-joint" />
          <path d="M200,116 Q220,136 240,156" className="ea-shin-r" />
        </g>

        <g className="ea-leg-left">
          <path d="M156,124 Q177,124 198,124" className="ea-thigh-l" />
          <circle cx={198} cy={124} r={2.6} className="ea-joint" />
          <path d="M198,124 Q219,140 240,156" className="ea-shin-l" />
        </g>

        <g className="ea-band">
          <path d="M 192 110 Q 200 120 208 110" className="ea-band-shape" fill="none" />
        </g>
        {children}
      </g>
    </svg>
  );
}

function SideLying({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1={20} y1={170} x2={260} y2={170} className="ea-floor" />

        <g className="ea-head-group">
          <ellipse cx={42} cy={130} rx={13} ry={15} className="ea-head" />
          <path d="M48,128 Q52,130 54,134" className="ea-detail" />
        </g>

        <path d="M56,130 Q102,134 148,138" className="ea-spine" />
        <path d="M56,124 Q102,128 148,132" className="ea-torso-edge-r ea-detail" />

        <g className="ea-arm-right">
          <path d="M64,128 Q70,135 76,142" className="ea-upperarm-r" />
        </g>

        <g className="ea-leg-bottom">
          <path d="M148,138 Q174,143 200,148" className="ea-thigh-l" />
          <circle cx={200} cy={148} r={2.6} className="ea-joint" />
          <path d="M200,148 L200,168" className="ea-shin-l" />
        </g>

        <g className="ea-leg-top">
          <path d="M148,138 Q174,138 200,138" className="ea-thigh-r" />
          <circle cx={200} cy={138} r={2.6} className="ea-joint" />
          <path d="M200,138 L200,158" className="ea-shin-r" />
        </g>

        <g className="ea-band">
          <ellipse cx={200} cy={148} rx={14} ry={4} className="ea-band-shape" fill="none" />
        </g>
        {children}
      </g>
    </svg>
  );
}

function ArmCloseUp({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1={40} y1={170} x2={240} y2={170} className="ea-floor" />

        <g className="ea-arm-right">
          <path d="M60,80 Q90,100 120,120" className="ea-upperarm-r" />
          <circle cx={120} cy={120} r={5} className="ea-joint-elbow" />
          <path d="M120,120 Q165,118 210,120" className="ea-forearm-r" />
          <g className="ea-hand-group">
            <path d="M210,120 Q221,118 232,118" className="ea-hand-r" />
            <path d="M210,120 Q218,114 226,108" className="ea-thumb" />
            <path d="M232,118 Q236,121 234,126" className="ea-detail" />
          </g>
        </g>

        <g className="ea-band">
          <path d="M 220 130 Q 240 145 232 168" className="ea-band-shape" fill="none" />
        </g>
        {children}
      </g>
    </svg>
  );
}

function LegCloseUp({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 240 280" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1={20} y1={270} x2={220} y2={270} className="ea-floor" />

        <path d="M100,40 Q98,80 100,120" className="ea-thigh-r" />
        <circle cx={100} cy={124} r={5} className="ea-joint-knee" />
        <path d="M100,124 Q98,170 100,210" className="ea-shin-r" />

        <g className="ea-foot-group">
          <path d="M100,210 L100,240" className="ea-ankle" />
          <path d="M92,240 Q120,238 148,240" className="ea-foot-r" />
          <path d="M148,240 Q151,236 152,232" className="ea-toes" />
        </g>

        <rect x={60} y={240} width={80} height={6} className="ea-step" />

        <g className="ea-band">
          <path d="M 120 220 Q 160 230 170 250" className="ea-band-shape" fill="none" />
        </g>
        {children}
      </g>
    </svg>
  );
}

function HandCloseUp({ children }: VariantProps) {
  return (
    <svg viewBox="0 0 280 200" className="ea-svg" aria-hidden="true">
      <g className="ea-figure">
        <line x1={20} y1={170} x2={260} y2={170} className="ea-floor" />

        <g className="ea-shoulder-group">
          <circle cx={50} cy={70} r={6} className="ea-joint-shoulder" />
        </g>
        <path d="M50,70 Q95,80 140,90" className="ea-upperarm-r" />
        <circle cx={140} cy={90} r={5} className="ea-joint-elbow" />

        <g className="ea-forearm-group">
          <path d="M140,90 Q180,75 220,60" className="ea-forearm-r" />
          <g className="ea-hand-group">
            <path d="M220,60 Q230,54 240,48" className="ea-hand-r" />
            <path d="M220,60 Q226,50 232,40" className="ea-fingers" />
            <path d="M232,40 Q235,44 234,48" className="ea-detail" />
          </g>
        </g>
        {children}
      </g>
    </svg>
  );
}
