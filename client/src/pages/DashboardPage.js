import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleBadge, getRoleLabel, getRoleNavigation } from '../utils/roleConfig';
import './Dashboard.css';

const statCards = [
  { label: 'Active Vehicles', value: '128', delta: '+8.4%' },
  { label: 'Active Trips', value: '34', delta: '+12%' },
  { label: 'Maintenance', value: '6', delta: '2 urgent' },
  { label: 'Fuel Efficiency', value: '18.2 mpg', delta: '+3.1%' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = getRoleLabel(user.role || 'Fleet Manager');
  const badge = getRoleBadge(role);
  const navigation = getRoleNavigation(role);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">TO</div>
          <div>
            <h2>TransitOps</h2>
            <p>Operations Command</p>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Workspace</p>
          {navigation.map((item) => (
            <button key={item.label} className="sidebar-link">
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-card">
          <p className="sidebar-label">Current Access</p>
          <div className={`role-pill role-${badge}`}>{role}</div>
          <p className="sidebar-meta">Live tracking, dispatch, and fleet oversight.</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Transit Operations ERP</p>
            <h1>Welcome back, {user.name || 'Operator'}.</h1>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </header>

        <section className="hero-panel">
          <div>
            <p className="hero-kicker">Mission control</p>
            <h2>Monitor your fleet, dispatch confidently, and act on alerts in real time.</h2>
            <p className="hero-copy">This premium control center is designed for fleet managers, safety officers, analysts, and drivers alike.</p>
          </div>
          <div className="hero-badge">Live • 24/7</div>
        </section>

        <section className="stats-grid">
          {statCards.map((card) => (
            <article key={card.label} className="stat-card">
              <p>{card.label}</p>
              <h3>{card.value}</h3>
              <span>{card.delta}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel-card">
            <div className="panel-heading">
              <h3>Today’s Priority Queue</h3>
              <span>Updated 2m ago</span>
            </div>
            <ul className="priority-list">
              <li>Trip 4825 • Driver assigned and en route</li>
              <li>Maintenance review • Vehicle #TX-102 needs inspection</li>
              <li>Fuel alert • Route 9 consumption is above target</li>
            </ul>
          </article>

          <article className="panel-card">
            <div className="panel-heading">
              <h3>Operational Snapshot</h3>
              <span>AI-assisted insight</span>
            </div>
            <p className="hero-copy">Suggested action: reassign one available vehicle to reduce downtime by 14% this afternoon.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
