import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  videoId: string;
  videoUrl: string;
  exerciseName: string;
}

export function VideoEmbed({ videoId, videoUrl, exerciseName }: Props) {
  const { t } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);

  if (!videoId) {
    return (
      <div className="video-embed">
        <div className="video-thumb video-thumb-unavailable" role="img" aria-label={t('video.unavailable')}>
          <span className="vt-label-fallback">{t('video.unavailable')}</span>
        </div>
      </div>
    );
  }

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="video-embed">
      <a
        className="video-thumb"
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('video.watchAria', { name: exerciseName })}
      >
        {!imgFailed && (
          <img
            className="vt-img"
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        <span className="vt-play" aria-hidden="true">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path
              d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.41 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.48 5.41 5.41 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
              fill="#212121"
              fillOpacity="0.85"
            />
            <path d="M45 24 L27 14 L27 34 Z" fill="#fff" />
          </svg>
        </span>
        <span className="vt-label">{t('video.watchOn')}</span>
      </a>
    </div>
  );
}
