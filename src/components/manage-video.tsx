import {
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Author, Category } from '../common/interfaces';
import { addVideo, getCategoriesAndAuthors, getVideoDetail, updateVideo } from '../services/videos';
import { successfullyCreated, successfullyUpdated } from '../utils/alerts-dialogue';

interface StateType {
  state: { videoId: number, authorId: number }
}

const SubmitButton = styled('div')`
    text-Align: right;
`;

export const MangeVideo = () => {

  const navigate = useNavigate();
  const { state } = useLocation() as StateType;
  const videoId = state?.videoId;
  const authorId = state?.authorId;

  const [videoAuthor, setVideoAuthor] = useState('');
  const [videoName, setVideoName] = useState("");
  const [videoCategory, setVideoCategory] = useState([] as { id: number, name: string }[]);

  // For dropdown data population
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const isAllSelected = categories.length > 0 && videoCategory.length === categories.length;

  // Trigger when categories are updated
  useEffect(() => {
    if (authorId) {
      getVideoDetail(authorId)
        .then((response) => {

          const { data } = response;
          const selectedVideo = data.videos.filter(video => video.id === videoId)

          setVideoName(selectedVideo[0].name);
          setVideoAuthor(data.name);
          setVideoCategory(categories.filter(category => selectedVideo[0].catIds.includes(category.id)));

        }).catch((e: Error) => {
          console.log(e);
        });
    }
  }, [categories]);

  useEffect(() => {
    getCategoriesAndAuthors()
      .then(({ categories, authors }) => {
        setCategories(categories);
        setAuthors(authors);
      });
  }, []);

  /**
   * To set up values for select fields
   * video category, video author
   */
  const handleChange = (event: SelectChangeEvent<string[]>) => {

    const values = event.target.value;
    const selectedCategories = categories.filter(category => values.includes(category.name));
    setVideoCategory(selectedCategories);

    if (values[values.length - 1] === "all") {
      setVideoCategory(videoCategory.length === categories.length ? [] : categories);
      return;
    };

  };

  /**
   * To submit form with valid data
   */
  const handleSubmit = (e: any) => {

    e.preventDefault();
    if (videoName && videoAuthor && videoCategory.length) {

      const videoState: Author = {
        id: authorId || 0,
        name: videoAuthor,
        videos: [{
          id: videoId || 0,
          name: videoName,
          catIds: videoCategory.map(x => x.id),
          formats: {
            one: {
              res: "720p",
              size: 4500
            }
          }
        }]
      };

      // If we have video id then it will update existing otherwise create new record
      if (authorId) {
        // to update video
        updateVideo(videoState).then(response => {

          const { status } = response;
          if (status === 200) {
            successfullyUpdated().then(isConfirmed => {
              if (isConfirmed) {
                navigate('/');
              }
            });
          }

        }).catch((e: Error) => {
          console.log(e);
        });
      } else {

        addVideo(videoState).then(response => {

          const { status } = response;
          if (status === 201) {
            successfullyCreated().then(isConfirmed => {
              if (isConfirmed) {
                navigate('/');
              }
            });
          }

        }).catch((e: Error) => {
          console.log(e);
        });
      }

    } else {
      alert('In-complete form');
    }
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={e => { handleSubmit(e) }} key="asd">
        <div>
          <TextField
            name="videoName"
            fullWidth
            id="outlined-basic"
            label="Video Name"
            variant="outlined"
            sx={{ mb: 3, mt: 3 }}
            value={videoName}
            onChange={event => setVideoName(event.target.value)}
          />
        </div>
        <div>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="video-author-label">Video Author</InputLabel>
            <Select
              name="videoAuthor"
              labelId="video-author-label"
              id="video-author"
              value={videoAuthor}
              label="Video Author"
              onChange={event => setVideoAuthor(event.target.value)}
            >
              {authors.map((author) => (
                <MenuItem value={author.name} key={author.id}>{author.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel id="video-category-label">Video category</InputLabel>
            <Select
              name="videoCategory"
              labelId="video-category-label"
              multiple
              value={videoCategory.map(vc => vc.name)}
              onChange={handleChange}
              label="Video category"
              renderValue={(videoCategory) => videoCategory.join(", ")}
            >
              <MenuItem
                value="all"
              >
                <ListItemIcon>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={
                      videoCategory.length > 0 && videoCategory.length < categories.length
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Select All"
                />
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  <ListItemIcon>
                    <Checkbox checked={videoCategory.indexOf(category) > -1} />
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <SubmitButton sx={{ mt: 3 }}>
          <Button variant="contained" type="submit" sx={{ mr: 1 }}>Submit</Button>
          <Button
            variant="contained"
            color="inherit"
            type="button"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </SubmitButton>
      </form>
    </Container>
  );
};
