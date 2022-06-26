import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';

export const App = () => {

  const navigate = useNavigate();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate("/")}>Videos</Typography>
          <Button color="success" variant="contained" onClick={() => navigate("/add-video")}>Add Video</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
