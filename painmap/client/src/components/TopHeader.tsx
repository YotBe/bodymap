import { Link } from 'react-router-dom';

export function TopHeader() {
  return (
    <header className="top-header">
      <Link to="/" className="brand" aria-label="PainMap home">
        <span className="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9.5" stroke="var(--ink)" strokeWidth="1" />
            <circle cx="11" cy="11" r="3" fill="var(--accent)" />
            <line x1="11" y1="1" x2="11" y2="21" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
            <line x1="1" y1="11" x2="21" y2="11" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </span>
        <span className="brand-name">PainMap</span>
        <span className="brand-version">V2 · FULL BODY</span>
      </Link>
      <nav className="top-nav" aria-label="Primary">
        <a className="nav-link" href="#evidence">Evidence</a>
        <a className="nav-link" href="#about">About</a>
        <a className="nav-link nav-emph" href="#clinician">Find a clinician ↗</a>
      </nav>
    </header>
  );
}
