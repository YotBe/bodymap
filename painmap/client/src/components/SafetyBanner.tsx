interface Props {
  onDismiss: () => void;
}

export function SafetyBanner({ onDismiss }: Props) {
  return (
    <div className="safety-banner">
      <span className="sb-text">
        PainMap is an educational tool, not a medical diagnosis. If symptoms persist, see a clinician.
      </span>
      <button
        type="button"
        className="sb-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss banner"
      >
        ×
      </button>
    </div>
  );
}
