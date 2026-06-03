import { useTranslation } from 'react-i18next';
import { PaneEyebrow } from '../components/PaneEyebrow';

interface Clinic {
  name: string;
  focus: { en: string; he: string };
  area: string;
  phone?: string;
  url: string;
}

/**
 * Curated list of publicly-listed physiotherapy / sports-therapy clinics in
 * Tel Aviv. Tel Aviv only for now; location-based filtering is a future step.
 * These are not endorsements — see the disclaimer in the page.
 */
const TEL_AVIV_PHYSIOS: Clinic[] = [
  {
    name: 'PHYSYOUTLV',
    focus: { en: 'Sports & orthopedic rehabilitation', he: 'שיקום ספורט ואורתופדי' },
    area: "Hamiktso'a St 5, Tel Aviv",
    phone: '074-703-4545',
    url: 'https://physyoutlv.com',
  },
  {
    name: 'Recovery TLV',
    focus: { en: 'Private 1-on-1 sports physiotherapy', he: 'פיזיותרפיית ספורט פרטית 1:1' },
    area: 'North Tel Aviv',
    url: 'https://recoverytlv.co.il',
  },
  {
    name: 'David Borowski Physiotherapy',
    focus: { en: 'Private musculoskeletal physiotherapy', he: 'פיזיותרפיה שריר-שלד פרטית' },
    area: 'Nachmani St 28, Tel Aviv-Yafo',
    url: 'https://www.tlvphysio.co.il',
  },
  {
    name: 'Target',
    focus: { en: 'Physiotherapy & active rehab', he: 'פיזיותרפיה ושיקום פעיל' },
    area: 'Kehilat Saloniki 11, Naot Afeka',
    phone: '073-730-8854',
    url: 'https://www.target-ta.co.il',
  },
  {
    name: 'Ergoplus (MEDIMAX)',
    focus: { en: 'Orthopedic & manual therapy', he: 'אורתופדיה וטיפול ידני' },
    area: 'Central Tel Aviv & Givatayim',
    phone: '03-696-9787',
    url: 'https://www.ergoplus.co.il',
  },
  {
    name: 'Effie Rehab Connect',
    focus: { en: 'Physiotherapy & rehabilitation', he: 'פיזיותרפיה ושיקום' },
    area: 'Tel Aviv',
    url: 'https://www.pt-tlv.com',
  },
];

export function ClinicianPage() {
  const { t, i18n } = useTranslation();
  const isHebrew = (i18n.language || 'en').startsWith('he');

  return (
    <article className="long-form">
      <PaneEyebrow num="·" label={t('physio.eyebrow')} />
      <h1 className="page-title">
        <span className="pt-serif">{t('physio.titlePrefix')}</span>
        <span className="pt-serif pt-italic">{t('physio.titleSuffix')}</span>
      </h1>
      <p className="page-sub">{t('physio.sub')}</p>

      <div className="lf-body">
        <ul className="physio-list">
          {TEL_AVIV_PHYSIOS.map((c) => (
            <li key={c.name} className="physio-card">
              <div className="physio-main">
                <a className="physio-name" href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.name} ↗
                </a>
                <p className="physio-focus">{isHebrew ? c.focus.he : c.focus.en}</p>
                <p className="physio-area" dir="ltr">{c.area}</p>
              </div>
              {c.phone && (
                <a className="physio-phone" href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} dir="ltr">
                  {c.phone}
                </a>
              )}
            </li>
          ))}
        </ul>

        <p className="physio-note">{t('physio.redFlagNote')}</p>
        <p className="physio-disclaimer">{t('physio.disclaimer')}</p>
      </div>
    </article>
  );
}
