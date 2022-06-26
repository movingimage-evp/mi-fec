import { Button, Checkbox, Container, FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';
import { Author } from '../common/interfaces';
import { categories, authors } from '../common/utils';

// initial author state to add new video
const initialValues: Author = { id: 0, name: '', videos: [] };

// constant video formats
const videoFormats = {
    one: {
        res: "720p",
        size: 4500
    }
};

const SubmitButton = styled('div')({
    textAlign: 'right'
});

export const AddVideo = () => {

    const [formValues, setFormValues] = useState(initialValues);
    const [videoAuthor, setVideoAuthor] = useState('');
    const [videoName, setVideoName] = useState("");
    const [videoCategory, setVideoCategory] = useState([] as { id: number, name: string }[]);

    const isAllSelected = categories.length > 0 && videoCategory.length === categories.length;

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
                        id: 0,
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
            reset();
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
                            value={videoCategory.map(x => x.name)}
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
                    <Button variant="contained" color="inherit" type="button">Cancel</Button>
                </SubmitButton>
            </form>
        </Container>
    );
};
