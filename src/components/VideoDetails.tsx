import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, ButtonProps, TextField, Typography } from '@mui/material';

import { IAuthor, ICategory, IFormatData, IFormats, IProcessedVideo } from '../common/interfaces';
import styled from '@emotion/styled';
import { getAuthors } from '../services/authors';
import { getCategories } from '../services/categories';
import { IVideoDetails } from './VideosManger';

interface IVideoDetailsProps {
  onSubmitSuccess: (videoDetails: IVideoDetails) => void;
  videoDetailsData: IVideoDetails;
  cancelVideoDetails: () => void;
}

interface IFormData {
  videoName?: string;
  author?: IAuthor;
  categories?: ICategory[];
}

export const VideoDetails: React.FC<IVideoDetailsProps> = ({ onSubmitSuccess, videoDetailsData, cancelVideoDetails }) => {
  const [authorOptions, setAuthorOptions] = useState<IAuthor[]>();
  const [categoryOptions, setCategoryOptions] = useState<ICategory[]>();

  const [formError, setFormError] = useState<any>({});

  const [formData, setFormData] = useState<IFormData>({
    videoName: videoDetailsData.name,
    author: videoDetailsData.author,
    categories: videoDetailsData.categories,
  });

  useEffect(() => {
    getCategories().then((response: ICategory[]) => {
      setCategoryOptions(response);
    });

    getAuthors().then((response: IAuthor[]) => {
      setAuthorOptions(
        response.map((author) => {
          return { id: author.id, name: author.name };
        })
      );
    });
  }, []);

  const formValidation = {
    videoName: [
      {
        type: 'required',
        message: 'Please provide video name',
      },
      {
        type: 'maxLength',
        value: 30,
        message: 'Maximum 30 characters allowed',
      },
    ],
    author: [
      {
        type: 'required',
        message: 'Please select a author',
      },
    ],
    categories: [
      {
        type: 'required',
        message: 'Please select a author',
      },
      {
        type: 'minLength',
        value: 1,
        message: 'Please select at least one category',
      },
    ],
  };

  const formInputChange = (inputName: string, value?: string | IAuthor | ICategory[]) => {
    setFormData({ ...formData, [inputName]: value });
  };
  const submitVideoDetails = () => {
    // make api call to add or update video details.
    // on success
    onSubmitSuccess({
      id: videoDetailsData.id,
      name: formData.videoName,
      author: formData.author,
      categories: formData.categories,
      formats: videoDetailsData.formats
        ? videoDetailsData.formats
        : {
            one: { res: '1080p', size: 1000 },
          },
      releaseDate: videoDetailsData.releaseDate ? videoDetailsData.releaseDate : '2018-08-09',
    });
  };

  return (
    <div>
      {authorOptions && categoryOptions && (
        <div>
          <Typography variant="h4">My videos</Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '100%' },
              '&': { paddingTop: '20px' },
            }}
            noValidate
            autoComplete="off">
            <div>
              <TextField
                id="video-name-text"
                label="Video name"
                defaultValue=""
                value={formData.videoName}
                onChange={(event) => {
                  formInputChange('videoName', event.target.value);
                }}
              />
            </div>
            <div>
              <Autocomplete
                aria-required
                disablePortal
                disableClearable
                id="author-name-select"
                value={formData.author}
                options={authorOptions}
                getOptionLabel={(option) => option.name}
                onChange={(event: React.SyntheticEvent, value: IAuthor | null) => {
                  console.log('author-name-select : ', value);
                  formInputChange('author', value ? value : undefined);
                }}
                renderInput={(params) => <TextField {...params} label="Author name" placeholder="Search and select" />}
              />
            </div>
            <div>
              <Autocomplete
                aria-required
                multiple
                disableCloseOnSelect
                id="categories-multi-select"
                value={formData.categories}
                options={categoryOptions}
                getOptionLabel={(option) => option.name}
                onChange={(event, value: ICategory[] | null) => {
                  formInputChange('categories', value ? value : undefined);
                }}
                defaultValue={[]}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} label="Categories" placeholder="Search/choose multiple.." />}
              />
            </div>

            <div className="mt-20">
              <Button variant="outlined" size="large" type="button" onClick={cancelVideoDetails}>
                Cancel
              </Button>
              <ButtonStyled variant="contained" size="large" type="button" onClick={submitVideoDetails}>
                Save
              </ButtonStyled>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
};

const ButtonStyled = styled(Button)<ButtonProps>(() => ({
  marginLeft: '20px',
}));
