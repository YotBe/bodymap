export type BodyView = 'anterior' | 'posterior';
export type ZoneId =
  | 'neck'
  | 'shoulders'
  | 'back'
  | 'hands-wrists'
  | 'hip-glutes'
  | 'knees'
  | 'foot-ankle';

export const ZONE_LABELS: Record<ZoneId, string> = {
  neck: 'Neck',
  shoulders: 'Shoulders',
  back: 'Back',
  'hands-wrists': 'Hands & Wrists',
  'hip-glutes': 'Hip & Glutes',
  knees: 'Knees',
  'foot-ankle': 'Foot & Ankle',
};

export const ZONE_VIEWBOX: Record<ZoneId, string> = {
  neck: '120 80 160 120',
  shoulders: '70 140 260 130',
  back: '100 160 200 260',
  'hands-wrists': '50 370 300 100',
  'hip-glutes': '120 370 160 120',
  knees: '130 440 140 140',
  'foot-ankle': '130 520 140 80',
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
  'hip-glutes': '110 300 180 270',
  knees: '120 380 160 240',
  'foot-ankle': '120 440 160 240',
};

export const FULL_VIEWBOX = '0 0 400 600';

export const ZONES_BY_VIEW: Record<BodyView, ZoneId[]> = {
  anterior: ['neck', 'shoulders', 'hands-wrists', 'hip-glutes', 'knees', 'foot-ankle'],
  posterior: ['neck', 'shoulders', 'back', 'hands-wrists', 'hip-glutes', 'knees', 'foot-ankle'],
};

export type HotspotLabelKey =
  | 'upperTrap'
  | 'levator'
  | 'cervical'
  | 'deltoid'
  | 'postDelt'
  | 'rotCuff'
  | 'bicepsTend'
  | 'scapular'
  | 'interscapular'
  | 'midThoracic'
  | 'lumbar'
  | 'flexors'
  | 'extensors'
  | 'latElbow'
  | 'medElbow'
  | 'deQuervains'
  | 'gluteMed'
  | 'gluteMax'
  | 'patella'
  | 'hamstring'
  | 'plantar'
  | 'latAnkle'
  | 'achilles';

export interface SubAreaHotspot {
  subAreaId: string;
  x: number;
  y: number;
  label: string;
  labelKey: HotspotLabelKey;
  showLabel: boolean;
}

export const SUB_AREA_HOTSPOTS: Record<BodyView, Partial<Record<ZoneId, SubAreaHotspot[]>>> = {
  anterior: {
    neck: [
      { subAreaId: 'neck-upper-trapezius', x: 152, y: 168, label: 'Upper Trap', labelKey: 'upperTrap', showLabel: true },
      { subAreaId: 'neck-upper-trapezius', x: 248, y: 168, label: 'Upper Trap', labelKey: 'upperTrap', showLabel: false },
      { subAreaId: 'neck-levator-scapulae', x: 188, y: 145, label: 'Levator', labelKey: 'levator', showLabel: true },
      { subAreaId: 'neck-cervical-paraspinals', x: 212, y: 145, label: 'Cervical', labelKey: 'cervical', showLabel: true },
    ],
    shoulders: [
      { subAreaId: 'shoulders-deltoid', x: 132, y: 196, label: 'Deltoid', labelKey: 'deltoid', showLabel: true },
      { subAreaId: 'shoulders-deltoid', x: 268, y: 196, label: 'Deltoid', labelKey: 'deltoid', showLabel: false },
      { subAreaId: 'shoulders-rotator-cuff', x: 150, y: 224, label: 'Rot. Cuff', labelKey: 'rotCuff', showLabel: true },
      { subAreaId: 'shoulders-rotator-cuff', x: 250, y: 224, label: 'Rot. Cuff', labelKey: 'rotCuff', showLabel: false },
      { subAreaId: 'shoulders-biceps-tendon', x: 138, y: 252, label: 'Biceps Tend.', labelKey: 'bicepsTend', showLabel: true },
      { subAreaId: 'shoulders-biceps-tendon', x: 262, y: 252, label: 'Biceps Tend.', labelKey: 'bicepsTend', showLabel: false },
    ],
    'hands-wrists': [
      { subAreaId: 'wrist-flexor', x: 96, y: 426, label: 'Flexors', labelKey: 'flexors', showLabel: true },
      { subAreaId: 'wrist-flexor', x: 304, y: 426, label: 'Flexors', labelKey: 'flexors', showLabel: false },
      { subAreaId: 'wrist-extensor', x: 94, y: 400, label: 'Extensors', labelKey: 'extensors', showLabel: true },
      { subAreaId: 'wrist-extensor', x: 306, y: 400, label: 'Extensors', labelKey: 'extensors', showLabel: false },
      { subAreaId: 'elbow-lateral', x: 84, y: 346, label: 'Lat. Elbow', labelKey: 'latElbow', showLabel: true },
      { subAreaId: 'elbow-lateral', x: 316, y: 346, label: 'Lat. Elbow', labelKey: 'latElbow', showLabel: false },
      { subAreaId: 'elbow-medial', x: 110, y: 373, label: 'Med. Elbow', labelKey: 'medElbow', showLabel: true },
      { subAreaId: 'elbow-medial', x: 290, y: 373, label: 'Med. Elbow', labelKey: 'medElbow', showLabel: false },
      { subAreaId: 'wrist-de-quervains', x: 82, y: 452, label: "De Quervain's", labelKey: 'deQuervains', showLabel: true },
      { subAreaId: 'wrist-de-quervains', x: 318, y: 452, label: "De Quervain's", labelKey: 'deQuervains', showLabel: false },
    ],
    'hip-glutes': [
      { subAreaId: 'hip-glutes-medius', x: 148, y: 410, label: 'Glute Med', labelKey: 'gluteMed', showLabel: true },
      { subAreaId: 'hip-glutes-medius', x: 252, y: 410, label: 'Glute Med', labelKey: 'gluteMed', showLabel: false },
      { subAreaId: 'hip-glutes-maximus', x: 178, y: 435, label: 'Glute Max', labelKey: 'gluteMax', showLabel: true },
      { subAreaId: 'hip-glutes-maximus', x: 222, y: 435, label: 'Glute Max', labelKey: 'gluteMax', showLabel: false },
    ],
    knees: [
      { subAreaId: 'knees-patellofemoral', x: 174, y: 480, label: 'Patella', labelKey: 'patella', showLabel: true },
      { subAreaId: 'knees-patellofemoral', x: 226, y: 480, label: 'Patella', labelKey: 'patella', showLabel: false },
    ],
    'foot-ankle': [
      { subAreaId: 'foot-ankle-plantar', x: 188, y: 565, label: 'Plantar', labelKey: 'plantar', showLabel: true },
      { subAreaId: 'foot-ankle-plantar', x: 212, y: 565, label: 'Plantar', labelKey: 'plantar', showLabel: false },
      { subAreaId: 'foot-ankle-lateral', x: 168, y: 545, label: 'Lat. Ankle', labelKey: 'latAnkle', showLabel: true },
      { subAreaId: 'foot-ankle-lateral', x: 232, y: 545, label: 'Lat. Ankle', labelKey: 'latAnkle', showLabel: false },
    ],
  },
  posterior: {
    neck: [
      { subAreaId: 'neck-cervical-paraspinals', x: 200, y: 135, label: 'Cervical', labelKey: 'cervical', showLabel: true },
      { subAreaId: 'neck-upper-trapezius', x: 178, y: 160, label: 'Upper Trap', labelKey: 'upperTrap', showLabel: true },
      { subAreaId: 'neck-upper-trapezius', x: 222, y: 160, label: 'Upper Trap', labelKey: 'upperTrap', showLabel: false },
      { subAreaId: 'neck-levator-scapulae', x: 188, y: 175, label: 'Levator', labelKey: 'levator', showLabel: true },
    ],
    shoulders: [
      { subAreaId: 'shoulders-deltoid', x: 130, y: 200, label: 'Post. Delt', labelKey: 'postDelt', showLabel: true },
      { subAreaId: 'shoulders-deltoid', x: 270, y: 200, label: 'Post. Delt', labelKey: 'postDelt', showLabel: false },
      { subAreaId: 'shoulders-rotator-cuff', x: 158, y: 225, label: 'Rot. Cuff', labelKey: 'rotCuff', showLabel: true },
      { subAreaId: 'shoulders-rotator-cuff', x: 242, y: 225, label: 'Rot. Cuff', labelKey: 'rotCuff', showLabel: false },
      { subAreaId: 'shoulders-scapular-stabilizers', x: 200, y: 215, label: 'Scapular', labelKey: 'scapular', showLabel: true },
    ],
    back: [
      { subAreaId: 'back-interscapular', x: 200, y: 230, label: 'Interscapular', labelKey: 'interscapular', showLabel: true },
      { subAreaId: 'back-mid-thoracic', x: 165, y: 295, label: 'Mid-Thoracic', labelKey: 'midThoracic', showLabel: true },
      { subAreaId: 'back-mid-thoracic', x: 235, y: 295, label: 'Mid-Thoracic', labelKey: 'midThoracic', showLabel: false },
      { subAreaId: 'back-lumbar', x: 200, y: 365, label: 'Lumbar', labelKey: 'lumbar', showLabel: true },
    ],
    'hands-wrists': [
      { subAreaId: 'wrist-extensor', x: 96, y: 410, label: 'Extensors', labelKey: 'extensors', showLabel: true },
      { subAreaId: 'wrist-extensor', x: 304, y: 410, label: 'Extensors', labelKey: 'extensors', showLabel: false },
      { subAreaId: 'wrist-flexor', x: 96, y: 392, label: 'Flexors', labelKey: 'flexors', showLabel: true },
      { subAreaId: 'wrist-flexor', x: 304, y: 392, label: 'Flexors', labelKey: 'flexors', showLabel: false },
      { subAreaId: 'elbow-lateral', x: 84, y: 348, label: 'Lat. Elbow', labelKey: 'latElbow', showLabel: true },
      { subAreaId: 'elbow-lateral', x: 316, y: 348, label: 'Lat. Elbow', labelKey: 'latElbow', showLabel: false },
      { subAreaId: 'elbow-medial', x: 108, y: 360, label: 'Med. Elbow', labelKey: 'medElbow', showLabel: true },
      { subAreaId: 'elbow-medial', x: 292, y: 360, label: 'Med. Elbow', labelKey: 'medElbow', showLabel: false },
      { subAreaId: 'wrist-de-quervains', x: 80, y: 438, label: "De Quervain's", labelKey: 'deQuervains', showLabel: true },
      { subAreaId: 'wrist-de-quervains', x: 320, y: 438, label: "De Quervain's", labelKey: 'deQuervains', showLabel: false },
    ],
    'hip-glutes': [
      { subAreaId: 'hip-glutes-maximus', x: 178, y: 425, label: 'Glute Max', labelKey: 'gluteMax', showLabel: true },
      { subAreaId: 'hip-glutes-maximus', x: 222, y: 425, label: 'Glute Max', labelKey: 'gluteMax', showLabel: false },
      { subAreaId: 'hip-glutes-medius', x: 148, y: 408, label: 'Glute Med', labelKey: 'gluteMed', showLabel: true },
      { subAreaId: 'hip-glutes-medius', x: 252, y: 408, label: 'Glute Med', labelKey: 'gluteMed', showLabel: false },
    ],
    knees: [
      { subAreaId: 'knees-hamstring', x: 174, y: 475, label: 'Hamstring', labelKey: 'hamstring', showLabel: true },
      { subAreaId: 'knees-hamstring', x: 226, y: 475, label: 'Hamstring', labelKey: 'hamstring', showLabel: false },
    ],
    'foot-ankle': [
      { subAreaId: 'foot-ankle-achilles', x: 188, y: 548, label: 'Achilles', labelKey: 'achilles', showLabel: true },
      { subAreaId: 'foot-ankle-achilles', x: 212, y: 548, label: 'Achilles', labelKey: 'achilles', showLabel: false },
      { subAreaId: 'foot-ankle-lateral', x: 168, y: 545, label: 'Lat. Ankle', labelKey: 'latAnkle', showLabel: true },
      { subAreaId: 'foot-ankle-lateral', x: 232, y: 545, label: 'Lat. Ankle', labelKey: 'latAnkle', showLabel: false },
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
    'hip-glutes':
      'M150,395 L250,395 L256,450 L242,455 L158,455 L144,450 Z',
    knees:
      'M158,460 L242,460 L240,510 L162,510 Z',
    'foot-ankle':
      'M162,520 L238,520 L234,585 L168,585 Z',
  },
  posterior: {
    neck: 'M178,118 L222,118 L226,150 L222,162 L178,162 L174,150 Z',
    shoulders:
      'M118,168 L178,162 L178,210 L150,232 L120,232 L100,200 Z M222,162 L282,168 L300,200 L280,232 L250,232 L222,210 Z',
    back: 'M150,170 L250,170 L262,260 L266,340 L250,395 L150,395 L134,340 L138,260 Z',
    'hands-wrists':
      'M70,400 L110,400 L112,440 L72,440 Z M290,400 L330,400 L328,440 L288,440 Z',
    'hip-glutes':
      'M150,395 L250,395 L256,450 L242,455 L158,455 L144,450 Z',
    knees:
      'M158,460 L242,460 L240,510 L162,510 Z',
    'foot-ankle':
      'M162,520 L238,520 L234,585 L168,585 Z',
  },
};
