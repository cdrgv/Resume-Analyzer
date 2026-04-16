import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error('Please select a PDF file'); return; }
    setLoading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 80));
    }, 400);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await resumeAPI.analyze(formData);
      clearInterval(interval);
      setProgress(100);
      toast.success('Analysis complete!');
      setTimeout(() => navigate(`/result/${res.data.data._id}`), 500);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand"><span className="brand-icon">⚡</span><span>ResumeAI</span></div>
        <div className="nav-links">
          <Link to="/dashboard" className="btn-ghost small">← Dashboard</Link>
          <button onClick={logout} className="btn-ghost small">Logout</button>
        </div>
      </nav>

      <div className="analyze-page">
        <div className="analyze-header">
          <h1>Analyze Your Resume</h1>
          <p>Upload your PDF resume and get an instant AI-powered analysis with score, skills, and improvement tips.</p>
        </div>

        <div className="upload-container">
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="file-selected">
                <div className="file-selected-icon">📄</div>
                <div className="file-selected-name">{file.name}</div>
                <div className="file-selected-size">{(file.size / 1024).toFixed(1)} KB</div>
                <button className="btn-ghost small" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  Remove ✕
                </button>
              </div>
            ) : (
              <div className="upload-prompt">
                <div className="upload-icon">☁️</div>
                <h3>Drag & Drop your resume here</h3>
                <p>or click to browse files</p>
                <span className="upload-hint">PDF only · Max 5MB</span>
              </div>
            )}
          </div>

          {loading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="progress-text">
                {progress < 30 ? 'Uploading resume...' :
                 progress < 60 ? 'Extracting text...' :
                 progress < 85 ? 'Running AI analysis...' : 'Finalizing results...'}
              </p>
            </div>
          )}

          <button
            className="btn-primary analyze-btn"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? (
              <><span className="btn-spinner"></span> Analyzing...</>
            ) : (
              <><span>⚡</span> Analyze Resume</>
            )}
          </button>
        </div>

        <div className="analyze-info-grid">
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h4>Resume Score</h4>
            <p>Get a score out of 100 based on skills, projects, experience, and keywords.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🔍</div>
            <h4>Skills Analysis</h4>
            <p>We extract your technical skills and identify what you're missing for your target role.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">💡</div>
            <h4>AI Suggestions</h4>
            <p>Receive actionable improvement tips to make your resume stand out to ATS systems.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">💼</div>
            <h4>Job Matching</h4>
            <p>Discover which job roles match your current profile and experience level.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
