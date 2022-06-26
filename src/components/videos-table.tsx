import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ProcessedVideo } from '../common/interfaces';
import { getVideos } from '../services/videos';



export const VideosTable = () => {

  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  useEffect(() => {
    getVideos()
      .then((videos) => {
        setVideos(videos);
      });
  }, []);

  return (
    <TableContainer component={Paper} style={{ marginTop: '40px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Video Name</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell component="th" scope="row">
                {video.name}
              </TableCell>
              <TableCell>{video.author}</TableCell>
              <TableCell>{video.categories.join(', ')}</TableCell>
              <TableCell> {/* add buttons here as needed */}  </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
