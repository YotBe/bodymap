import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DesktopOnlyGate } from './components/DesktopOnlyGate';
import { PageShell } from './components/PageShell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <DesktopOnlyGate>
          <PageShell />
        </DesktopOnlyGate>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
