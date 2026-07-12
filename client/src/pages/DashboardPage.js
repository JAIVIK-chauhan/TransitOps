import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f3f4f6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          background: 'white',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </header>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2>Welcome, {user.name}!</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Email: {user.email}
          </p>
          <p style={{ color: '#6b7280' }}>
            Role: {user.role}
          </p>
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              More dashboard content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
