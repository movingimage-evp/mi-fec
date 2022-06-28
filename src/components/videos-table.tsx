import { useEffect, useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { ProcessedVideo } from '../common/interfaces';
import { getVideos } from '../services/videos';
import { useNavigate } from 'react-router-dom';
import { confirmationToDelete } from '../utils/alerts-dialogue';

const Options = styled('div')`
  & button svg {
    font-size: 16px;
  }
`;

const TableHeader = styled(TableHead)`
  background-color: #1976d2;
  & tr th {
    color: #eef8f9;
    font-size: 18px;
  }
`;

export const VideosTable = () => {

  const navigate = useNavigate();
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  useEffect(() => {
    getVideos()
      .then((videos) => {
        setVideos(videos);
      }).catch((e: Error) => {
        console.log(e);
      });
  }, []);

  /**
   * To delete video
   */
  const deleteRecord = (videoId: number, authorId: number) => {
    confirmationToDelete().then(isDeleted => {
      if (isDeleted) {

        // TODO: integrate rest API to delete video of selected author
        // Deleting on frontend because unable to find delelte API for selected author
        let deletedVideos = videos.filter((video) => video.id !== videoId || video.authorId !== authorId);
        setVideos(deletedVideos);
      }
    });
  }

  return (
    <TableContainer component={Paper} style={{ marginTop: '40px' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Video Name</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Options</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video, idx) => (
            <TableRow key={idx}>
              <TableCell component="th" scope="row">
                {video.name}
              </TableCell>
              <TableCell>{video.author}</TableCell>
              <TableCell>{video.categories.join(', ')}</TableCell>
              <TableCell>
                <Options>
                  <Button
                    variant="contained"
                    type="button"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`manage-video`,
                      { state: { videoId: video.id, authorId: video.authorId } }
                    )}
                  >
                    <EditOutlinedIcon />
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    type="button"
                    onClick={() => deleteRecord(video.id, video.authorId)}
                  >
                    <DeleteOutlineOutlinedIcon />
                    Delete
                  </Button>
                </Options>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
