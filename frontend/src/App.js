import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [number, setNumber] = useState(0);

  const fetchNumber = async () => {
    try {
      const response = await axios.get('http://0.0.0.0:8000/increment/get/');
      if (response.data && response.data.current_number !== undefined) {
        setNumber(response.data.current_number);  
      } else {
        console.log('Unexpected response format');
      }
    } catch (error) {
      console.log('Error fetching number');
    }
  };

  const handleIncrement = async () => {
    try {
      const response = await axios.post('http://0.0.0.0:8000/increment/');
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
      console.log('Error incrementing number');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post('http://0.0.0.0:8000/reset/');
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
      console.log('Error resetting number');
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
          Reset
        </button>
      </header>
    </div>
  );
}

export default App;