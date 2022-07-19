import React, { useEffect, useState } from 'react';
import {
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
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { Category, FormatData, Formats, ProcessedVideo } from '../common/interfaces';
import { getVideos } from '../services/videos';
import styled from '@emotion/styled';

interface VideosTableProps {
  // no props are sent.
}

interface VideosFiltered extends ProcessedVideo {
  categoriesText: string;
  highestQualityFormat: string;
}

export const Videos: React.FC<VideosTableProps> = () => {
  const [loadingVideos, setLoadingVideos] = useState<boolean>(true);
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [searchText, setSearchText] = useState<string>('');

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
    let formatList: FormatData[] = [];
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

  const videosFiltered: VideosFiltered[] = videos.flatMap((video): VideosFiltered[] => {
    let categoriesText = video.categories.map((category: Category) => category.name).join(', ');
    let highestQualityFormatText = getQualityformats(video.formats)[0];

    if (searchText && searchText !== '') {
      let allDataText = video.name + video.author + categoriesText + highestQualityFormatText + video.releaseDate;

      return allDataText.includes(searchText)
        ? [{ ...video, categoriesText: categoriesText, highestQualityFormat: highestQualityFormatText }]
        : [];
    }
    return [{ ...video, categoriesText: categoriesText, highestQualityFormat: highestQualityFormatText }];
  });

  return (
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
                    <HighLightText match={searchText}>{video.author}</HighLightText>
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

interface IHighLightText {
  match: string;
  children: string;
}

const HighLightText: React.FC<IHighLightText> = ({ match, children }) => {
  if (children.includes(match)) {
    let childrenSplitArr: string[] = children.split(match);
    let childrenElementArr: JSX.Element[] = [];

    childrenSplitArr.forEach((ele, idx) => {
      if (idx === 0 && childrenSplitArr[0] === '') {
        childrenElementArr.push(<HighLightStyled className="hight-light-text">{match}</HighLightStyled>);
      } else if (idx === childrenSplitArr.length - 1) {
        childrenElementArr.push(<span>{ele}</span>);
      } else {
        childrenElementArr.push(<span>{ele}</span>);
        childrenElementArr.push(<HighLightStyled className="hight-light-text">{match}</HighLightStyled>);
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
