export type BodyView = 'anterior' | 'posterior';
export type ZoneId = 'neck' | 'shoulders' | 'back' | 'hands-wrists';

export const ZONE_LABELS: Record<ZoneId, string> = {
  neck: 'Neck',
  shoulders: 'Shoulders',
  back: 'Back',
  'hands-wrists': 'Hands & Wrists',
};

export const ZONE_VIEWBOX: Record<ZoneId, string> = {
  neck: '120 80 160 120',
  shoulders: '70 140 260 130',
  back: '100 160 200 260',
  'hands-wrists': '50 370 300 100',
};

// Portrait-aspect (≈0.667 = 4:6) zone viewBoxes for mobile. The desktop
// viewBoxes are wide (e.g. shoulders is 2:1) so on a phone container the
// SVG meet-fit results in barely any visible zoom. These crop tightly
// around the relevant hotspots while keeping enough body context.
export const MOBILE_ZONE_VIEWBOX: Record<ZoneId, string> = {
  neck: '130 60 140 210',
  shoulders: '100 100 200 300',
  back: '120 170 160 240',
  'hands-wrists': '40 180 320 480',
};

export const FULL_VIEWBOX = '0 0 400 600';

export const ZONES_BY_VIEW: Record<BodyView, ZoneId[]> = {
  anterior: ['neck', 'shoulders', 'hands-wrists'],
  posterior: ['neck', 'shoulders', 'back', 'hands-wrists'],
};

export interface SubAreaHotspot {
  subAreaId: string;
  x: number;
  y: number;
  label: string;
  showLabel: boolean;
}

export const SUB_AREA_HOTSPOTS: Record<BodyView, Partial<Record<ZoneId, SubAreaHotspot[]>>> = {
  anterior: {
    neck: [
      { subAreaId: 'neck-upper-trapezius', x: 152, y: 168, label: 'Upper Trap', showLabel: true },
      { subAreaId: 'neck-upper-trapezius', x: 248, y: 168, label: 'Upper Trap', showLabel: false },
      { subAreaId: 'neck-levator-scapulae', x: 188, y: 145, label: 'Levator', showLabel: true },
      { subAreaId: 'neck-cervical-paraspinals', x: 212, y: 145, label: 'Cervical', showLabel: true },
    ],
    shoulders: [
      { subAreaId: 'shoulders-deltoid', x: 130, y: 200, label: 'Deltoid', showLabel: true },
      { subAreaId: 'shoulders-deltoid', x: 270, y: 200, label: 'Deltoid', showLabel: false },
      { subAreaId: 'shoulders-rotator-cuff', x: 150, y: 225, label: 'Rot. Cuff', showLabel: true },
      { subAreaId: 'shoulders-rotator-cuff', x: 250, y: 225, label: 'Rot. Cuff', showLabel: false },
    ],
    'hands-wrists': [
      { subAreaId: 'wrist-flexor', x: 96, y: 410, label: 'Flexors', showLabel: true },
      { subAreaId: 'wrist-flexor', x: 304, y: 410, label: 'Flexors', showLabel: false },
      { subAreaId: 'wrist-extensor', x: 96, y: 392, label: 'Extensors', showLabel: true },
      { subAreaId: 'wrist-extensor', x: 304, y: 392, label: 'Extensors', showLabel: false },
      { subAreaId: 'elbow-lateral', x: 84, y: 348, label: 'Lat. Elbow', showLabel: true },
      { subAreaId: 'elbow-lateral', x: 316, y: 348, label: 'Lat. Elbow', showLabel: false },
      { subAreaId: 'elbow-medial', x: 108, y: 360, label: 'Med. Elbow', showLabel: true },
      { subAreaId: 'elbow-medial', x: 292, y: 360, label: 'Med. Elbow', showLabel: false },
    ],
  },
  posterior: {
    neck: [
      { subAreaId: 'neck-cervical-paraspinals', x: 200, y: 135, label: 'Cervical', showLabel: true },
      { subAreaId: 'neck-upper-trapezius', x: 178, y: 160, label: 'Upper Trap', showLabel: true },
      { subAreaId: 'neck-upper-trapezius', x: 222, y: 160, label: 'Upper Trap', showLabel: false },
      { subAreaId: 'neck-levator-scapulae', x: 188, y: 175, label: 'Levator', showLabel: true },
    ],
    shoulders: [
      { subAreaId: 'shoulders-deltoid', x: 130, y: 200, label: 'Post. Delt', showLabel: true },
      { subAreaId: 'shoulders-deltoid', x: 270, y: 200, label: 'Post. Delt', showLabel: false },
      { subAreaId: 'shoulders-rotator-cuff', x: 158, y: 225, label: 'Rot. Cuff', showLabel: true },
      { subAreaId: 'shoulders-rotator-cuff', x: 242, y: 225, label: 'Rot. Cuff', showLabel: false },
      { subAreaId: 'shoulders-scapular-stabilizers', x: 200, y: 215, label: 'Scapular', showLabel: true },
    ],
    back: [
      { subAreaId: 'back-interscapular', x: 200, y: 230, label: 'Interscapular', showLabel: true },
      { subAreaId: 'back-mid-thoracic', x: 165, y: 295, label: 'Mid-Thoracic', showLabel: true },
      { subAreaId: 'back-mid-thoracic', x: 235, y: 295, label: 'Mid-Thoracic', showLabel: false },
      { subAreaId: 'back-lumbar', x: 200, y: 365, label: 'Lumbar', showLabel: true },
    ],
    'hands-wrists': [
      { subAreaId: 'wrist-extensor', x: 96, y: 410, label: 'Extensors', showLabel: true },
      { subAreaId: 'wrist-extensor', x: 304, y: 410, label: 'Extensors', showLabel: false },
      { subAreaId: 'wrist-flexor', x: 96, y: 392, label: 'Flexors', showLabel: true },
      { subAreaId: 'wrist-flexor', x: 304, y: 392, label: 'Flexors', showLabel: false },
      { subAreaId: 'elbow-lateral', x: 84, y: 348, label: 'Lat. Elbow', showLabel: true },
      { subAreaId: 'elbow-lateral', x: 316, y: 348, label: 'Lat. Elbow', showLabel: false },
      { subAreaId: 'elbow-medial', x: 108, y: 360, label: 'Med. Elbow', showLabel: true },
      { subAreaId: 'elbow-medial', x: 292, y: 360, label: 'Med. Elbow', showLabel: false },
    ],
  },
};

export const HIT_PATHS: Record<BodyView, Partial<Record<ZoneId, string>>> = {
  anterior: {
    neck: 'M178,118 L222,118 L226,150 L222,162 L178,162 L174,150 Z',
    shoulders:
      'M118,168 L178,162 L178,210 L150,232 L120,232 L100,200 Z M222,162 L282,168 L300,200 L280,232 L250,232 L222,210 Z',
    'hands-wrists':
      'M70,400 L110,400 L112,440 L72,440 Z M290,400 L330,400 L328,440 L288,440 Z',
  },
  posterior: {
    neck: 'M178,118 L222,118 L226,150 L222,162 L178,162 L174,150 Z',
    shoulders:
      'M118,168 L178,162 L178,210 L150,232 L120,232 L100,200 Z M222,162 L282,168 L300,200 L280,232 L250,232 L222,210 Z',
    back: 'M150,170 L250,170 L262,260 L266,340 L250,395 L150,395 L134,340 L138,260 Z',
    'hands-wrists':
      'M70,400 L110,400 L112,440 L72,440 Z M290,400 L330,400 L328,440 L288,440 Z',
  },
};
