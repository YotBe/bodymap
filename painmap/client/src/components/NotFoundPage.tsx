import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <h1 className="not-found-headline">Page not found.</h1>
        <p className="not-found-sub">
          The URL you followed doesn't match anything on PainMap. The body map is the best place to start.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
