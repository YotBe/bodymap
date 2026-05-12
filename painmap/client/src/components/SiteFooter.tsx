export function SiteFooter() {
  return (
    <footer className="site-footer" id="about">
      <div className="sf-col">
        <div className="sf-label">PainMap</div>
        <div className="sf-text">
          An educational triage tool. Not a substitute for clinical care.
        </div>
      </div>
      <div className="sf-col">
        <div className="sf-label">Safety</div>
        <a className="sf-link" href="#clinician">
          Find a clinician near you →
        </a>
      </div>
      <div className="sf-col" id="evidence">
        <div className="sf-label">Evidence</div>
        <div className="sf-text">
          Every exercise cites a peer-reviewed source.{' '}
          <a href="#bibliography" className="sf-inline">
            Full bibliography →
          </a>
        </div>
      </div>
    </footer>
  );
}
