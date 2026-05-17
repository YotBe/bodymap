import { PaneEyebrow } from '../components/PaneEyebrow';

export function ClinicianPage() {
  return (
    <article className="long-form">
      <PaneEyebrow num="·" label="FIND A CLINICIAN" />
      <h1 className="page-title">
        <span className="pt-serif">When to see</span>
        <span className="pt-serif pt-italic"> a real clinician.</span>
      </h1>

      <section className="lf-section">
        <h2 className="lf-h2">PainMap is not a substitute</h2>
        <p className="lf-p">
          PainMap is designed to help with common mechanical pain — the kind that responds
          to a few weeks of targeted exercise. If your symptoms don't fit that profile, or
          you have any of the red-flag symptoms listed on the{' '}
          <a className="lf-inline" href="/legal#disclaimer">
            medical disclaimer page
          </a>
          , please see a clinician first.
        </p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">In Israel</h2>
        <p className="lf-p">
          Every Israeli resident is enrolled in one of the four health funds. Physical
          therapy is covered with a referral from your primary-care physician.
          Appointment-booking and PT-directory portals:
        </p>
        <ul className="lf-list lf-list-links">
          <li>
            <a href="https://www.clalit.co.il/" target="_blank" rel="noopener noreferrer">
              Clalit Health Services (כללית) ↗
            </a>
          </li>
          <li>
            <a href="https://www.maccabi4u.co.il/" target="_blank" rel="noopener noreferrer">
              Maccabi Healthcare Services (מכבי) ↗
            </a>
          </li>
          <li>
            <a href="https://www.meuhedet.co.il/" target="_blank" rel="noopener noreferrer">
              Meuhedet (מאוחדת) ↗
            </a>
          </li>
          <li>
            <a href="https://www.leumit.co.il/" target="_blank" rel="noopener noreferrer">
              Leumit (לאומית) ↗
            </a>
          </li>
        </ul>
        <p className="lf-p">
          The Ministry of Health maintains the registry of licensed physiotherapists at{' '}
          <a
            className="lf-inline"
            href="https://www.health.gov.il/"
            target="_blank"
            rel="noopener noreferrer"
          >
            health.gov.il
          </a>
          .
        </p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">Elsewhere</h2>
        <p className="lf-p">
          Search for a licensed physical therapist or physiotherapist through your
          country's professional regulator. In the US, the American Physical Therapy
          Association maintains a finder at{' '}
          <a
            className="lf-inline"
            href="https://aptaapps.apta.org/APTAPTDirectory/FindAPTDirectory.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            APTA Find a PT
          </a>
          . In the UK, the Chartered Society of Physiotherapy runs Physio2u.
        </p>
      </section>
    </article>
  );
}
