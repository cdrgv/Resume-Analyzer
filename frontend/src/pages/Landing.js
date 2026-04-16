import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="landing">
    <nav className="landing-nav">
      <div className="nav-brand"><span className="brand-icon">⚡</span><span>ResumeAI</span></div>
      <div className="nav-links">
        <Link to="/login" className="btn-ghost">Sign In</Link>
        <Link to="/register" className="btn-primary">Get Started Free</Link>
      </div>
    </nav>

    <section className="hero">
      <div className="hero-badge">🚀 AI-Powered Resume Analysis</div>
      <h1 className="hero-title">
        Get Your Resume<br />
        <span className="gradient-text">Noticed & Hired</span>
      </h1>
      <p className="hero-subtitle">
        Upload your PDF resume and get an instant AI analysis — score, skills gap, ATS tips, and job role recommendations. Used by 10,000+ candidates.
      </p>
      <div className="hero-cta">
        <Link to="/register" className="btn-primary large">Analyze My Resume →</Link>
        <Link to="/login" className="btn-ghost large">Sign In</Link>
      </div>
      <div className="hero-stats">
        <div className="hero-stat"><strong>10K+</strong> Resumes Analyzed</div>
        <div className="hero-stat"><strong>95%</strong> Accuracy Rate</div>
        <div className="hero-stat"><strong>Free</strong> To Use</div>
      </div>
    </section>

    <section className="features-section">
      <h2>Everything you need to land your dream job</h2>
      <div className="features-grid">
        {[
          { icon: '🎯', title: 'Resume Score', desc: 'Get a score out of 100 based on skills, experience, projects, education, and keywords.' },
          { icon: '🔍', title: 'Skills Extraction', desc: 'Auto-detect 100+ technical skills and identify what you\'re missing for your target role.' },
          { icon: '💡', title: 'AI Suggestions', desc: 'Receive personalized actionable tips to beat ATS filters and get more interviews.' },
          { icon: '💼', title: 'Job Matching', desc: 'Discover which specific job roles match your profile — Web Dev, Data Science, Mobile, and more.' },
          { icon: '📊', title: 'Visual Analytics', desc: 'See beautiful charts breaking down your resume performance across all sections.' },
          { icon: '🔒', title: 'Secure & Private', desc: 'Your resume is analyzed securely and never shared. Files are deleted after analysis.' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="cta-section">
      <h2>Ready to upgrade your resume?</h2>
      <p>Join thousands of candidates who improved their resumes with ResumeAI</p>
      <Link to="/register" className="btn-primary large">Get Started Free →</Link>
    </section>

    <footer className="landing-footer">
      <p>© 2024 ResumeAI · Built with React, Node.js & MongoDB</p>
    </footer>
  </div>
);

export default Landing;
