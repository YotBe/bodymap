import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageShell } from './components/PageShell';
import { isRtlLanguage } from './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function HtmlLangSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = i18n.language || 'en';
    const base = lang.split('-')[0];
    document.documentElement.lang = base;
    document.documentElement.dir = isRtlLanguage(base) ? 'rtl' : 'ltr';
  }, [i18n.language]);
  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <HtmlLangSync />
        <PageShell />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
