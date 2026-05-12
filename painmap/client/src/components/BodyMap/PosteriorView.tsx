import type { ReactNode } from 'react';

interface Props {
  hitLayer: ReactNode;
}

export function PosteriorView({ hitLayer }: Props) {
  return (
    <>
      <g
        stroke="var(--ink)"
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx={200} cy={80} rx={38} ry={48} />
        <path d="M174,90 Q200,100 226,90" strokeWidth={0.5} opacity={0.4} />
        <path d="M178,118 L174,150 L178,162" />
        <path d="M222,118 L226,150 L222,162" />
        <path d="M178,162 Q200,158 222,162" strokeWidth={0.8} />
        <path d="M178,162 Q140,165 118,178 Q100,195 100,220 Q100,260 120,290" />
        <path d="M222,162 Q260,165 282,178 Q300,195 300,220 Q300,260 280,290" />
        <path d="M200,128 L155,232 L200,310 L245,232 Z" strokeWidth={0.6} opacity={0.5} />
        <path d="M200,128 L200,400" strokeWidth={0.6} opacity={0.5} />
        <path d="M160,182 Q142,200 148,232 Q156,256 184,250" strokeWidth={0.6} opacity={0.55} />
        <path d="M240,182 Q258,200 252,232 Q244,256 216,250" strokeWidth={0.6} opacity={0.55} />
        <path d="M130,260 Q160,310 162,360" strokeWidth={0.6} opacity={0.5} />
        <path d="M270,260 Q240,310 238,360" strokeWidth={0.6} opacity={0.5} />
        <path d="M120,290 Q126,330 138,360 L150,395" />
        <path d="M280,290 Q274,330 262,360 L250,395" />
        <path d="M184,340 L184,395" strokeWidth={0.5} opacity={0.4} />
        <path d="M216,340 L216,395" strokeWidth={0.5} opacity={0.4} />
        <path d="M150,395 Q200,408 250,395" strokeWidth={0.8} />
        <path d="M118,178 Q92,250 86,330 Q85,370 90,400" />
        <path d="M120,290 Q104,330 100,400" />
        <path d="M282,178 Q308,250 314,330 Q315,370 310,400" />
        <path d="M280,290 Q296,330 300,400" />
        <path d="M88,400 L110,400" strokeWidth={0.8} />
        <path d="M290,400 L312,400" strokeWidth={0.8} />
        <path d="M88,400 Q78,420 80,440 Q82,460 96,470 Q108,478 116,470 L114,440 L110,400" />
        <path d="M312,400 Q322,420 320,440 Q318,460 304,470 Q292,478 284,470 L286,440 L290,400" />
        <path d="M86,455 Q100,460 116,455" strokeWidth={0.4} opacity={0.4} />
        <path d="M284,455 Q300,460 314,455" strokeWidth={0.4} opacity={0.4} />

        <path d="M150,395 Q156,460 162,520 L168,580" />
        <path d="M250,395 Q244,460 238,520 L232,580" />
        <path d="M200,408 L196,520 L194,580" strokeWidth={0.5} opacity={0.5} />
        <path d="M168,580 L196,580" strokeWidth={0.8} />
        <path d="M232,580 L204,580" strokeWidth={0.8} />
      </g>

      {hitLayer}
    </>
  );
}
