import { useState } from 'react';
import type { Evidence } from '../types';

interface Props {
  evidence: Evidence;
}

export function EvidencePill({ evidence }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="evidence-wrap">
      <button
        type="button"
        className={`evidence-pill ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="ev-dot" aria-hidden="true" />
        <span className="ev-text">{evidence.short}</span>
        <span className="ev-arrow" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="evidence-expanded">
          <div className="ev-summary">{evidence.summary}</div>
          <div className="ev-full">{evidence.full}</div>
        </div>
      )}
    </div>
  );
}
