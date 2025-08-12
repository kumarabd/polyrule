import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

function Policies() {
  // Sample policies data - in a real app, this would come from an API or database
  const policies = [
    {
      id: 1,
      title: 'Data Privacy Policy',
      description: 'Guidelines for handling sensitive user data and ensuring privacy compliance.'
    },
    {
      id: 2,
      title: 'Security Policy',
      description: 'Standards for maintaining security across all systems and applications.'
    },
    {
      id: 3,
      title: 'Code of Conduct',
      description: 'Expected behavior and ethical guidelines for all employees.'
    },
    {
      id: 4,
      title: 'Remote Work Policy',
      description: 'Guidelines for working remotely and maintaining productivity.'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Policies
          </Typography>
          <Typography variant="body1" paragraph>
            Below is a list of all organizational policies. These policies are designed to ensure compliance, 
            security, and ethical conduct across the organization.
          </Typography>
          
          <List>
            {policies.map((policy, index) => (
              <React.Fragment key={policy.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<Typography variant="h6">{policy.title}</Typography>}
                    secondary={policy.description}
                  />
                </ListItem>
                {index < policies.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default Policies;
