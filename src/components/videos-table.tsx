import { useEffect, useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { ProcessedVideo } from '../common/interfaces';
import { deleteVideo, getVideos } from '../services/videos';
import { useNavigate } from 'react-router-dom';
import { confirmationToDelete } from '../utils/alerts-dialogue';
import Swal from 'sweetalert2';

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
  const deleteRecord = (videoId: number) => {
    confirmationToDelete().then(isDeleted => {
      if (isDeleted) {

        // Delete the video using video id
        deleteVideo(videoId).then(response => {

          const { status } = response;
          if (status === 200) {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            let deletedVideos = videos.filter((video) => video.id !== videoId);
            setVideos(deletedVideos);
          }

        }).catch((e: Error) => {
          console.log(e);
        });

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
                    onClick={() => navigate(`edit-video?id=${video.id}`)}
                  >
                    <EditOutlinedIcon />
                    Edit
                  </Button>
                  <Button variant="contained" color="error" type="button" onClick={() => deleteRecord(video.id)}>
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
