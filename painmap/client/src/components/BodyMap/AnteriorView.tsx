import type { ReactNode } from 'react';

interface Props {
  hitLayer: ReactNode;
}

export function AnteriorView({ hitLayer }: Props) {
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
        <path d="M170,100 Q200,128 230,100" strokeWidth={0.7} />
        <path d="M180,70 Q200,67 220,70" strokeWidth={0.6} opacity={0.5} />
        <path d="M178,118 L174,150 L178,162" />
        <path d="M222,118 L226,150 L222,162" />
        <path d="M178,162 Q200,158 222,162" strokeWidth={0.8} />
        <path d="M180,166 L130,180" strokeWidth={0.7} opacity={0.6} />
        <path d="M220,166 L270,180" strokeWidth={0.7} opacity={0.6} />
        <path d="M178,162 Q140,165 118,178 Q100,195 100,220 Q100,260 120,290" />
        <path d="M222,162 Q260,165 282,178 Q300,195 300,220 Q300,260 280,290" />
        <path d="M180,180 Q200,220 220,180" strokeWidth={0.7} opacity={0.6} />
        <path d="M200,200 L200,260" strokeWidth={0.5} opacity={0.4} />
        <path d="M120,290 Q126,330 138,360 L150,395" />
        <path d="M280,290 Q274,330 262,360 L250,395" />
        <path d="M155,235 Q200,255 245,235" strokeWidth={0.5} opacity={0.4} />
        <path d="M150,260 Q200,280 250,260" strokeWidth={0.5} opacity={0.4} />
        <path d="M200,280 L200,395" strokeWidth={0.5} opacity={0.4} />
        <path d="M150,395 Q200,408 250,395" strokeWidth={0.8} />
        <path d="M118,178 Q92,250 86,330 Q85,370 90,400" />
        <path d="M120,290 Q104,330 100,400" />
        <path d="M282,178 Q308,250 314,330 Q315,370 310,400" />
        <path d="M280,290 Q296,330 300,400" />
        <path d="M88,400 L110,400" strokeWidth={0.8} />
        <path d="M290,400 L312,400" strokeWidth={0.8} />
        <path d="M88,400 Q78,420 80,440 Q82,460 96,470 Q108,478 116,470 L114,440 L110,400" />
        <path d="M312,400 Q322,420 320,440 Q318,460 304,470 Q292,478 284,470 L286,440 L290,400" />
        <path d="M92,460 L93,475" strokeWidth={0.4} opacity={0.4} />
        <path d="M100,463 L101,478" strokeWidth={0.4} opacity={0.4} />
        <path d="M108,463 L109,478" strokeWidth={0.4} opacity={0.4} />
        <path d="M308,460 L307,475" strokeWidth={0.4} opacity={0.4} />
        <path d="M300,463 L299,478" strokeWidth={0.4} opacity={0.4} />
        <path d="M292,463 L291,478" strokeWidth={0.4} opacity={0.4} />

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
