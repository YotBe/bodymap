import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExerciseCard } from '../src/components/ExerciseCard';
import type { Exercise } from '../src/types';

// Minimal Exercise fixture — only the fields the component reads directly.
const EXERCISE: Exercise = {
  id: 'ex-band-external-rotation',
  name: 'Band Shoulder External Rotation',
  isPrimary: true,
  subArea: {
    id: 'shoulders-rotator-cuff',
    name: 'Rotator Cuff',
    description: null,
    zoneId: 'shoulders',
    zoneName: 'Shoulders',
  },
  targetMuscles: 'Infraspinatus, teres minor',
  mechanism: 'Improves external/internal rotation ratio.',
  instructions: ['Anchor a band at elbow height.', 'Rotate your forearm outward.'],
  sets: 3,
  reps: '12-15',
  tempo: null,
  band: { color: 'yellow', hex: '#FFE066', force: 'light', note: null },
  frequency: '3 days/week',
  commonMistakes: ['Elbow drifting away'],
  contraindications: [],
  beginnerModification: null,
  evidence: {
    short: 'Boudreau 2019',
    full: 'Boudreau et al., JOSPT 2019',
    summary: 'Adductor coactivation improved outcomes.',
  },
  videoUrl: 'https://www.youtube.com/watch?v=cFyP6e4XeGo',
};

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ExerciseCard — instructions modal', () => {
  it('opens the modal when "How to" is clicked', async () => {
    const user = userEvent.setup();
    wrap(<ExerciseCard exercise={EXERCISE} autoStartVideo={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /how to do it/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('lists the exercise instructions inside the dialog', async () => {
    const user = userEvent.setup();
    wrap(<ExerciseCard exercise={EXERCISE} autoStartVideo={false} />);
    await user.click(screen.getByRole('button', { name: /how to do it/i }));

    const dialog = screen.getByRole('dialog');
    // Each instruction step should be visible inside the dialog.
    for (const step of EXERCISE.instructions) {
      expect(within(dialog).getByText(step)).toBeInTheDocument();
    }
  });

  it('closes the modal via the Close button and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    wrap(<ExerciseCard exercise={EXERCISE} autoStartVideo={false} />);

    const trigger = screen.getByRole('button', { name: /how to do it/i });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    const closeBtn = within(dialog).getByRole('button', { name: /got it/i });
    await user.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes the modal via backdrop click', async () => {
    const user = userEvent.setup();
    wrap(<ExerciseCard exercise={EXERCISE} autoStartVideo={false} />);
    await user.click(screen.getByRole('button', { name: /how to do it/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click the overlay (the parent of the dialog box).
    const overlay = screen.getByRole('dialog').parentElement!;
    await user.click(overlay);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal via Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    wrap(<ExerciseCard exercise={EXERCISE} autoStartVideo={false} />);

    const trigger = screen.getByRole('button', { name: /how to do it/i });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });
});

describe('ExerciseCard — set counter', () => {
  it('shows the done state after completing all sets', async () => {
    const user = userEvent.setup();
    wrap(<ExerciseCard exercise={EXERCISE} autoStartVideo={false} />);

    const doneBtn = screen.getByRole('button', { name: /finish set/i });
    for (let i = 0; i < EXERCISE.sets; i++) {
      await user.click(doneBtn);
    }

    // Done card is shown.
    expect(screen.getByText(/done.*nice work/i)).toBeInTheDocument();
  });
});
