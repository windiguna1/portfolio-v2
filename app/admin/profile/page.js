'use client';

import { useState, useEffect } from 'react';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '', email: '', github: '', linkedin: '', resumeLink: '', skills: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setProfile({
            ...data,
            skills: data.skills ? data.skills.join(', ') : ''
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Profile Settings</h1>
        <p>Manage your main biodata and contact details.</p>
      </header>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input type="text" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} required rows={5}></textarea>
        </div>
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input type="text" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input type="url" value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input type="url" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Resume Draft URL</label>
          <input type="url" value={profile.resumeLink} onChange={e => setProfile({...profile, resumeLink: e.target.value})} />
        </div>
        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
