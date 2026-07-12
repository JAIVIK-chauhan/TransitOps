import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const features = [
  { title: 'Autonomous Dispatch', text: 'Move freight with real-time orchestration and intelligent fleet balancing.' },
  { title: 'Safety at the Core', text: 'Keep compliance, maintenance, and driver readiness always in sync.' },
  { title: 'Operational Clarity', text: 'Understand every trip, cost, and utilization signal in a single flow.' },
];

const stats = [
  { label: 'Vehicles', value: '128' },
  { label: 'Trips', value: '3.4k' },
  { label: 'Fuel Saved', value: '18%' },
  { label: 'ROI', value: '2.7x' },
];

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? currentScroll / maxScroll : 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallax = useMemo(() => ({
    x: (mousePosition.x - window.innerWidth / 2) / 40,
    y: (mousePosition.y - window.innerHeight / 2) / 40,
  }), [mousePosition]);

  return (
    <div className="landing-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="cursor-glow" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }} />

      <header className="landing-header" style={{ backdropFilter: scrollProgress > 0.05 ? 'blur(24px)' : 'blur(0px)' }}>
        <div className="brand-block">
          <div className="brand-badge">TO</div>
          <div>
            <p className="brand-name">TransitOps</p>
            <p className="brand-tag">Future-ready transport intelligence</p>
          </div>
        </div>
        <nav className="landing-nav">
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-cta">Launch Platform</Link>
        </nav>
      </header>

      <main className="landing-main" ref={heroRef}>
        <section className="hero-section">
          <div className="hero-copy" style={{ transform: `translate3d(${parallax.x * 0.3}px, ${parallax.y * 0.3}px, 0)` }}>
            <p className="eyebrow">Award-worthy logistics OS</p>
            <h1>Operate every route like a high-performance network.</h1>
            <p className="hero-text">TransitOps blends fleet visibility, dispatch intelligence, safety controls, and cost optimization into a cinematic command experience built for modern transport teams.</p>
            <div className="hero-actions">
              <Link to="/register" className="primary-btn">Enter Command Center</Link>
              <Link to="/dashboard" className="secondary-btn">Explore Live Demo</Link>
            </div>
          </div>

          <div className="hero-scene" style={{ transform: `translate3d(${parallax.x * 0.2}px, ${parallax.y * 0.2}px, 0)` }}>
            <div className="scene-road" />
            <div className="scene-cloud cloud-one" />
            <div className="scene-cloud cloud-two" />
            <div className="scene-truck" />
            <div className="scene-container" />
            <div className="scene-route-line" />
            <div className="floating-card card-top">
              <span>Live Dispatch</span>
              <strong>94.8% on-time</strong>
            </div>
            <div className="floating-card card-mid">
              <span>Fleet Pulse</span>
              <strong>128 vehicles</strong>
            </div>
            <div className="floating-card card-bottom">
              <span>Safety Score</span>
              <strong>97.2</strong>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </section>

        <section className="features-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title} style={{ animationDelay: `${index * 120}ms` }}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
