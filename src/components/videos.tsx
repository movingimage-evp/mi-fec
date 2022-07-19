import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Category, FormatData, Formats, ProcessedVideo } from '../common/interfaces';
import { getVideos } from '../services/videos';

interface VideosTableProps {
  // no props are sent.
}

export const Videos: React.FC<VideosTableProps> = () => {
  const [loadingVideos, setLoadingVideos] = useState<boolean>(true);
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  useEffect(() => {
    getVideos().then((videos) => {

    // add delay to from mock reaponse time delay 
      setTimeout(() => {
        setLoadingVideos(false);
        setVideos(videos);
      }, 2000);
    });
  }, []);

  const getQualityformats = (formats: Formats): string[] => {
    let formatList : FormatData[] = [];
    for (const [key, value] of Object.entries(formats)) {
      formatList.push({...value, name:key});
    }

    // sortby : size, if equal then by res 
    formatList = formatList.sort((a,b)=> {
      console.log(a.res , a.res);
      let aResNum  = parseInt(a.res.split('p')[0]);
      let bResNum = parseInt(b.res.split('p')[0]);

      return (b.size - a.size || bResNum - aResNum);
    });
    
    return formatList.map((formatItem)=>`${formatItem.name} ${formatItem.res}`);
  };

  return (
    <div>
      {!loadingVideos && (
        <TableContainer component={Paper} style={{ marginTop: '40px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Video Name</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Heighest quality format</TableCell>
                <TableCell>Release date</TableCell>
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
                  <TableCell>{video.categories.map((category: Category) => category.name).join(', ')}</TableCell>
                  <TableCell>
                    {getQualityformats(video.formats)[0]}
                  </TableCell>
                  <TableCell>{video.releaseDate}</TableCell>
                  <TableCell> {/* add buttons here as needed */} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
