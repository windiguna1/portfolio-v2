'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';

export default function TechCMSPage() {
  const [techs, setTechs] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '', order: 0 });
  const [logoFile, setLogoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTechs = () => {
    fetch('/api/techs')
      .then(res => res.json())
      .then(data => setTechs(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/techs/${editingId}` : '/api/techs';

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('order', form.order);
    if (logoFile) {
      formData.append('logoFile', logoFile);
    } else {
      formData.append('logo', form.logo);
    }

    await fetch(url, {
      method,
      body: formData,
    });

    resetForm();
    fetchTechs();
  };

  const handleEdit = (tech) => {
    setForm({ name: tech.name, logo: tech.logo || '', order: tech.order || 0 });
    setLogoFile(null);
    setEditingId(tech._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tech?')) return;
    await fetch(`/api/techs/${id}`, { method: 'DELETE' });
    fetchTechs();
  };

  const resetForm = () => {
    setForm({ name: '', logo: '', order: 0 });
    setLogoFile(null);
    setEditingId(null);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tech Stack</h1>
          <p className="text-gray-500 mt-1">Manage the technologies displayed on your homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* List */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">All Technologies</h3>
          {techs.length === 0 && <p className="text-gray-500 text-center py-8">No technologies added yet.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {techs.map(tech => (
              <div key={tech._id} className="relative group flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-center">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(tech)} className="p-1 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded transition-colors"><Edit size={12} /></button>
                  <button onClick={() => handleDelete(tech._id)} className="p-1 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded transition-colors"><Trash2 size={12} /></button>
                </div>
                {tech.logo ? (
                  <img src={tech.logo} alt={tech.name} className="w-10 h-10 object-contain mb-2" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <span className="text-gray-400 text-lg font-bold">{tech.name.charAt(0)}</span>
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 truncate w-full">{tech.name}</span>
                <span className="text-[10px] text-gray-400">#{tech.order || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">{editingId ? 'Edit' : 'Add'} Technology</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. React, Node.js, MongoDB"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo File (Overrides URL)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setLogoFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-300 rounded-lg bg-white mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">OR Logo URL</label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={e => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={logoFile !== null}
                />
                {!logoFile && form.logo && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <img src={form.logo} alt="Preview" className="w-8 h-8 object-contain" />
                    <span className="text-xs text-gray-500">Preview URL</span>
                  </div>
                )}
                {logoFile && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    File selected: {logoFile.name}. This will be used instead of URL.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add Technology')}
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
