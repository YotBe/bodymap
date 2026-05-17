import { useTranslation } from 'react-i18next';
import { PaneEyebrow } from '../components/PaneEyebrow';

export function LegalPage() {
  const { t } = useTranslation();
  const redFlags = t('legal.disclaimerRedFlags', { returnObjects: true }) as string[];

  return (
    <article className="long-form">
      <PaneEyebrow num="·" label={t('pane.legalLabel')} />
      <h1 className="page-title">
        <span className="pt-serif">{t('legal.titlePrefix')}</span>
        <span className="pt-serif pt-italic">{t('legal.titleSuffix')}</span>
      </h1>

      <nav className="lf-toc" aria-label={t('legal.tocAria')}>
        <a href="#disclaimer">{t('legal.tocDisclaimer')}</a>
        <span aria-hidden="true">·</span>
        <a href="#privacy">{t('legal.tocPrivacy')}</a>
        <span aria-hidden="true">·</span>
        <a href="#terms">{t('legal.tocTerms')}</a>
      </nav>

      <section className="lf-section" id="disclaimer">
        <h2 className="lf-h2">{t('legal.disclaimerH2')}</h2>
        <p className="lf-p">
          {t('legal.disclaimerP1Pre')}
          <strong>{t('legal.disclaimerP1Strong')}</strong>
          {t('legal.disclaimerP1Post')}
        </p>
        <p className="lf-p">{t('legal.disclaimerP2')}</p>
        <ul className="lf-list">
          {redFlags.map((flag, i) => (
            <li key={i}>{flag}</li>
          ))}
        </ul>
        <p className="lf-p">{t('legal.disclaimerP3')}</p>
      </section>

      <section className="lf-section" id="privacy">
        <h2 className="lf-h2">{t('legal.privacyH2')}</h2>
        <p className="lf-p">{t('legal.privacyP1')}</p>
        <p className="lf-p">
          {t('legal.privacyP2Pre')}
          <code>{t('legal.privacyP2Code')}</code>
          {t('legal.privacyP2Post')}
        </p>
        <p className="lf-p">{t('legal.privacyP3')}</p>
      </section>

      <section className="lf-section" id="terms">
        <h2 className="lf-h2">{t('legal.termsH2')}</h2>
        <p className="lf-p">{t('legal.termsP1')}</p>
        <p className="lf-p">{t('legal.termsP2')}</p>
        <p className="lf-p">{t('legal.termsP3')}</p>
      </section>
    </article>
  );
}
