import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile({ name });
      updateUser({ ...user, name: res.data.user.name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNew) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand"><span className="brand-icon">⚡</span><span>ResumeAI</span></div>
        <div className="nav-links">
          <Link to="/" className="btn-ghost small">🏠 Home</Link>
          <Link to="/dashboard" className="btn-ghost small">← Dashboard</Link>
          <button onClick={logout} className="btn-ghost small">Logout</button>
        </div>
      </nav>

      <div className="profile-page">
        <h1>My Profile</h1>

        <div className="profile-grid">
          {/* Profile Info */}
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-meta">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <p className="profile-joined">Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Update Name */}
          <div className="profile-form-card">
            <h3>Update Profile</h3>
            <form onSubmit={handleProfileUpdate} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (cannot be changed)</label>
                <input type="email" value={user?.email} disabled />
              </div>
              <button type="submit" className="btn-primary" disabled={savingProfile}>
                {savingProfile ? <span className="btn-spinner"></span> : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="profile-form-card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange} className="auth-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmNew}
                  onChange={e => setPasswords({ ...passwords, confirmNew: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={savingPassword}>
                {savingPassword ? <span className="btn-spinner"></span> : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
