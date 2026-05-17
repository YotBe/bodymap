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

      <section className="lf-section">
        <h2 className="lf-h2">{t('about.problemH2')}</h2>
        <p className="lf-p">
          {t('about.problemP1Pre')}
          <em>{t('about.problemP1Cite')}</em>
          {t('about.problemP1Post')}
        </p>
        <p className="lf-p">{t('about.problemP2')}</p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">{t('about.gapH2')}</h2>
        <p className="lf-p">{t('about.gapP1')}</p>
        <p className="lf-p">{t('about.gapP2')}</p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">{t('about.approachH2')}</h2>
        <p className="lf-p">{t('about.approachP1')}</p>
        <p className="lf-p">{t('about.approachP2')}</p>
        <p className="lf-p">{t('about.approachP3')}</p>
      </section>

      <section className="lf-section">
        <h2 className="lf-h2">{t('about.teamH2')}</h2>
        <p className="lf-p">{t('about.teamP1')}</p>
      </section>
    </article>
  );
}
