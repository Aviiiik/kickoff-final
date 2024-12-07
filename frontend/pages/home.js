import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure the correct path to your firebase config
import createImage from '../images/create.jpg';
import manageImage from '../images/manage.avif';
import updateImage from '../images/update.avif';
import './Home.css';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up an authentication state observer and get user data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setIsAuthenticated(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate('/schedule');
    } else {
      navigate('/login');
    }
  };

  return (
    <Container>
      <Box className="header" textAlign="center" mt={5} mb={5}>
        <Typography variant="h2" component="h1" gutterBottom>
          Donna
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Your personal event manager
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: '20px' }}
          onClick={handleButtonClick}
        >
          Create My Schedule
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Box className="info-box" position="relative" textAlign="center">
            <img src={createImage} alt="Create" className="box-image" />
            <Typography className="box-text" variant="h5" component="h2">
              Create
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className="info-box" position="relative" textAlign="center">
            <img src={manageImage} alt="Manage" className="box-image" />
            <Typography className="box-text" variant="h5" component="h2">
              Manage
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className="info-box" position="relative" textAlign="center">
            <img src={updateImage} alt="Update" className="box-image" />
            <Typography className="box-text" variant="h5" component="h2">
              Update
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;