import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';

function Rules() {
  // Sample rules data - in a real app, this would come from an API or database
  const rules = [
    {
      id: 1,
      title: 'Password Requirements',
      description: 'Passwords must be at least 12 characters long and include uppercase, lowercase, numbers, and special characters.',
      category: 'Security'
    },
    {
      id: 2,
      title: 'Data Retention',
      description: 'Customer data must be retained for a minimum of 7 years and a maximum of 10 years.',
      category: 'Compliance'
    },
    {
      id: 3,
      title: 'Access Control',
      description: 'Access to production systems requires multi-factor authentication and proper authorization.',
      category: 'Security'
    },
    {
      id: 4,
      title: 'Code Review',
      description: 'All code changes must be reviewed by at least two team members before deployment.',
      category: 'Development'
    },
    {
      id: 5,
      title: 'Incident Reporting',
      description: 'Security incidents must be reported within 24 hours of discovery.',
      category: 'Security'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Rules
          </Typography>
          <Typography variant="body1" paragraph>
            Below is a comprehensive list of organizational rules that must be followed. These rules are designed 
            to ensure security, compliance, and operational excellence.
          </Typography>
          
          <List>
            {rules.map((rule, index) => (
              <React.Fragment key={rule.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6">{rule.title}</Typography>
                        <Chip label={rule.category} color={
                          rule.category === 'Security' ? 'error' : 
                          rule.category === 'Compliance' ? 'warning' : 
                          'primary'
                        } size="small" />
                      </Box>
                    }
                    secondary={rule.description}
                  />
                </ListItem>
                {index < rules.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default Rules;
