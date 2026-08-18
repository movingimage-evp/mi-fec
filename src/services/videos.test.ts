import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Author, Category } from '../common/interfaces';
import { getAuthors } from './authors';
import { getCategories } from './categories';
import { getVideos } from './videos';

vi.mock('./authors');
vi.mock('./categories');

const categories: Category[] = [
  { id: 1, name: 'Music' },
  { id: 2, name: 'Sports' },
];

const authors: Author[] = [
  {
    id: 1,
    name: 'Ann Smith',
    videos: [{ id: 10, catIds: [1], name: 'Concert' }],
  },
  {
    id: 2,
    name: 'Bob Jones',
    videos: [{ id: 20, catIds: [1, 2], name: 'Halftime Show' }],
  },
];

describe('getVideos', () => {
  beforeEach(() => {
    vi.mocked(getCategories).mockResolvedValue(categories);
    vi.mocked(getAuthors).mockResolvedValue(authors);
  });

  it('returns one entry per video across all authors', async () => {
    const videos = await getVideos();

    expect(videos).toHaveLength(2);
    expect(videos.map(({ id }) => id)).toEqual([10, 20]);
  });

  it('attaches the author name to each video', async () => {
    const videos = await getVideos();

    expect(videos.find(({ id }) => id === 10)?.author).toBe('Ann Smith');
    expect(videos.find(({ id }) => id === 20)?.author).toBe('Bob Jones');
  });

  it('resolves category ids to category names', async () => {
    const videos = await getVideos();

    expect(videos.find(({ id }) => id === 10)?.categories).toEqual(['Music']);
    expect(videos.find(({ id }) => id === 20)?.categories).toEqual(['Music', 'Sports']);
  });

  it('returns an empty list when there are no authors', async () => {
    vi.mocked(getAuthors).mockResolvedValue([]);

    expect(await getVideos()).toEqual([]);
  });
});
