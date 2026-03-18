'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({ company: '', role: '', startDate: '', endDate: '', description: '', current: false });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExperiences = () => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/experience/${editingId}` : '/api/experience';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    setForm({ company: '', role: '', startDate: '', endDate: '', description: '', current: false });
    setEditingId(null);
    setLoading(false);
    fetchExperiences();
  };

  const handleEdit = (exp) => {
    setForm({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      description: exp.description,
      current: exp.current
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    fetchExperiences();
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Work Experience</h1>
        <p>Manage your career history.</p>
      </header>

      <div className="admin-split">
        <div className="admin-list">
          <h3>Existing Experience</h3>
          {experiences.length === 0 && <p>No experience added yet.</p>}
          {experiences.map(exp => (
            <div key={exp._id} className="admin-card">
              <div className="card-info">
                <h4>{exp.role} at {exp.company}</h4>
                <p>{new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(exp)} className="icon-btn edit"><Edit size={16} /></button>
                <button onClick={() => handleDelete(exp._id)} className="icon-btn delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-form-container">
          <h3>{editingId ? 'Edit' : 'Add New'} Experience</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Company</label>
              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} disabled={form.current} />
              </div>
            </div>
            <div className="form-checkbox">
              <input type="checkbox" id="current" checked={form.current} onChange={e => setForm({...form, current: e.target.checked})} />
              <label htmlFor="current">I currently work here</label>
            </div>
            <div className="form-group">
              <label>Description (Responsibilities/Achievements)</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={5}></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
              </button>
              {editingId && (
                <button type="button" className="secondary-btn" onClick={() => {setEditingId(null); setForm({ company: '', role: '', startDate: '', endDate: '', description: '', current: false })}}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
