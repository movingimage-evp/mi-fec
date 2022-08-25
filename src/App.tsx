import React, { useEffect, useState } from 'react';
import { VideosTable } from './components/videos-table';
import { getVideos } from './services/videos';
import { ProcessedVideo } from './common/interfaces';

import styles from './app.module.css';

const App: React.FC = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  useEffect(() => {
    getVideos().then((videos) => {
      setVideos(videos);
    });
  }, []);

  return (
    <>
      <div className={styles.toolbar}>
        <h1>Videos</h1>
      </div>
      <div className={styles.container}>
        <VideosTable videos={videos} />
      </div>
    </>
  );
};

export default App;
