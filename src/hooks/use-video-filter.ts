import { useCallback, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

import type { ProcessedVideo } from '../common/interfaces';

/**
 * Filters videos by a free-text query matched against name, author and categories.
 *
 * The last non-empty query is kept around so the table can offer "restore last
 * search" after the input has been cleared.
 */
export const useVideoFilter = (videos: ProcessedVideo[]) => {
  const [query, setQuery] = useState('');
  const lastNonEmptyQuery: MutableRefObject<string> = useRef('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return videos;
    }

    lastNonEmptyQuery.current = needle;

    return videos.filter(({ name, author, categories }) =>
      [name, author, ...categories].some((field) => field.toLowerCase().includes(needle))
    );
  }, [videos, query]);

  const restoreLastQuery = useCallback(() => setQuery(lastNonEmptyQuery.current), []);

  return { query, setQuery, filtered, restoreLastQuery };
};
