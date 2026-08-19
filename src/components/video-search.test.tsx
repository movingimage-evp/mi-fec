import { describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { VideoSearch } from './video-search';

describe('VideoSearch', () => {
  it('falls back to the default placeholder', () => {
    render(<VideoSearch query="" onQueryChange={() => {}} />);

    expect(screen.getByPlaceholderText('Filter by name, author or category')).toBeInTheDocument();

    cleanup();
  });

  it('reports the default result count when none is given', () => {
    render(<VideoSearch query="" onQueryChange={() => {}} />);

    expect(screen.getByText('0 result(s)')).toBeInTheDocument();

    cleanup();
  });

  it('emits every keystroke to the parent', async () => {
    const onQueryChange = vi.fn();

    render(<VideoSearch query="" onQueryChange={onQueryChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'jazz');

    expect(onQueryChange).toHaveBeenCalledTimes(4);
  });
});
