# Developer Guide

This guide provides technical information for developers who want to contribute to or extend the PolyRule application.

## Project Structure

The PolyRule project follows a standard React application structure:

```
polyrule/
├── docs/                  # Documentation files
├── node_modules/          # Dependencies
├── public/                # Static files
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js    # Home page
│   │   │   ├── Policies.js # Policies page
│   │   │   └── Rules.js   # Rules page
│   │   └── Navbar.js      # Navigation component
│   ├── hooks/            # Custom React hooks
│   │   ├── usePolicySets.js # Data management hook for policy sets/policies
│   │   ├── usePolicyUIState.js # UI state management hook for policy sets
│   │   ├── useRuleSets.js # Data management hook for rule sets/rules
│   │   └── useRuleUIState.js # UI state management hook for rule sets
│   ├── App.js             # Main application component
│   ├── index.js           # Entry point
│   └── ...                # Other files
├── package.json           # Dependencies and scripts
└── README.md              # Project overview
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

## Custom Hooks Architecture

The application uses a custom hooks architecture to separate concerns and improve code maintainability. This approach moves state management and business logic out of components and into reusable hooks.

### Hooks Directory Structure

The hooks are organized in the `src/hooks` directory:

- `usePolicySets.js`: Manages policy sets and policies data with CRUD operations
- `usePolicyUIState.js`: Manages UI state for dialogs, forms, and user interactions related to policy sets

### Policy Sets Data Management Hook (usePolicySets.js)

This hook encapsulates all data operations for policy sets and their nested policies:

```jsx
// src/hooks/usePolicySets.js
import { useState } from 'react';

export const policySetTypes = [
  { value: 'authorization', label: 'Authorization' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'business', label: 'Business' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'custom', label: 'Custom' }
];

export const usePolicySets = () => {
  // State for policy sets data with nested policies
  const [policySets, setPolicySets] = useState([
    // Sample initial data with policies nested within each policy set
  ]);
  
  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // CRUD operations for policy sets
  const createPolicySet = (policySetData) => {
    // Implementation to create a new policy set
  };

  const updatePolicySet = (id, policySetData) => {
    // Implementation to update an existing policy set
  };

  const deletePolicySet = (id) => {
    // Implementation to delete a policy set and its nested policies
  };

  // CRUD operations for policies within policy sets
  const createPolicy = (policySetId, policyData) => {
    // Implementation to create a policy within a specific policy set
  };

  const updatePolicy = (policySetId, policyId, policyData) => {
    // Implementation to update a policy within a specific policy set
  };

  const deletePolicy = (policySetId, policyId) => {
    // Implementation to delete a policy from its policy set
  };

  // Helper function to get icon name based on policy set type
  const getPolicySetIconName = (type) => {
    // Return appropriate icon name based on policy set type
  };

  return {
    policySets,
    snackbar,
    createPolicySet,
    updatePolicySet,
    deletePolicySet,
    createPolicy,
    updatePolicy,
    deletePolicy,
    getPolicySetIconName,
    closeSnackbar
  };
};
```

### Policy UI State Management Hook (usePolicyUIState.js)

This hook manages all UI-related state for policy sets and policies:

```jsx
// src/hooks/usePolicyUIState.js
import { useState, useCallback } from 'react';

export const usePolicyUIState = () => {
  // Navigation state - tracks which policy set is currently being viewed
  const [selectedPolicySetId, setSelectedPolicySetId] = useState(null);
  
  // Tab state for filtering policy sets by type
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPolicyDialog, setOpenPolicyDialog] = useState(false);
  const [openPolicyDeleteDialog, setOpenPolicyDeleteDialog] = useState(false);
  
  // Current selections
  const [currentPolicySet, setCurrentPolicySet] = useState(null);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  
  // Form inputs for policy sets and policies
  const [formInputs, setFormInputs] = useState({
    name: '',
    description: '',
    type: 'authorization'
  });
  
  const [policyFormInputs, setPolicyFormInputs] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  
  // Menu anchors for policy sets
  const [menuAnchors, setMenuAnchors] = useState({});
  
  // Navigation handlers
  const viewPolicySet = (id) => {
    // Implementation to view a specific policy set's policies
  };
  
  const backToPolicySets = () => {
    // Implementation to return to policy sets list view
  };
  
  // Dialog handlers for policy sets and policies
  const openCreatePolicySetDialog = () => {
    // Implementation
  };
  
  // Other dialog and UI state handlers...

  return {
    // Navigation state
    selectedPolicySetId,
    viewPolicySet,
    backToPolicySets,
    
    // Tab state
    selectedTab,
    setSelectedTab,
    
    // Dialog states
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openPolicyDialog,
    openPolicyDeleteDialog,
    
    // Form inputs
    formInputs,
    policyFormInputs,
    handleFormInputChange,
    handlePolicyFormInputChange,
    
    // Current selections
    currentPolicySet,
    currentPolicy,
    
    // Dialog actions
    openCreatePolicySetDialog,
    openEditPolicySetDialog,
    openDeletePolicySetDialog,
    openCreatePolicyDialog,
    openEditPolicyDialog,
    openDeletePolicyDialog,
    closeDialogs,
    
    // Menu handlers
    menuAnchors,
    handleMenuOpen,
    handleCloseMenu
  };
};
```

### Using Custom Hooks in Components

Components use these hooks to access data and UI state without managing it directly:

```jsx
// src/components/pages/Policies.js
import React from 'react';
import { usePolicySets, policySetTypes } from '../../hooks/usePolicySets';
import { usePolicyUIState } from '../../hooks/usePolicyUIState';

function Policies() {
  // Use custom hooks for policy sets data and UI state management
  const { 
    policySets, 
    snackbar, 
    createPolicySet, 
    updatePolicySet, 
    deletePolicySet, 
    createPolicy, 
    updatePolicy, 
    deletePolicy, 
    getPolicySetIconName,
    closeSnackbar 
  } = usePolicySets();
  
  const {
    // Selected policy set for viewing details
    selectedPolicySetId,
    viewPolicySet,
    backToPolicySets,
    
    // Tab state
    selectedTab,
    setSelectedTab,
    
    // Dialog states
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openPolicyDialog,
    openPolicyDeleteDialog,
    
    // Form inputs
    formInputs,
    policyFormInputs,
    handleFormInputChange,
    handlePolicyFormInputChange,
    
    // Current selections
    currentPolicySet,
    currentPolicy,
    
    // Dialog actions
    openCreatePolicySetDialog,
    openEditPolicySetDialog,
    openDeletePolicySetDialog,
    openCreatePolicyDialog,
    openEditPolicyDialog,
    openDeletePolicyDialog,
    closeDialogs,
    
    // Menu handlers
    menuAnchors,
    handleMenuOpen,
    handleCloseMenu
  } = usePolicyUIState();

  // Component logic using hook-provided state and functions...
}
```

### Policy Sets and Rule Sets Data Models

#### Policy Sets Data Model

The application uses a hierarchical data model for organizing policies:

```
PolicySet
├── id: string
├── name: string
├── description: string
├── type: string (authorization|firewall|business|compliance|custom)
└── policies: Array
    ├── id: string
    ├── name: string
    ├── description: string
    └── status: string (active|inactive|draft)
```

This model allows for multiple independent policy sets, each containing its own set of policies. The key aspects of this architecture are:

1. **Independent Policy Sets**: Each policy set is a separate entity with its own properties and policies
2. **Categorization by Type**: Policy sets are categorized by type (authorization, firewall, etc.) for easy filtering
3. **Nested Policies**: Policies are nested within their parent policy set
4. **Consistent Policy Status**: Each policy has a status (active, inactive, or draft)

#### Rule Sets Data Model

Similarly, the Rules page uses a hierarchical data model for organizing rules within rule sets:

```
RuleSet
├── id: string
├── name: string
├── description: string
├── type: string (alerting|routing|security|compliance|development)
└── rules: Array
    ├── id: string
    ├── title: string
    ├── description: string
    └── severity: string (high|medium|low)
```

Key aspects of the rule sets architecture:

1. **Independent Rule Sets**: Each rule set is a separate entity with its own properties and rules
2. **Categorization by Type**: Rule sets are categorized by type (alerting, routing, security, etc.) for filtering
3. **Nested Rules**: Rules are nested within their parent rule set
4. **Severity Levels**: Each rule has a severity level (high, medium, or low) for prioritization

### Benefits of Custom Hooks Architecture

1. **Separation of Concerns**: Components focus on rendering UI, hooks handle data and state logic
2. **Code Reusability**: Hooks can be reused across multiple components
3. **Improved Testability**: Hooks can be tested in isolation from components
4. **Maintainability**: Easier to understand and modify code as the application grows
5. **Scalable Data Model**: The policy sets architecture allows for easy extension to support more complex policy hierarchies

## API Integration

In a real-world scenario, the `usePolicySets` hook would integrate with an API to fetch and manage policy sets data:

```jsx
// Example of API integration within usePolicySets.js
import { useState, useEffect, useCallback } from 'react';

export const usePolicySets = () => {
  const [policySets, setPolicySets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close notification
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch all policy sets on mount
  useEffect(() => {
    const fetchPolicySets = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/policy-sets');
        if (!response.ok) throw new Error('Failed to fetch policy sets');
        const data = await response.json();
        setPolicySets(data);
      } catch (err) {
        setError(err.message);
        showNotification(`Error: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolicySets();
  }, []);

  // Create a new policy set
  const createPolicySet = useCallback(async (policySetData) => {
    try {
      const response = await fetch('https://api.example.com/policy-sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policySetData)
      });
      
      if (!response.ok) throw new Error('Failed to create policy set');
      
      const newPolicySet = await response.json();
      setPolicySets(prev => [...prev, newPolicySet]);
      showNotification(`Policy set "${newPolicySet.name}" created successfully`);
      return newPolicySet;
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
      return null;
    }
  }, []);

  // Fetch policies for a specific policy set
  const fetchPolicies = useCallback(async (policySetId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.example.com/policy-sets/${policySetId}/policies`);
      if (!response.ok) throw new Error('Failed to fetch policies');
      const policies = await response.json();
      
      // Update the policies for this specific policy set
      setPolicySets(prev => prev.map(ps => 
        ps.id === policySetId ? { ...ps, policies } : ps
      ));
      
      return policies;
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
      return [];
    } finally {
      setLoading(false);
    }
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
