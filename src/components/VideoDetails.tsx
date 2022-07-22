import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, ButtonProps, TextField, Typography } from '@mui/material';

import { IAuthor, ICategory } from '../common/interfaces';
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
  ['videoName']: string | undefined;
  ['author']: IAuthor | undefined;
  ['categories']: ICategory[] | undefined;
}

interface IFieldError {
  type: string;
  message: string;
  value?: number | RegExp;
}

interface IFormDataError {
  ['videoName']: IFieldError | undefined;
  ['author']: IFieldError | undefined;
  ['categories']: IFieldError | undefined;
}

interface IFormValidator {
  ['videoName']: IFieldError[];
  ['author']: IFieldError[];
  ['categories']: IFieldError[];
}

export const VideoDetails: React.FC<IVideoDetailsProps> = ({ onSubmitSuccess, videoDetailsData, cancelVideoDetails }) => {
  const [authorOptions, setAuthorOptions] = useState<IAuthor[]>();
  const [categoryOptions, setCategoryOptions] = useState<ICategory[]>();

  const [formError, setFormError] = useState<IFormDataError>();

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

  const formInputChange = (inputName: string, value?: string | IAuthor | ICategory[]) => {
    type ObjectKey = keyof typeof formError;

    const formDataKey = inputName as ObjectKey;

    if (formError?.[formDataKey]) {
      let formErrorTemp: IFormDataError = {
        videoName: formError?.videoName,
        author: formError?.author,
        categories: formError?.categories,
      };
      delete formErrorTemp[formDataKey];
      setFormError(formErrorTemp);
    }
    setFormData({ ...formData, [inputName]: value });
  };

  const checkValidation = () => {
    // Demonstration of using custom validation rules from a json. check const 'FORM_VALIDATION_RULES'.
    // helpful in case managing large form validation and can be applied from a api response.

    let formErrorDefault: IFormDataError = {
      videoName: undefined,
      author: undefined,
      categories: undefined,
    };
    if (formErrorDefault) {
      type ObjectKey = keyof typeof FORM_VALIDATION_RULES;

      for (const [key, value] of Object.entries(FORM_VALIDATION_RULES)) {
        console.log(`${key}: ${value}`);

        const formDataKey = key as ObjectKey;

        var { foundError, formErrorData } = checkFieldValidation(formDataKey, formData, value, formErrorDefault);
      }
      setFormError(formErrorData);
    }

    return foundError;
  };

  // function checkFieldValidation: to use to validate a field value against set of validation rule
  const checkFieldValidation = (
    field: keyof IFormValidator,
    formDataValue: IFormData,
    validationRules: IFieldError[],
    formErrorData: IFormDataError
  ) => {
    let fieldValue = formDataValue[field];
    let foundError = false;
    for (const validationRule of validationRules) {
      if (validationRule.type === 'required' && !fieldValue) {
        foundError = true;
        formErrorData[field] = { type: 'required', message: validationRule.message };
        break;
      } else if (validationRule.type === 'maxLength' && validationRule.value && fieldValue) {
        let len = Array.isArray(fieldValue) || typeof fieldValue === 'string' ? fieldValue.length : null;

        if (len && len > validationRule.value) {
          foundError = true;
          formErrorData[field] = { type: 'maxLength', message: validationRule.message };
          break;
        }
      } else if (validationRule.type === 'minLength' && validationRule.value && fieldValue) {
        let valueTemp = fieldValue;

        let len = Array.isArray(valueTemp) || typeof valueTemp === 'string' ? valueTemp.length : null;

        if (len && len < validationRule.value) {
          foundError = true;
          formErrorData[field] = { type: 'minLength', message: validationRule.message };
          break;
        }
      }
    }

    return {
      foundError,
      formErrorData,
    };
  };

  const submitVideoDetails = () => {
    // Tip: in practice after validation check, make api call to add or update video details.
    // only after success
    !checkValidation() &&
      onSubmitSuccess({
        id: videoDetailsData.id,
        name: formData.videoName,
        author: formData.author,
        categories: formData.categories,
        formats: videoDetailsData.formats
          ? videoDetailsData.formats
          : {
              one: { res: '1080p', size: 1000 }, // default quality
            },
        releaseDate: videoDetailsData.releaseDate ? videoDetailsData.releaseDate : getRandomDate(),
      });
  };

  const getRandomDate = () => {
    let dateStr = '' + (Math.floor(Math.random() * (27 - 1 + 1)) + 1); // 27: to avoid leap year error
    let monthStr = '' + (Math.floor(Math.random() * (12 - 1 + 1)) + 1);
    let yearStr = '' + (Math.floor(Math.random() * (2025 - 2018 + 1)) + 2018); // random year from 2018 to 2022
    return `${yearStr}-${monthStr.length === 1 ? '0' + monthStr : monthStr}-${dateStr.length === 1 ? '0' + dateStr : dateStr}`;
  };

  return (
    <div>
      {authorOptions && categoryOptions && (
        <div>
          <Typography variant="h4">{videoDetailsData.id ? 'Update video details' : 'Add new video details'}</Typography>
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
                error={formError?.videoName ? true : false}
                helperText={formError?.videoName?.message}
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event: React.SyntheticEvent, value: IAuthor | null) => {
                  formInputChange('author', value ? value : undefined);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Author name"
                    placeholder="Search and select"
                    error={formError?.author ? true : false}
                    helperText={formError?.author?.message}
                  />
                )}
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value: ICategory[] | null) => {
                  formInputChange('categories', value ? value : undefined);
                }}
                defaultValue={[]}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categories"
                    placeholder="Search/choose multiple.."
                    error={formError?.categories ? true : false}
                    helperText={formError?.categories?.message}
                  />
                )}
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
  // Demonstration of using a existing styled component, and customizing it.
  marginLeft: '20px',
}));

// form validation rules from json
const FORM_VALIDATION_RULES: IFormValidator = {
  videoName: [
    {
      type: 'required',
      message: 'Please provide video name',
    },
    {
      type: 'maxLength',
      value: 50,
      message: 'Maximum 50 characters allowed',
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
      message: 'Please select at least one category',
    },
    {
      type: 'minLength',
      value: 2,
      message: 'Minimum 2 categories selection needed.(minLength demonstration)',
    },
    {
      type: 'maxLength',
      value: 3,
      message: 'Maximum 3 categories selection allowed.(maxLength demonstration)',
    },
  ],
};
