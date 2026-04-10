'use client';

import { useState, useEffect, useRef } from 'react';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '', email: '', github: '', linkedin: '', resumeLink: '', skills: '', photo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setProfile({
            ...data,
            skills: data.skills ? data.skills.join(', ') : ''
          });
          if (data.photo) setPhotoPreview(data.photo);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);

    // Upload to server
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/profile/upload-photo', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { photoUrl } = await res.json();
        setProfile(prev => ({ ...prev, photo: photoUrl }));
        setPhotoPreview(photoUrl);
        alert('Photo uploaded successfully!');
      } else {
        const err = await res.json();
        alert('Failed to upload photo: ' + (err.error || 'Unknown error'));
        setPhotoPreview(profile.photo || null);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading photo.');
      setPhotoPreview(profile.photo || null);
    } finally {
      setUploadingPhoto(false);
    }
  };

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

  if (loading) return <div className="p-8 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Photo Upload Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Photo</h3>
          <div className="flex items-center gap-8">
            {/* Preview */}
            <div className="relative flex-shrink-0">
              <div
                className="rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md"
                style={{ width: 120, height: 120 }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Upload a professional photo. Recommended: square format, min 400×400px.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setProfile(prev => ({ ...prev, photo: '' }));
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="ml-3 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Profile Info Card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title / Headline</label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={e => setProfile({...profile, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
            <textarea
              rows="4"
              required
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
            ></textarea>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-10 mb-6 pb-2 border-b border-gray-100">Contact &amp; Links</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
              <input
                type="url"
                value={profile.resumeLink}
                onChange={e => setProfile({...profile, resumeLink: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile URL</label>
              <input
                type="url"
                value={profile.github}
                onChange={e => setProfile({...profile, github: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={e => setProfile({...profile, linkedin: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
