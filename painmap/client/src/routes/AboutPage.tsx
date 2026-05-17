import { PaneEyebrow } from '../components/PaneEyebrow';

export function AboutPage() {
  return (
    <article className="long-form">
      <PaneEyebrow num="·" label="ABOUT" />
      <h1 className="page-title">
        <span className="pt-serif">Why</span>
        <span className="pt-serif pt-italic"> PainMap exists.</span>
      </h1>

      <section className="lf-section">
        <h2 className="lf-h2">The problem</h2>
        <p className="lf-p">
          Musculoskeletal pain — low back, neck, shoulder, wrist — is the leading cause of
          years lived with disability globally (Global Burden of Disease, <em>Lancet</em> 2020).
          The desk-bound population carries an outsize share of it: prolonged sitting and
          high-frequency computer work are independently associated with chronic neck and
          shoulder pain in workplace cohort studies.
        </p>
        <p className="lf-p">
          For most of these people the pain is mechanical, not medical. A short course of
          targeted exercise resolves it. But the path from "my neck hurts" to "the right
          exercise" is broken.
        </p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">The gap</h2>
        <p className="lf-p">
          Physical therapy works, but a referral, an appointment, and a co-pay are three
          steps most people won't take for a sore neck. So they turn to search engines and
          social platforms — where exercise recommendations are dominated by influencers
          and wellness content with no clinical grounding. Multiple reviews of YouTube
          back-pain advice have found the majority of content unsupported by, or
          inconsistent with, current clinical guidelines.
        </p>
        <p className="lf-p">
          The result: a person in mild pain spends an hour scrolling, picks the most
          confident-sounding video, does an exercise that may or may not be appropriate,
          and learns nothing about why.
        </p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">The PainMap approach</h2>
        <p className="lf-p">
          PainMap collapses that funnel to a single decision: click where it hurts. The
          app surfaces one resistance-band exercise per pain location — the one with the
          strongest evidence base in the peer-reviewed literature.
        </p>
        <p className="lf-p">
          Every recommendation ships with the citation that produced it, the mechanism of
          action, sets / reps / tempo, contraindications, and a video demonstration. No
          upsell, no engagement loop, no influencer affiliation. The exercise card is the
          product.
        </p>
        <p className="lf-p">
          PainMap doesn't replace clinical care. It triages the 80% of cases that don't
          need it, and tells the other 20% clearly when to seek it.
        </p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">Team &amp; advisors</h2>
        <p className="lf-p">
          PainMap is in active development. Clinical advisory roles (physical therapy,
          sports medicine, ergonomics) are open. If you're a clinician interested in
          contributing to evidence curation, please get in touch.
        </p>
      </section>
    </article>
  );
}
