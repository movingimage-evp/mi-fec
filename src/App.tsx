import { useEffect, useState } from 'react';

import type { ProcessedVideo } from './common/interfaces';
import { getVideos } from './services/videos';
import { VideosTable } from './components/videos-table';
import { Button } from './components/button';
import styles from './app.module.css';

export const App = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  useEffect(() => {
    getVideos().then(setVideos);
  }, []);

  return (
    <>
      <header className={styles.header}>
        Videos
        <Button primary>Add video</Button>
      </header>

      <main className={styles.main}>
        <h1>VManager Demo v0.0.1</h1>
        <VideosTable videos={videos} />
      </main>

      <footer className={styles.footer}>VManager Demo v0.0.1</footer>
    </>
  );
};
