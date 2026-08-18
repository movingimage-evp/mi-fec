import type { ChangeEvent } from 'react';
import type { ReactElement } from 'react';

import styles from './button.module.css';

type VideoSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  resultCount?: number;
};

/** Default copy for the filter input, kept here so call sites stay terse. */
export const DEFAULT_PLACEHOLDER = 'Filter by name, author or category';

export const VideoSearch = ({
  query,
  onQueryChange,
  placeholder = DEFAULT_PLACEHOLDER,
  resultCount = 0,
}: VideoSearchProps): ReactElement => (
  <label className={styles.search}>
    <span>Search</span>
    <input
      type="search"
      value={query}
      placeholder={placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
    />
    <small>{resultCount} result(s)</small>
  </label>
);
