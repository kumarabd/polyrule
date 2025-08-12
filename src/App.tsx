import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Policies from './components/pages/Policies';
import Rules from './components/pages/Rules';
import ChatInterface from './components/ChatInterface';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ padding: '20px 0' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/rules" element={<Rules />} />
            </Routes>
          </main>
          <ChatInterface />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
