import { useTranslation } from 'react-i18next';
import { PaneEyebrow } from '../components/PaneEyebrow';

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <article className="long-form">
      <PaneEyebrow num="·" label={t('pane.aboutLabel')} />
      <h1 className="page-title">
        <span className="pt-serif">{t('about.titlePrefix')}</span>
        <span className="pt-serif pt-italic">{t('about.titleSuffix')}</span>
      </h1>

      <div className="lf-body">
        <section className="lf-section">
          <h2 className="lf-h2">{t('about.problemH2')}</h2>
          <p className="lf-p">{t('about.problemP1')}</p>
        </section>

        <section className="lf-section">
          <h2 className="lf-h2">{t('about.approachH2')}</h2>
          <p className="lf-p">{t('about.approachP1')}</p>
        </section>
      </div>
    </article>
  );
}
