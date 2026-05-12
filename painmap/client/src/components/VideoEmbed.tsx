import { useState } from 'react';

interface Props {
  videoId: string;
  videoUrl: string;
  exerciseName: string;
}

export function VideoEmbed({ videoId, videoUrl, exerciseName }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="video-embed">
      {loaded && videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={`${exerciseName} video demonstration`}
          allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="video-placeholder"
          onClick={() => setLoaded(true)}
          aria-label="Load video demonstration"
          disabled={!videoId}
        >
          <span className="vp-illustration" aria-hidden="true">
            <svg
              viewBox="0 0 120 80"
              width="120"
              height="80"
              fill="none"
              stroke="var(--ink-muted)"
              strokeWidth="1.2"
            >
              <circle cx="60" cy="40" r="22" />
              <path d="M54,30 L74,40 L54,50 Z" fill="var(--ink-muted)" stroke="none" />
            </svg>
          </span>
          <span className="vp-label">
            {videoId ? 'Load video demonstration' : 'Video unavailable'}
          </span>
          <span className="vp-sub">YouTube · loads on click</span>
        </button>
      )}
      <a className="video-external" href={videoUrl} target="_blank" rel="noopener noreferrer">
        Open in YouTube ↗
      </a>
    </div>
  );
}
