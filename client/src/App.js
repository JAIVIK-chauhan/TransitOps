import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setMessage(data.message);
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to server');
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>TransitOps</h1>
        <p>Transit Operations Management System</p>
        {loading && <p>Connecting to server...</p>}
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </header>
    </div>
  );
}

export default App;
