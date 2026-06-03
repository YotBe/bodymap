import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Lazy, CSP-safe inline YouTube player.
 *
 * Renders a poster thumbnail with a play button (a "facade") and only mounts
 * the actual iframe after the user clicks. This keeps initial render light (no
 * ~1MB YouTube iframe per card) and plays the demo smoothly in-app.
 *
 * CSP notes (see vercel.json):
 *  - Embeds via youtube-nocookie.com  → allowed by `frame-src`.
 *  - Poster from i.ytimg.com          → allowed by `img-src`.
 *  - Deliberately does NOT use the YouTube IFrame Player API
 *    (https://www.youtube.com/iframe_api), which `script-src` would block.
 */

// Accepts watch?v=, youtu.be/, /embed/, /shorts/ forms.
const YT_ID = /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/;

function youTubeId(url: string): string | null {
  const m = url.match(YT_ID);
  return m ? m[1] : null;
}

interface Props {
  videoUrl: string;
  /** Exercise name, used for accessible labels. */
  title: string;
  /** When true, mount the player immediately and autoplay (skip the poster). */
  autoStart?: boolean;
}

export function YouTubeFacade({ videoUrl, title, autoStart = false }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState(autoStart);
  const id = youTubeId(videoUrl);

  // Unrecognized URL (e.g. a non-YouTube host): degrade to a plain link.
  if (!id) {
    return (
      <a className="yt-open" href={videoUrl} target="_blank" rel="noopener noreferrer">
        {t('video.watchReal')}
      </a>
    );
  }

  const embedSrc =
    `https://www.youtube-nocookie.com/embed/${id}` +
    '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <div className="yt-demo" dir="ltr">
      <figure className="yt-facade">
        {active ? (
          <iframe
            className="yt-frame"
            src={embedSrc}
            title={t('video.demoTitle', { name: title })}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="yt-poster"
            style={{ backgroundImage: `url(${poster})` }}
            onClick={() => setActive(true)}
            aria-label={t('video.playDemo', { name: title })}
          >
            <span className="yt-play" aria-hidden="true">
              <svg viewBox="0 0 68 48" width="60" height="42">
                <path
                  className="yt-play-bg"
                  d="M66.5 7.5c-.8-3-3-5.2-6-6C55 0 34 0 34 0S13 0 7.5 1.5c-3 .8-5.2 3-6 6C0 13 0 24 0 24s0 11 1.5 16.5c.8 3 3 5.2 6 6C13 48 34 48 34 48s21 0 26.5-1.5c3-.8 5.2-3 6-6C68 35 68 24 68 24s0-11-1.5-16.5z"
                />
                <path d="M27 34l18-10-18-10z" fill="#fff" />
              </svg>
            </span>
          </button>
        )}
      </figure>
      <a className="yt-open" href={watchUrl} target="_blank" rel="noopener noreferrer">
        {t('video.openYouTube')}
      </a>
    </div>
  );
}
