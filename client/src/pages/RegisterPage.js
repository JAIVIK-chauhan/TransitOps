import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { ROLE_OPTIONS } from '../utils/roleConfig';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Fleet Manager',
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
      await authAPI.register(formData.name, formData.email, formData.password, formData.role);
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
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
          <h1 className="auth-title">Create your command center</h1>
          <p className="auth-subtitle">Invite your team to a premium transport management experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input id="name" type="text" name="name" placeholder="Jordan Lee" value={formData.name} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" name="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Organization Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-input">
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Creating workspace...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already onboarded?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
