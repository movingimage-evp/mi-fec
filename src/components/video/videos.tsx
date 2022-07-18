import React, { useEffect, useState } from 'react';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { VideosTable } from './videos-table';
import { getVideos } from '../../services/videos';
import { ProcessedVideo } from '../../common/interfaces';

// TODO: update video page
export const Videos: React.FC = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  useEffect(() => {
    getVideos().then((videos) => {
      setVideos(videos);
    });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Videos</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <VideosTable videos={videos} />
      </Container>
    </>
  );
};
