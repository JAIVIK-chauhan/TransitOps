import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    email: 'admin@transitops.com',
    password: 'TransitOps123',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-badge">TO</div>
          </div>
          <h1 className="auth-title">Command your fleet</h1>
          <p className="auth-subtitle">Secure, intelligent operations for modern transport teams.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" name="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="form-input" />
          </div>

          <label className="remember-row">
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe((prev) => !prev)} />
            <span>Remember me for 30 days</span>
          </label>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Need access?{' '}
            <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
