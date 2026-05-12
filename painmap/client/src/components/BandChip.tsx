import type { BandInfo } from '../types';

interface Props {
  band: BandInfo;
}

export function BandChip({ band }: Props) {
  return (
    <div className="band-chip">
      <span className="band-swatch" style={{ background: band.hex }} aria-hidden="true" />
      <div className="band-info">
        <div className="band-label">
          TheraBand <span className="band-color">{band.color}</span>
        </div>
        <div className="band-force">{band.force}</div>
        {band.note && <div className="band-note">{band.note}</div>}
      </div>
    </div>
  );
}
