import { useTranslation } from 'react-i18next';
import { PaneEyebrow } from '../components/PaneEyebrow';

export function ClinicianPage() {
  const { t } = useTranslation();
  return (
    <article className="long-form">
      <PaneEyebrow num="·" label={t('pane.clinicianLabel')} />
      <h1 className="page-title">
        <span className="pt-serif">{t('clinician.titlePrefix')}</span>
        <span className="pt-serif pt-italic">{t('clinician.titleSuffix')}</span>
      </h1>

      <div className="lf-body">
        <section className="lf-section">
          <p className="lf-p">{t('clinician.introP')}</p>
        </section>

        <section className="lf-section">
          <h2 className="lf-h2">{t('clinician.israelH2')}</h2>
          <p className="lf-p">{t('clinician.israelP1')}</p>
          <ul className="lf-list lf-list-links">
            <li>
              <a href="https://www.clalit.co.il/" target="_blank" rel="noopener noreferrer">
                {t('clinician.kupotClalit')}
              </a>
            </li>
            <li>
              <a href="https://www.maccabi4u.co.il/" target="_blank" rel="noopener noreferrer">
                {t('clinician.kupotMaccabi')}
              </a>
            </li>
            <li>
              <a href="https://www.meuhedet.co.il/" target="_blank" rel="noopener noreferrer">
                {t('clinician.kupotMeuhedet')}
              </a>
            </li>
            <li>
              <a href="https://www.leumit.co.il/" target="_blank" rel="noopener noreferrer">
                {t('clinician.kupotLeumit')}
              </a>
            </li>
          </ul>
        </section>

        <section className="lf-section">
          <p className="lf-p">
            {t('clinician.elsewhereP1Pre')}
            <a
              className="lf-inline"
              href="https://aptaapps.apta.org/APTAPTDirectory/FindAPTDirectory.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('clinician.elsewhereP1Link')}
            </a>
            {t('clinician.elsewhereP1Post')}
          </p>
        </section>
      </div>
    </article>
  );
}
