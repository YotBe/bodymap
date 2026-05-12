import type { BandColor, BandInfo } from '../types.js';

const SPECS: Record<BandColor, { hex: string; force: string }> = {
  yellow: { hex: '#FBE26B', force: '~3 lb @ 100%' },
  red: { hex: '#E27272', force: '~4 lb @ 100%' },
  green: { hex: '#7BBF8E', force: '~5 lb @ 100%' },
  blue: { hex: '#7BA4D9', force: '~6 lb @ 100%' },
  black: { hex: '#3D3D3D', force: '~9 lb @ 100%' },
};

export function bandInfo(color: BandColor, note: string | null): BandInfo {
  const spec = SPECS[color];
  return { color, hex: spec.hex, force: spec.force, note };
}
