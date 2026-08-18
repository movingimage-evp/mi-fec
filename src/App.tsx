import { useEffect, useState } from 'react';

import type { ProcessedVideo } from './common/interfaces';
import { getVideos } from './services/videos';
import { useVideoFilter } from './hooks/use-video-filter';
import { VideosTable } from './components/videos-table';
import { VideoSearch } from './components/video-search';
import { Button } from './components/button';
import reportWebVitals from './reportWebVitals';
import styles from './app.module.css';

export const App = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const { query, setQuery, filtered } = useVideoFilter(videos);

  useEffect(() => {
    getVideos().then(setVideos);
    reportWebVitals();
  }, []);

  return (
    <>
      <header className={styles.header}>
        Videos
        <Button primary>Add video</Button>
      </header>

      <main className={styles.main}>
        <h1>VManager Demo v0.0.1</h1>
        <VideoSearch query={query} onQueryChange={setQuery} resultCount={filtered.length} />
        <VideosTable videos={filtered} />
      </main>

      <footer className={styles.footer}>VManager Demo v0.0.1</footer>
    </>
  );
};
