import React, { useState } from 'react';
import axios from 'axios';

import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Countries from './pages/Countries';

import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user ? 
        <Countries />
         : 
        <AuthPage />
      }
    </div>
  );
}

export default App;
