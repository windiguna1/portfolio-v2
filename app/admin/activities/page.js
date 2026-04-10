'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Star, Calendar } from 'lucide-react';

const ACTIVITY_TYPES = ['EVENT', 'WORKSHOP', 'ACHIEVEMENT', 'CERTIFICATION', 'OTHER'];

export default function ActivitiesCMSPage() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
    type: 'EVENT',
    description: '',
    content: '',
    featured: false,
    order: 0,
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchActivities = () => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('date', form.date);
    formData.append('type', form.type);
    formData.append('description', form.description);
    formData.append('content', form.content);
    formData.append('featured', form.featured);
    formData.append('order', form.order);

    if (image) {
      formData.append('image', image);
    } else if (existingImage) {
      formData.append('existingImage', existingImage);
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/activities/${editingId}` : '/api/activities';

    await fetch(url, { method, body: formData });

    resetForm();
    fetchActivities();
  };

  const handleEdit = (act) => {
    setForm({
      title: act.title,
      date: act.date ? new Date(act.date).toISOString().split('T')[0] : '',
      type: act.type || 'EVENT',
      description: act.description,
      content: act.content || '',
      featured: act.featured || false,
      order: act.order || 0,
    });
    setExistingImage(act.image || '');
    setImage(null);
    setEditingId(act._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    fetchActivities();
  };

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      type: 'EVENT',
      description: '',
      content: '',
      featured: false,
      order: 0,
    });
    setImage(null);
    setExistingImage('');
    setEditingId(null);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-500 mt-1">Manage your events, workshops, achievements, and certifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Existing Activities</h3>
          {activities.length === 0 && <p className="text-gray-500 text-center py-8">No activities added yet.</p>}
          <div className="flex flex-col gap-4">
            {activities.map(act => (
              <div key={act._id} className="flex flex-col p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 pr-2">{act.title}</h4>
                    {act.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleEdit(act)} className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded lg transition-colors"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(act._id)} className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{act.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={11} />
                    {act.date ? new Date(act.date).toLocaleDateString() : ''}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {act.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">{editingId ? 'Edit' : 'Add New'} Activity</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors bg-white">
                    {ACTIVITY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-y" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content (Markdown Supported)</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-y font-mono text-sm" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-amber-800 flex items-center gap-1.5">
                  <Star size={14} /> Mark as Featured
                </label>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-bold text-gray-900 mb-2">Cover Image</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer mb-3" />

                {existingImage && !image && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Image</p>
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img src={existingImage} alt="Current" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                  {loading ? 'Uploading & Saving...' : (editingId ? 'Update Activity' : 'Publish Activity')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
