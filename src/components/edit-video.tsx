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
    TextField
} from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Author, Category } from '../common/interfaces';
import { addVideo, getCategoriesAndAuthors, getVideoDetail } from '../services/videos';
import { successfullyCreated } from '../utils/alerts-dialogue';

// initial author state to add new video
const initialValues: Author = { id: 0, name: '', videos: [] };

// constant video formats
const videoFormats = {
    one: {
        res: "720p",
        size: 4500
    }
};

const SubmitButton = styled('div')`
    text-Align: right;
`;

export const EditVideo = () => {

    const navigate = useNavigate();
    const { search } = useLocation();
    const paramsId = new URLSearchParams(search).get('id');

    const [formValues, setFormValues] = useState(initialValues);
    const [videoAuthor, setVideoAuthor] = useState('');
    const [videoName, setVideoName] = useState("");
    const [videoCategory, setVideoCategory] = useState([] as { id: number, name: string }[]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);

    const isAllSelected = categories.length > 0 && videoCategory.length === categories.length;

    useEffect(() => {
        getCategoriesAndAuthors()
            .then(({ categories, authors }) => {
                setCategories(categories);
                setAuthors(authors);
            });
    }, []);

    const setFormFields = (data: Author) => {
        const video = data.videos[0];

        setVideoName(video.name);
        setVideoAuthor(data.name);
        // const selectedCategory = categories.filter(category => video.catIds.includes(category.id));
        setVideoCategory(() => categories.filter(category => video.catIds.includes(category.id)));
    }

    useEffect(() => {

        getVideoDetail(Number(paramsId))
            .then((response) => {

                const { data } = response;
                setFormValues(data);
                setFormFields(data);

            }).catch((e: Error) => {
                console.log(e);
            });

    }, [paramsId]);



    /**
     * To set up values for select fields
     * video category, video author
     */
    const handleChange = (event: any) => {

        const inputName = event.target.name;
        const inputValue = event.target.value;

        switch (inputName) {
            case 'videoAuthor':

                setVideoAuthor(inputValue);
                setFormValues({
                    ...formValues,
                    name: inputValue
                });
                break;

            case 'videoCategory':

                const value = inputValue;
                const selectedCategory = categories.filter(category => value.includes(category.name));

                if (value[value.length - 1] === "all") {
                    setVideoCategory(videoCategory.length === categories.length ? [] : categories);
                    return;
                };

                setVideoCategory(selectedCategory);
                setFormValues({
                    ...formValues,
                    videos: [{
                        id: null,
                        catIds: selectedCategory.map(vc => vc.id),
                        name: videoName,
                        formats: videoFormats,
                    }]
                });
                break;

            default:
                break;
        }
    };

    /**
     * To reset form after submission
     */
    const reset = () => {
        setVideoName("");
        setVideoAuthor("");
        setVideoCategory([]);
        setFormValues(initialValues);
    };

    /**
     * To submit form with valid data
     */
    const handleSubmit = (e: any) => {

        e.preventDefault();
        if (videoName && videoAuthor && videoCategory.length) {

            addVideo(formValues).then(response => {

                const { status } = response;
                if (status === 201) {
                    successfullyCreated().then(isConfirmed => {
                        if (isConfirmed)
                            reset();
                    });
                }

            }).catch((e: Error) => {
                console.log(e);
            });

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
                        onChange={(e) => setVideoName(e.target.value)}
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
                            onChange={handleChange}
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
