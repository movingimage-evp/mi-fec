import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { IAuthor, ICategory, IFormatData, IFormats, IProcessedVideo } from '../common/interfaces';
import { getVideos } from '../services/videos';
import styled from '@emotion/styled';
import { VideoDetails } from './VideoDetails';
import { DeleteVideoConfirmation } from './DeleteVideoConfirmation';

interface IVideosTableProps {
  // no props are sent.
}

interface IVideosFiltered extends IProcessedVideo {
  categoriesText: string;
  highestQualityFormat: string;
}

export interface IVideoDetails {
  id?: number;
  name?: string;
  author?: IAuthor;
  categories?: ICategory[];
  formats?: IFormats;
  releaseDate?: string;
}

export const Videos: React.FC<IVideosTableProps> = () => {
  const [loadingVideos, setLoadingVideos] = useState<boolean>(true);
  const [videos, setVideos] = useState<IProcessedVideo[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [videoDetailsData, setVideoDetailsData] = useState<IVideoDetails>();
  const [videoDelete, setVideoDelete] = useState<IProcessedVideo>();

  console.log(videoDetailsData);

  useEffect(() => {
    getVideos().then((videos) => {
      // add delay to from mock reaponse time delay
      setTimeout(() => {
        setLoadingVideos(false);
        setVideos(videos);
      }, 2000);
    });
  }, []);

  const getQualityformats = (formats: IFormats): string[] => {
    let formatList: IFormatData[] = [];
    for (const [key, value] of Object.entries(formats)) {
      formatList.push({ ...value, name: key });
    }
    // sortby : size, if equal then by res
    formatList = formatList.sort((a, b) => {
      let aResNum = parseInt(a.res.split('p')[0]);
      let bResNum = parseInt(b.res.split('p')[0]);

      return b.size - a.size || bResNum - aResNum;
    });

    return formatList.map((formatItem) => `${formatItem.name} ${formatItem.res}`);
  };

  const videosFiltered: IVideosFiltered[] = videos.flatMap((video): IVideosFiltered[] => {
    let categoriesText = video.categories.map((category: ICategory) => category.name).join(', ');
    let highestQualityFormatText = getQualityformats(video.formats)[0];

    if (searchText && searchText !== '') {
      let allDataText = video.name + video.author.name + categoriesText + highestQualityFormatText + video.releaseDate;

      return allDataText.includes(searchText)
        ? [{ ...video, categoriesText: categoriesText, highestQualityFormat: highestQualityFormatText }]
        : [];
    }
    return [{ ...video, categoriesText: categoriesText, highestQualityFormat: highestQualityFormatText }];
  });

  const addUpdateVideoDetails = (videoDetails: IVideoDetails) => {
    if (videoDetails.name && videoDetails.author && videoDetails.categories && videoDetails.formats && videoDetails.releaseDate) {
      let newAddedVideoDetails = {
        id: videoDetails.id ? videoDetails.id : videos.length + 1,
        name: videoDetails.name,
        author: videoDetails.author,
        categories: videoDetails.categories,
        formats: videoDetails.formats,
        releaseDate: videoDetails.releaseDate,
      };
      let videosArr = [...videos];

      if (videoDetails.id === undefined) {
        videosArr.push(newAddedVideoDetails);
      } else {
        videosArr.splice(
          videos.findIndex((element) => element.id === videoDetails.id),
          1,
          newAddedVideoDetails
        );
      }
      setVideoDetailsData(undefined);
      setVideos(videosArr);
    }
  };

  const cancelVideoDetails = () => {
    setVideoDetailsData(undefined);
  };

  const deleteVideo = (videoId: number) => {
    let videosArr = [...videos];
    videosArr.splice(
      videos.findIndex((element) => element.id === videoId),
      1
    );

    setVideos(videosArr);
    setVideoDelete(undefined);
  };

  return (
    <>
      {!videoDetailsData && (
        <div className="mt-20">
          <Typography variant="h4">My videos</Typography>
          <TopContainerStyled>
            <div>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-search"
                  type={'text'}
                  value={searchText}
                  placeholder="Start typing..."
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchText(event.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  }
                  label="Search"
                />
                <InputInfoStyled>*Search text is case sensitive.</InputInfoStyled>
              </FormControl>
            </div>
            <div>
              <Button
                variant="contained"
                size="large"
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  setVideoDetailsData({});
                }}>
                <AddIcon /> Add Video
              </Button>
            </div>
          </TopContainerStyled>

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
                  {videosFiltered.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell component="th" scope="row">
                        <HighLightText match={searchText}>{video.name}</HighLightText>
                      </TableCell>
                      <TableCell>
                        <HighLightText match={searchText}>{video.author.name}</HighLightText>
                      </TableCell>
                      <TableCell>
                        <HighLightText match={searchText}>{video.categoriesText}</HighLightText>
                      </TableCell>
                      <TableCell>
                        <HighLightText match={searchText}>{video.highestQualityFormat}</HighLightText>
                      </TableCell>
                      <TableCell>
                        <HighLightText match={searchText}>{video.releaseDate}</HighLightText>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="medium"
                          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setVideoDetailsData({
                              id: video.id,
                              name: video.name,
                              author: video.author,
                              categories: video.categories,
                              formats: video.formats,
                              releaseDate: video.releaseDate,
                            });
                          }}>
                          <EditIcon />
                        </Button>
                        <Button
                          style={{ marginLeft: '10px' }}
                          variant="outlined"
                          color="error"
                          size="medium"
                          onClick={() => {
                            setVideoDelete(video);
                          }}>
                          <DeleteForeverIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {videoDelete && (
            <DeleteVideoConfirmation
              onClose={(action) => {
                if (action !== undefined) {
                  deleteVideo(action);
                }
              }}
              videoDetails={videoDelete}
            />
          )}
        </div>
      )}

      {videoDetailsData && (
        <div className="mt-20">
          <VideoDetails
            onSubmitSuccess={addUpdateVideoDetails}
            videoDetailsData={videoDetailsData}
            cancelVideoDetails={cancelVideoDetails}
          />
        </div>
      )}
    </>
  );
};

interface IHighLightText {
  match: string;
  children: string;
}

const HighLightText: React.FC<IHighLightText> = ({ match, children }) => {
  if (match && match !== '' && children.includes(match)) {
    let childrenSplitArr: string[] = children.split(match);
    let childrenElementArr: JSX.Element[] = [];

    childrenSplitArr.forEach((ele, idx) => {
      if (idx === 0 && childrenSplitArr[0] === '') {
        childrenElementArr.push(
          <HighLightStyled className="hight-light-text" key={'case1' + idx + ele}>
            {match}
          </HighLightStyled>
        );
      } else if (idx === childrenSplitArr.length - 1) {
        childrenElementArr.push(<span key={'case2' + idx + ele}>{ele}</span>);
      } else {
        childrenElementArr.push(<span key={'case3' + idx + ele}>{ele}</span>);
        childrenElementArr.push(
          <HighLightStyled className="hight-light-text" key={'case31' + idx + ele}>
            {match}
          </HighLightStyled>
        );
      }
    });

    return <span>{childrenElementArr}</span>;
  }

  return <span>{children}</span>;
};

const HighLightStyled = styled.span`
  color: rgb(102, 60, 0);
  background-color: rgb(255, 244, 229);
  font-weight: bold;
`;

const InputInfoStyled = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  margin: 5px 0 0;
`;

const TopContainerStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
