# Developer Guide

This guide provides technical information for developers who want to contribute to or extend the PolyRule application.

## Project Structure

The PolyRule project follows a standard React application structure:

```
polyrule/
├── @docs/                  # Documentation files
├── node_modules/           # Dependencies
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js     # Home page
│   │   │   ├── Policies.js # Policies page
│   │   │   └── Rules.js    # Rules page
│   │   └── Navbar.js       # Navigation component
│   ├── App.js              # Main application component
│   ├── index.js            # Entry point
│   └── ...                 # Other files
├── package.json            # Dependencies and scripts
└── README.md               # Project overview
```

## Technology Stack

PolyRule is built with the following technologies:

- **React**: A JavaScript library for building user interfaces
- **React Router**: For navigation between pages
- **Material UI**: For UI components and styling
- **Create React App**: For project setup and configuration

## Component Overview

### App.js

The main application component that sets up routing and the Material UI theme.

```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// ... other imports

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/rules" element={<Rules />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}
```

### Navbar.js

The navigation component that provides links to all pages.

```jsx
// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// ... other imports

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PolyRule
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        <Button color="inherit" component={RouterLink} to="/policies">Policies</Button>
        <Button color="inherit" component={RouterLink} to="/rules">Rules</Button>
      </Toolbar>
    </AppBar>
  );
}
```

### Page Components

Each page is a separate component in the `src/components/pages` directory:

- **Home.js**: The landing page
- **Policies.js**: Displays a list of policies
- **Rules.js**: Displays a list of rules with categories

## Adding New Features

### Adding a New Page

1. Create a new component in the `src/components/pages` directory
2. Add a new route in `App.js`
3. Add a new navigation button in `Navbar.js`

Example:

```jsx
// src/components/pages/NewPage.js
import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function NewPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            New Page
          </Typography>
          <Typography variant="body1">
            Content for the new page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default NewPage;
```

Then update `App.js` and `Navbar.js` accordingly.

### Modifying the Theme

The Material UI theme is defined in `App.js`. You can modify it to change the application's appearance:

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change this to your preferred color
    },
    secondary: {
      main: '#dc004e', // Change this to your preferred color
    },
  },
  // Add more theme customizations here
});
```

## Data Management

Currently, the application uses static data defined within each component. In a real-world scenario, you would likely fetch data from an API.

To implement API integration:

1. Create a services directory for API calls
2. Use React hooks (useState, useEffect) to manage data fetching and state
3. Implement loading states and error handling

Example:

```jsx
// src/services/api.js
export const fetchPolicies = async () => {
  const response = await fetch('https://api.example.com/policies');
  if (!response.ok) {
    throw new Error('Failed to fetch policies');
  }
  return response.json();
};
```

```jsx
// src/components/pages/Policies.js
import React, { useState, useEffect } from 'react';
import { fetchPolicies } from '../../services/api';

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await fetchPolicies();
        setPolicies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPolicies();
  }, []);

  // Render component based on loading, error, and policies states
}
```

## Testing

PolyRule uses Jest and React Testing Library for testing. To run tests:

```bash
npm test
```

To write a new test:

1. Create a file with the `.test.js` extension next to the component you want to test
2. Write your tests using Jest and React Testing Library

Example:

```jsx
// src/components/Navbar.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('renders navbar with links', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  
  expect(screen.getByText('PolyRule')).toBeInTheDocument();
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Policies')).toBeInTheDocument();
  expect(screen.getByText('Rules')).toBeInTheDocument();
});
```

## Deployment

PolyRule can be deployed to various platforms. For GitHub Pages deployment, follow these steps:

1. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add the following to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/polyrule",
   "scripts": {
     // other scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy the application:
   ```bash
   npm run deploy
   ```

## Contributing

We welcome contributions to PolyRule! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Submit a pull request

Please ensure your code follows our coding standards and passes all tests.
