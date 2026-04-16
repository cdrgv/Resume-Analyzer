import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalAnalyses: 0, avgScore: 0, bestScore: 0 });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        userAPI.getStats(),
        resumeAPI.getHistory()
      ]);
      setStats(statsRes.data.data);
      setHistory(historyRes.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await resumeAPI.delete(id);
      setHistory(history.filter(r => r._id !== id));
      setStats(prev => ({ ...prev, totalAnalyses: prev.totalAnalyses - 1 }));
      toast.success('Analysis deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <span>ResumeAI</span>
        </div>
        <div className="nav-links">
          <Link to="/" className="btn-ghost small">🏠 Home</Link>
          <span className="nav-user">👋 {user?.name}</span>
          <Link to="/analyze" className="btn-primary small">+ Analyze Resume</Link>
          <Link to="/profile" className="btn-ghost small">Profile</Link>
          <button onClick={logout} className="btn-ghost small">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.totalAnalyses}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.avgScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{stats.bestScore}</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card cta-card" onClick={() => navigate('/analyze')}>
            <div className="stat-icon">🚀</div>
            <div className="stat-value">New</div>
            <div className="stat-label">Analyze Resume</div>
          </div>
        </div>

        {/* History */}
        <div className="section-header">
          <h2>Analysis History</h2>
          <Link to="/analyze" className="btn-primary small">Upload New</Link>
        </div>

        {loadingHistory ? (
          <div className="loading-box"><div className="spinner"></div></div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No analyses yet</h3>
            <p>Upload your first resume to get started</p>
            <Link to="/analyze" className="btn-primary">Analyze Your Resume</Link>
          </div>
        ) : (
          <div className="history-grid">
            {history.map(resume => (
              <div key={resume._id} className="history-card">
                <div className="history-card-header">
                  <div className="file-info">
                    <div className="file-icon">📄</div>
                    <div>
                      <div className="file-name">{resume.originalName}</div>
                      <div className="file-date">{new Date(resume.analysisDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="score-badge" style={{ color: getScoreColor(resume.score), borderColor: getScoreColor(resume.score) }}>
                    <span className="score-num">{resume.score}</span>
                    <span className="score-max">/100</span>
                  </div>
                </div>
                <div className="history-meta">
                  <span className="domain-tag">{resume.domain}</span>
                  <span className="score-label" style={{ color: getScoreColor(resume.score) }}>{getScoreLabel(resume.score)}</span>
                </div>
                <div className="skills-preview">
                  {resume.extractedSkills.slice(0, 4).map(s => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                  {resume.extractedSkills.length > 4 && (
                    <span className="skill-chip more">+{resume.extractedSkills.length - 4}</span>
                  )}
                </div>
                <div className="history-actions">
                  <button onClick={() => navigate(`/result/${resume._id}`)} className="btn-primary small">View Details</button>
                  <button onClick={() => handleDelete(resume._id)} className="btn-danger small">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
