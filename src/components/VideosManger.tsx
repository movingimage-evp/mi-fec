import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Skeleton,
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
import { TableHeadCell } from './TableHeadCell';
import { HighLightText } from './HighLightText';

type sortArg<T> = keyof T;

interface IVideosTableProps {
  // no props are sent.
}

interface IVideosFiltered extends IProcessedVideo {
  authorName: string;
  categoriesText: string;
  highestQualityFormat: string;
}
export type TOrder = 'asc' | 'des';

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
  const [videosFiltered, setVideosFiltered] = useState<IVideosFiltered[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [videoDetailsData, setVideoDetailsData] = useState<IVideoDetails>();
  const [videoDelete, setVideoDelete] = useState<IProcessedVideo>();
  const [sortByColumn, setSortByColumn] = useState<string>();
  const [sortByAs, setSortByAs] = useState<TOrder>();

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

  useEffect(() => {
    const videosFilteredArr: IVideosFiltered[] = videos.flatMap((video): IVideosFiltered[] => {
      let categoriesText = video.categories.map((category: ICategory) => category.name).join(', ');
      let highestQualityFormatText = getQualityformats(video.formats)[0];

      if (searchText && searchText !== '') {
        let allDataText = video.name + video.author.name + categoriesText + highestQualityFormatText + video.releaseDate;

        return allDataText.includes(searchText)
          ? [{ ...video, authorName: video.author.name, categoriesText: categoriesText, highestQualityFormat: highestQualityFormatText }]
          : [];
      }
      return [{ ...video, authorName: video.author.name, categoriesText: categoriesText, highestQualityFormat: highestQualityFormatText }];
    });

    setVideosFiltered(videosFilteredArr);
  }, [searchText, videos]);

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

  const deleteVideo = (videoId?: number) => {
    if (videoId !== undefined) {
      let videosArr = [...videos];
      videosArr.splice(
        videos.findIndex((element) => element.id === videoId),
        1
      );

      setVideos(videosArr);
    }
    setVideoDelete(undefined);
  };

  const setSorting = (sortBy: string, sortAs: TOrder) => {
    let videosArr = [...videosFiltered];
    /*
   

    type ObjectKey = keyof typeof videos[0];

    const formDataKey = sortBy as ObjectKey;

    videosArr.sort((a: IProcessedVideo, b: IProcessedVideo) => {
      let valueA = a[formDataKey];
      let valueB = b[formDataKey];
      if ((typeof valueA === 'string' || typeof valueA === 'number') && (typeof valueB === 'string' || typeof valueB === 'number')) {
        return valueA - valueB;
      }
      return 0;
    });
    */

    type ObjectKey = keyof typeof videos[0];
    const formDataKey = sortBy as ObjectKey;

    console.log('sorted arr :', videosArr.sort(sortbyPropertiesOf<IProcessedVideo>(formDataKey, sortAs)));
    // sort(videos, 'name', '-age', 'id')
    setVideosFiltered(videosArr);
    setSortByAs(sortAs);
    setSortByColumn(sortBy);
  };

  const sortbyPropertiesOf = <T extends object>(sortBy: sortArg<T>, sortAs: TOrder) => {
    function compareByProperty(arg: sortArg<T>, sortAs: TOrder) {
      let key: keyof T;
      let sortOrder = 1;
      if (typeof arg === 'string' && sortAs === 'des') {
        sortOrder = -1;
      }
      key = arg as keyof T;
      return function (a: T, b: T) {
        let aValue = a[key];
        let bValue = b[key];
        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return result * sortOrder;
      };
    }

    return function (obj1: T, obj2: T) {
      let result = 0;
      result = compareByProperty(sortBy, sortAs)(obj1, obj2);
      return result;
    };
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
          {loadingVideos && (
            <LoadingSectionStyled>
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
                    {[...Array(5)].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </LoadingSectionStyled>
          )}
          {!loadingVideos && (
            <TableContainer component={Paper} style={{ marginTop: '40px' }}>
              <Table>
                <TableHead>
                  <TableRow style={{ fontWeight: 'bold' }}>
                    <TableCell>
                      <TableHeadCell
                        active={sortByColumn === 'name'}
                        setSorting={setSorting}
                        sortByColumn={sortByColumn}
                        sortByAs={sortByAs}
                        valueKey={'name'}>
                        Video name
                      </TableHeadCell>
                    </TableCell>
                    <TableCell>
                      <TableHeadCell
                        active={sortByColumn === 'authorName'}
                        setSorting={setSorting}
                        sortByColumn={sortByColumn}
                        sortByAs={sortByAs}
                        valueKey={'authorName'}>
                        Author
                      </TableHeadCell>
                    </TableCell>

                    <TableCell>
                      <TableHeadCell>Categories</TableHeadCell>{' '}
                    </TableCell>
                    <TableCell>
                      <TableHeadCell>Heighest quality format</TableHeadCell>{' '}
                    </TableCell>
                    <TableCell>
                      <TableHeadCell>Release date</TableHeadCell>{' '}
                    </TableCell>
                    <TableCell>
                      <TableHeadCell>Options</TableHeadCell>{' '}
                    </TableCell>
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

          {videoDelete && <DeleteVideoConfirmation onClose={deleteVideo} videoDetails={videoDelete} />}
        </div>
      )}

      {videoDetailsData && !loadingVideos && (
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

const LoadingSectionStyled = styled.div``;
