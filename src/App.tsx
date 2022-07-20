import React from 'react';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Videos } from './components/VideosManger';
const App: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Videos Manager</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Videos />
      </Container>
    </>
  );
};

export default App;
