import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-col">
        <div className="sf-label">PainMap</div>
        <div className="sf-text">
          An educational triage tool. Not a substitute for clinical care.
        </div>
      </div>
      <div className="sf-col">
        <div className="sf-label">About</div>
        <Link className="sf-link" to="/about">
          Why PainMap exists →
        </Link>
        <Link className="sf-link" to="/clinician-finder">
          Find a clinician →
        </Link>
      </div>
      <div className="sf-col">
        <div className="sf-label">Evidence</div>
        <div className="sf-text">
          Every exercise cites a peer-reviewed source.{' '}
          <Link to="/evidence" className="sf-inline">
            Full bibliography →
          </Link>
        </div>
      </div>
      <div className="sf-col">
        <div className="sf-label">Legal</div>
        <Link className="sf-link" to="/legal">
          Medical disclaimer →
        </Link>
        <Link className="sf-link" to="/legal#privacy">
          Privacy →
        </Link>
        <Link className="sf-link" to="/legal#terms">
          Terms of use →
        </Link>
      </div>
    </footer>
  );
}
