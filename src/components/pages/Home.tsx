import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to PolyRule
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your centralized policy and rules management platform
          </Typography>
          <Typography variant="body1" paragraph>
            Navigate through our application to view policies and rules that are applicable to your organization.
            This platform helps you stay compliant and informed about all the guidelines you need to follow.
          </Typography>
          <Typography variant="body1">
            Use the navigation menu to explore different sections of the application.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
