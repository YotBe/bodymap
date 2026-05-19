import { useState } from 'react';

interface Props {
  onDismiss: () => void;
}

export function SafetyBanner({ onDismiss }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="safety-banner">
        <span className="sb-text">
          This tool suggests exercises for common desk-related pain, not a medical diagnosis.
          Certain symptoms need urgent care.
          <button type="button" className="sb-link sb-link-btn" onClick={() => setOpen(true)}>
            View red flags
          </button>
        </span>
        <button
          type="button"
          className="sb-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss safety banner"
        >
          ×
        </button>
      </div>

      {open && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Red-flag symptoms">
          <div className="modal">
            <div className="modal-eyebrow">SAFETY GUIDANCE</div>
            <h2 className="modal-title">Stop and seek urgent clinical care if you have:</h2>
            <ul className="lf-list">
              <li>Recent trauma or suspected fracture.</li>
              <li>Numbness, tingling, or weakness spreading into limbs.</li>
              <li>Fever, unexplained weight loss, or severe night pain.</li>
              <li>Symptoms that rapidly worsen or do not improve.</li>
            </ul>
            <p className="modal-intro">
              PainMap is educational and cannot diagnose medical conditions.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={() => setOpen(false)}>
                Continue with caution
              </button>
              <a className="btn-secondary" href="/clinician-finder">
                Find a clinician
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
