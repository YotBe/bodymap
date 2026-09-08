import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ZonePrompt } from '../src/components/ZonePrompt';

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe('ZonePrompt', () => {
  it('shows sub-area buttons for a known zone', async () => {
    wrap(<ZonePrompt zoneId="shoulders" onPickSubArea={vi.fn()} />);
    // Data resolves synchronously (static in-memory, staleTime=Infinity).
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    // Shoulders has at least one sub-area.
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    // Eyebrow shows the zone name.
    expect(screen.getByText('SHOULDERS')).toBeInTheDocument();
  });

  it('calls onPickSubArea with the correct ids when a sub-area is clicked', async () => {
    const onPick = vi.fn();
    const user = userEvent.setup();
    wrap(<ZonePrompt zoneId="shoulders" onPickSubArea={onPick} />);
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    const [firstBtn] = screen.getAllByRole('button');
    await user.click(firstBtn);
    expect(onPick).toHaveBeenCalledOnce();
    const [subAreaId, exerciseId] = onPick.mock.calls[0];
    expect(typeof subAreaId).toBe('string');
    expect(subAreaId.length).toBeGreaterThan(0);
    // exerciseId is a string or null.
    expect(exerciseId === null || typeof exerciseId === 'string').toBe(true);
  });

  it('renders the not-found state for an unknown zone id', async () => {
    wrap(
      <ZonePrompt
        zoneId={'unknown-zone' as Parameters<typeof ZonePrompt>[0]['zoneId']}
        onPickSubArea={vi.fn()}
      />,
    );
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
