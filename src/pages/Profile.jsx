import React, { useState } from 'react';
import { User, Mail, Link as LinkIcon, Edit3, ShieldCheck, Check, Info, Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';

const Profile = () => {
  const { user, updateProfile, uploadAvatar, removeAvatar } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File size exceeds 5MB limit.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setAvatarError('Only image files are allowed.');
      return;
    }

    setAvatarError('');
    setIsUploading(true);
    try {
      const res = await uploadAvatar(file);
      if (res.success) {
        setSuccessMsg('Profile picture updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setAvatarError(res.message);
      }
    } catch (err) {
      setAvatarError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    setAvatarError('');
    setIsUploading(true);
    try {
      const res = await removeAvatar();
      if (res.success) {
        setSuccessMsg('Profile picture removed.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setAvatarError(res.message);
      }
    } catch (err) {
      setAvatarError('Failed to remove image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Validation
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (values.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(values.website)) {
      errors.website = 'Enter a valid URL (including http:// or https://)';
    }

    return errors;
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    name: user.name || '',
    email: user.email || '',
    headline: user.headline || '',
    bio: user.bio || '',
    website: user.website || ''
  }, validate);

  const handleProfileSave = async (formValues) => {
    setIsLoading(true);
    setSuccessMsg('');
    setProfileError('');

    const res = await updateProfile(formValues);
    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setProfileError(res.message || 'Profile update failed.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Header Title */}
        <div>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>User Profile</h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.95rem' }}>
            Manage your personal portfolio, learning headline, and bio details.
          </p>
        </div>

        {successMsg && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--accent-emerald)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {profileError && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <span>{profileError}</span>
          </div>
        )}

        {/* Profile Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2.5rem'
        }} className="profile-layout">
          
          {/* Left Panel: Avatar & Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem 1.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              
              {/* Interactive Profile Image Container */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                <div style={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-glow)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }} className="avatar-container">
                  {/* Image or Initials */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--dark-text)',
                    fontWeight: '800',
                    fontSize: '2.25rem',
                  }}>
                    {user.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
                      <img 
                        src={user.avatar.startsWith('/') ? `http://localhost:5000${user.avatar}` : user.avatar} 
                        alt={user.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      user.avatar
                    )}
                  </div>

                  {/* Upload Trigger Overlay */}
                  <label htmlFor="avatar-file-input" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    color: 'var(--dark-text)',
                    fontSize: '0.75rem',
                    gap: '0.3rem'
                  }} className="avatar-overlay">
                    <Camera size={18} color="white" />
                    <span style={{ fontWeight: '600', color: 'var(--dark-text)' }}>Change</span>
                  </label>

                  {/* Uploading State Overlay */}
                  {isUploading && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(9, 10, 15, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTopColor: 'var(--primary)',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                    </div>
                  )}
                </div>

                {/* File Input */}
                <input 
                  type="file" 
                  id="avatar-file-input" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  style={{ display: 'none' }}
                  disabled={isUploading}
                />

                {/* Remove button if custom image uploaded */}
                {user.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) && !isUploading && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-rose)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.2s',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                  >
                    <Trash2 size={12} />
                    Remove photo
                  </button>
                )}

                {/* Avatar error feedback */}
                {avatarError && (
                  <div style={{
                    color: 'var(--accent-rose)',
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    maxWidth: '180px',
                    lineHeight: '1.3',
                    marginTop: '0.2rem'
                  }}>
                    {avatarError}
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', marginBottom: '0.2rem' }}>{user.name}</h3>
                <span className="badge badge-primary">{user.role}</span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', width: '100%' }}>
                Member since {user.joinedDate || 'June 2025'}
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.775rem', color: 'var(--dark-text-muted)', display: 'flex', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                Upload a custom profile photo (JPEG, PNG, WEBP, or GIF up to 5MB) or keep your initials fallback.
              </div>
            </div>
          </div>

          {/* Right Panel: Editing Fields */}
          <div className="glass-panel" style={{ padding: '2.5rem 2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)' }}>Account Settings</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '8px', display: 'flex', gap: '0.4rem' }}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={(e) => handleSubmit(e, handleProfileSave)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!isEditing || isLoading}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!isEditing || isLoading}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                {/* Headline */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="headline">Headline / Professional Title</label>
                  <input 
                    type="text"
                    id="headline"
                    name="headline"
                    value={values.headline}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Computer Science Student | UX Enthusiast"
                    disabled={!isEditing || isLoading}
                  />
                </div>

                {/* Bio */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="bio">Biography</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Write a short summary about your learning focus..."
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    disabled={!isEditing || isLoading}
                  />
                </div>

                {/* Website */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="website">Website Portfolio URL</label>
                  <input 
                    type="text"
                    id="website"
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. https://alexjohnson.dev"
                    disabled={!isEditing || isLoading}
                  />
                  {errors.website && <span className="form-error">{errors.website}</span>}
                </div>

                {/* Actions */}
                {isEditing && (
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsEditing(false);
                        setValues({
                          name: user.name,
                          email: user.email,
                          headline: user.headline,
                          bio: user.bio,
                          website: user.website
                        });
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '8px' }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: '8px', display: 'flex', gap: '0.4rem' }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopcolor: 'var(--dark-text)',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            </form>
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .avatar-container:hover .avatar-overlay {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
};

export default Profile;
