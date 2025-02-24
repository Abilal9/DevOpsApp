import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [number, setNumber] = useState(0);

  const API_BASE_URL = 'http://myapp.local/api';

  const fetchNumber = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/increment/get/`);
      if (response.data && response.data.current_number !== undefined) {
        setNumber(response.data.current_number);
      } else {
        console.log('Unexpected response format');
      }
    } catch (error) {
      console.log('Error fetching number:', error);
    }
  };

  const handleIncrement = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/increment/`);
      if (response.data && response.data.success !== undefined) {
        if (response.data.success) {
          console.log('Increment successful');
          fetchNumber();
        } else {
          console.log('Increment failed');
        }
      } else {
        console.log('Unexpected response format');
      }
    } catch (error) {
      console.log('Error incrementing number:', error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset/`);
      if (response.data && response.data.success !== undefined) {
        if (response.data.success) {
          console.log('Reset successful');
          fetchNumber();
        } else {
          console.log('Reset failed');
        }
      } else {
        console.log('Unexpected response format');
      }
    } catch (error) {
      console.log('Error resetting number:', error);
    }
  };

  useEffect(() => {
    fetchNumber();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Current number: {number}</p>
        <button className="round-button" onClick={handleIncrement}>
          Increment Number
        </button>
        <button className="round-button" onClick={handleReset}>
          Reset - Test
        </button>
      </header>
    </div>
  );
}

export default App;