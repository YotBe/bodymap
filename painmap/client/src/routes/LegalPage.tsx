import { PaneEyebrow } from '../components/PaneEyebrow';

export function LegalPage() {
  return (
    <article className="long-form">
      <PaneEyebrow num="·" label="LEGAL" />
      <h1 className="page-title">
        <span className="pt-serif">The</span>
        <span className="pt-serif pt-italic"> fine print.</span>
      </h1>

      <nav className="lf-toc" aria-label="On this page">
        <a href="#disclaimer">Medical disclaimer</a>
        <span aria-hidden="true">·</span>
        <a href="#privacy">Privacy</a>
        <span aria-hidden="true">·</span>
        <a href="#terms">Terms of use</a>
      </nav>

      <section className="lf-section" id="disclaimer">
        <h2 className="lf-h2">Medical disclaimer</h2>
        <p className="lf-p">
          PainMap is an educational tool. It is <strong>not a medical device</strong> and
          is not intended to diagnose, treat, cure, or prevent any disease or injury. The
          exercises and information presented are general and may not be appropriate for
          your specific condition.
        </p>
        <p className="lf-p">
          Always consult a licensed healthcare provider — physician, physical therapist,
          or sports-medicine practitioner — before starting any new exercise program,
          especially if you have a known medical condition, are pregnant, are recovering
          from surgery, or experience any of the following:
        </p>
        <ul className="lf-list">
          <li>Recent trauma (a fall, collision, or impact in the past two weeks)</li>
          <li>Numbness, tingling, or weakness radiating into the limbs</li>
          <li>Fever, unexplained weight loss, or night pain</li>
          <li>Loss of bowel or bladder control with back pain</li>
          <li>Pain that worsens with rest or wakes you from sleep</li>
        </ul>
        <p className="lf-p">
          PainMap does not establish a clinician–patient relationship. Use of the app does
          not constitute receipt of medical advice. In an emergency, call your local
          emergency number.
        </p>
      </section>

      <section className="lf-section" id="privacy">
        <h2 className="lf-h2">Privacy</h2>
        <p className="lf-p">
          PainMap is a static web application. It runs entirely in your browser. The app
          itself collects no personal information, no health data, no IP-tied identifiers,
          and uses no cookies for tracking.
        </p>
        <p className="lf-p">
          The hosting provider (Vercel) logs standard HTTP request metadata for
          operational purposes (uptime, error analysis). The embedded YouTube videos load
          from Google's privacy-preserving <code>youtube-nocookie.com</code> domain only
          after you tap "Load video demonstration." Until you tap, no request is made to
          Google.
        </p>
        <p className="lf-p">
          If anonymous usage analytics are added in a future release (page-views and
          aggregate zone-selection counts, no individual identifiers, no cookies), this
          page will be updated to describe them before they are deployed.
        </p>
      </section>

      <section className="lf-section" id="terms">
        <h2 className="lf-h2">Terms of use</h2>
        <p className="lf-p">
          PainMap is provided free of charge for personal educational use. The source code
          is released under the MIT license; the curated exercise dataset and accompanying
          editorial content are © PainMap and may not be re-published without permission.
        </p>
        <p className="lf-p">
          The app is provided "as is," without warranty of any kind, express or implied.
          The authors and contributors are not liable for any injury, loss, or damages
          arising from use of the information or exercises presented.
        </p>
        <p className="lf-p">
          By using PainMap you confirm that you have read this page and the medical
          disclaimer above, and that you understand the limitations of the tool.
        </p>
      </section>
    </article>
  );
}
