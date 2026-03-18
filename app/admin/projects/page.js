'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Image as ImageIcon } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', content: '', demoUrl: '', repoUrl: '', order: 0 });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('content', form.content);
    formData.append('demoUrl', form.demoUrl);
    formData.append('repoUrl', form.repoUrl);
    formData.append('order', form.order);
    
    // Append new image files
    Array.from(images).forEach(file => {
      formData.append('images', file);
    });

    // Append existing images if editing
    existingImages.forEach(img => {
      formData.append('existingImages', img);
    });

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    
    await fetch(url, {
      method,
      body: formData // No Content-Type header so browser sets multipart boundary
    });
    
    resetForm();
    fetchProjects();
  };

  const handleEdit = (proj) => {
    setForm({
      title: proj.title,
      description: proj.description,
      content: proj.content || '',
      demoUrl: proj.demoUrl || '',
      repoUrl: proj.repoUrl || '',
      order: proj.order || 0
    });
    setExistingImages(proj.images || []);
    setImages([]);
    setEditingId(proj._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const resetForm = () => {
    setForm({ title: '', description: '', content: '', demoUrl: '', repoUrl: '', order: 0 });
    setImages([]);
    setExistingImages([]);
    setEditingId(null);
    setLoading(false);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Projects Portfolio</h1>
        <p>Manage your creative work and case studies.</p>
      </header>

      <div className="admin-split">
        <div className="admin-list">
          <h3>Existing Projects</h3>
          {projects.length === 0 && <p>No projects added yet.</p>}
          {projects.map(proj => (
            <div key={proj._id} className="admin-card project-card">
              <div className="card-info">
                <h4>{proj.title}</h4>
                <p>{proj.description.substring(0, 60)}...</p>
                <div className="card-meta">
                  <span><ImageIcon size={14} /> {proj.images?.length || 0} Images</span>
                </div>
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(proj)} className="icon-btn edit"><Edit size={16} /></button>
                <button onClick={() => handleDelete(proj._id)} className="icon-btn delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-form-container">
          <h3>{editingId ? 'Edit' : 'Add New'} Project</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Project Title</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Short Description (1-2 sentences)</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Full Content/Case Study (Markdown/Text)</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6}></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Live Demo URL</label>
                <input type="url" value={form.demoUrl} onChange={e => setForm({...form, demoUrl: e.target.value})} />
              </div>
              <div className="form-group">
                <label>GitHub Repo URL</label>
                <input type="url" value={form.repoUrl} onChange={e => setForm({...form, repoUrl: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group upload-group">
              <label>Upload Images (Multiple allowed)</label>
              <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} />
              
              {existingImages.length > 0 && (
                <div className="existing-images-preview">
                  <p>Current Images (Click to remove):</p>
                  <div className="image-thumbs">
                    {existingImages.map((src, i) => (
                      <div key={i} className="img-thumb-wrap" onClick={() => removeExistingImage(i)}>
                        <img src={src} alt="Project existing" />
                        <div className="remove-overlay">Remove</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Uploading & Saving...' : (editingId ? 'Update Project' : 'Publish Project')}
              </button>
              {editingId && (
                <button type="button" className="secondary-btn" onClick={resetForm}>
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
