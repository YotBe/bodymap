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

      <div className="lf-body">
        <section className="lf-section">
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
        </section>

        <section className="lf-section">
          <h2 className="lf-h2">{t('legal.privacyH2')}</h2>
          <p className="lf-p">{t('legal.privacyP1')}</p>
        </section>
      </div>
    </article>
  );
}
