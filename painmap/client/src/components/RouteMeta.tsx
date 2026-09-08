import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useExercise } from '../api/exercises';
import type { Exercise } from '../types';

export const CANONICAL_ORIGIN = 'https://bodymap1.vercel.app';

function upsertMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

interface RouteMetaValues {
  title: string;
  description: string;
  /** Unknown routes render a 200 (SPA rewrite), so mark them noindex to avoid soft-404s. */
  noindex?: boolean;
}

function metaForRoute(
  pathname: string,
  t: TFunction,
  exercise: Exercise | undefined,
): RouteMetaValues {
  const fallback = {
    title: t('meta.defaultTitle'),
    description: t('meta.defaultDescription'),
  };

  if (pathname === '/' || pathname === '/flow/map') return fallback;

  if (pathname === '/flow/assessment') {
    return { title: t('meta.assessmentTitle'), description: t('meta.assessmentDescription') };
  }
  if (pathname === '/routine') {
    return { title: t('meta.routineTitle'), description: t('meta.routineDescription') };
  }
  if (pathname === '/about') {
    return { title: t('meta.aboutTitle'), description: t('meta.aboutDescription') };
  }
  if (pathname === '/legal') {
    return { title: t('meta.legalTitle'), description: t('meta.legalDescription') };
  }
  if (pathname === '/clinician-finder') {
    return { title: t('meta.clinicianTitle'), description: t('meta.clinicianDescription') };
  }
  if (pathname.startsWith('/zone/')) {
    const zoneId = pathname.slice('/zone/'.length);
    const zone = t(`zones.${zoneId}`, { defaultValue: '' });
    if (!zone) {
      return { title: t('meta.notFoundTitle'), description: fallback.description, noindex: true };
    }
    return {
      title: t('meta.zoneTitle', { zone }),
      description: t('meta.zoneDescription', { zone }),
    };
  }
  if (pathname.startsWith('/exercise/')) {
    // Exercise data resolves asynchronously (first render only); until then the
    // default meta stays in place and the effect re-runs once data lands.
    if (!exercise) return fallback;
    const vars = { name: exercise.name, area: exercise.subArea.name };
    return {
      title: t('meta.exerciseTitle', vars),
      description: t('meta.exerciseDescription', vars),
    };
  }
  return { title: t('meta.notFoundTitle'), description: fallback.description, noindex: true };
}

/**
 * Keeps document.title, the meta description, and the canonical URL in sync
 * with the current route. A client-rendered SPA otherwise shows the same
 * static title on every page — bad for tabs, history, bookmarks, shares, and
 * crawlers that execute JavaScript.
 */
export function RouteMeta() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const exerciseId = pathname.startsWith('/exercise/')
    ? pathname.slice('/exercise/'.length)
    : undefined;
  const { data: exercise } = useExercise(exerciseId);

  const { title, description, noindex } = metaForRoute(pathname, t, exercise);

  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);
    if (noindex) {
      upsertMeta('robots', 'noindex');
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove();
    }
    // Canonical always points at the primary domain so mirror deployments
    // consolidate rather than compete in search results.
    upsertLink('canonical', `${CANONICAL_ORIGIN}${pathname === '/' ? '/flow/map' : pathname}`);
  }, [title, description, noindex, pathname]);

  return null;
}
