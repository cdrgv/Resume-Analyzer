import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { resumeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

const ScoreGauge = ({ score }) => {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-gauge">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70" cy="70" r="54" fill="none"
          stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.5s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold">{score}</text>
        <text x="70" y="85" textAnchor="middle" fill="#94a3b8" fontSize="12">out of 100</text>
      </svg>
    </div>
  );
};

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeAPI.getById(id)
      .then(res => setData(res.data.data))
      .catch(() => { toast.error('Result not found'); navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [id,navigate]);

  if (loading) return (
    <div className="loading-screen"><div className="spinner"></div><p>Loading analysis...</p></div>
  );
  if (!data) return null;

  const breakdownData = [
    { name: 'Skills', value: data.breakdown.skills, max: 30 },
    { name: 'Projects', value: data.breakdown.projects, max: 25 },
    { name: 'Experience', value: data.breakdown.experience, max: 20 },
    { name: 'Education', value: data.breakdown.education, max: 10 },
    { name: 'Keywords', value: data.breakdown.keywords, max: 15 },
  ];

  const scoreLabel = data.score >= 75 ? 'Excellent' : data.score >= 50 ? 'Good' : data.score >= 25 ? 'Needs Work' : 'Poor';
  const scoreColor = data.score >= 75 ? '#10b981' : data.score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand"><span className="brand-icon">⚡</span><span>ResumeAI</span></div>
        <div className="nav-links">
          <Link to="/dashboard" className="btn-ghost small">← Dashboard</Link>
          <Link to="/analyze" className="btn-primary small">+ New Analysis</Link>
          <button onClick={logout} className="btn-ghost small">Logout</button>
        </div>
      </nav>

      <div className="result-page">
        {/* Hero Score */}
        <div className="result-hero">
          <div className="result-hero-left">
            <ScoreGauge score={data.score} />
            <div className="score-info">
              <div className="score-label-big" style={{ color: scoreColor }}>{scoreLabel}</div>
              <div className="score-domain">{data.domain}</div>
              <div className="score-file">📄 {data.originalName}</div>
              <div className="score-date">📅 {new Date(data.analysisDate).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="result-hero-right">
            <h3>Score Breakdown</h3>
            <div className="breakdown-bars">
              {breakdownData.map((item, i) => (
                <div key={item.name} className="breakdown-row">
                  <div className="breakdown-label">
                    <span>{item.name}</span>
                    <span>{item.value}/{item.max}</span>
                  </div>
                  <div className="breakdown-bar-bg">
                    <div
                      className="breakdown-bar-fill"
                      style={{
                        width: `${(item.value / item.max) * 100}%`,
                        backgroundColor: COLORS[i],
                        transition: `width 1s ease ${i * 0.15}s`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="result-grid">
          {/* Extracted Skills */}
          <div className="result-card">
            <div className="card-header">
              <h3>✅ Detected Skills <span className="count-badge">{data.extractedSkills.length}</span></h3>
            </div>
            <div className="skills-container">
              {data.extractedSkills.length > 0 ? data.extractedSkills.map(s => (
                <span key={s} className="skill-chip found">{s}</span>
              )) : <p className="empty-msg">No recognizable skills found</p>}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="result-card">
            <div className="card-header">
              <h3>❌ Missing Skills <span className="count-badge danger">{data.missingSkills.length}</span></h3>
            </div>
            <div className="skills-container">
              {data.missingSkills.length > 0 ? data.missingSkills.map(s => (
                <span key={s} className="skill-chip missing">{s}</span>
              )) : <p className="empty-msg">All key skills present!</p>}
            </div>
          </div>

          {/* Suggestions */}
          <div className="result-card full-width">
            <div className="card-header">
              <h3>💡 AI Improvement Suggestions</h3>
            </div>
            <div className="suggestions-list">
              {data.suggestions.map((s, i) => (
                <div key={i} className="suggestion-item">
                  <div className="suggestion-num">{i + 1}</div>
                  <div className="suggestion-text">{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Roles */}
          <div className="result-card">
            <div className="card-header">
              <h3>💼 Recommended Job Roles</h3>
            </div>
            <div className="roles-list">
              {data.jobRoles.map((role, i) => (
                <div key={i} className="role-item">
                  <span className="role-icon">🎯</span>
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="result-card">
            <div className="card-header"><h3>📊 Score Distribution</h3></div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breakdownData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {breakdownData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="result-actions">
          <Link to="/analyze" className="btn-primary">🔄 Analyze Another Resume</Link>
          <Link to="/dashboard" className="btn-ghost">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
