import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ThumbsUp, PlusCircle, User, MessageCircle, Send, ShieldAlert, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import apiService from '../services/api';

const Community = () => {
  const { createPost, addComment, likePost } = useApp();
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [authorRoleFilter, setAuthorRoleFilter] = useState('all');

  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Post validation
  const validatePost = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = 'Please provide a topic title';
    } else if (values.title.length < 5) {
      errors.title = 'Title must be at least 5 characters long';
    }
    
    if (!values.content) {
      errors.content = 'Post description is required';
    } else if (values.content.length < 15) {
      errors.content = 'Describe your question in more detail (min 15 characters)';
    }
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm({
    title: '',
    content: ''
  }, validatePost);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { sort: sortBy === 'likes' ? 'likes' : 'newest' };
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      if (authorRoleFilter !== 'all') filters.authorRole = authorRoleFilter;
      const data = await apiService.getPosts(filters);
      setPosts(data);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, authorRoleFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleCreatePost = async (formValues) => {
    if (!isAuthenticated) return;

    const res = await createPost(formValues.title, formValues.content);
    if (res.success) {
      resetForm();
      setShowCreateForm(false);
      fetchPosts();
    }
  };

  const handleToggleComments = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };

  const handleAddCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const comment = newCommentText[postId] || '';
    if (!comment.trim()) {
      setCommentErrors({
        ...commentErrors,
        [postId]: 'Comment text cannot be empty'
      });
      return;
    }

    // Clear comment error
    setCommentErrors({
      ...commentErrors,
      [postId]: ''
    });

    addComment(postId, comment).then(() => fetchPosts());

    // Reset comment field for this post
    setNewCommentText({
      ...newCommentText,
      [postId]: ''
    });
  };

  const handleCommentTextChange = (postId, text) => {
    setNewCommentText({
      ...newCommentText,
      [postId]: text
    });
    if (commentErrors[postId]) {
      setCommentErrors({
        ...commentErrors,
        [postId]: ''
      });
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Header Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>Community Hub</h1>
            <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.95rem' }}>
              Ask questions, discuss topics, and troubleshoot code with instructors and peers.
            </p>
          </div>
          
          {isAuthenticated && (
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
              style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={18} />
              <span>{showCreateForm ? 'Cancel Post' : 'New Discussion'}</span>
            </button>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer' }}>
                <X size={16} color="var(--dark-text-muted)" />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ maxWidth: '180px' }}>
              <option value="newest">Newest first</option>
              <option value="likes">Most liked</option>
            </select>
            <select className="form-input" value={authorRoleFilter} onChange={(e) => setAuthorRoleFilter(e.target.value)} style={{ maxWidth: '180px' }}>
              <option value="all">All authors</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
            <span style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)', marginLeft: 'auto' }}>
              {loading ? 'Loading...' : `${posts.length} discussion${posts.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Create Post Dialog Form */}
        {showCreateForm && (
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.25)', animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', marginBottom: '1.5rem' }}>Ask the Community</h3>
            
            <form onSubmit={(e) => handleSubmit(e, handleCreatePost)}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Discussion Title</label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  placeholder="e.g. Can't resolve CSS Grid overlapping issues on iOS player view"
                  className="form-input"
                />
                {errors.title && (
                  <span className="form-error">
                    <ShieldAlert size={12} /> {errors.title}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="content">Discussion Details</label>
                <textarea 
                  id="content"
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  placeholder="Describe your question, share code snippets, or provide prototype URLs in detail so peers can help you..."
                  className="form-input"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
                {errors.content && (
                  <span className="form-error">
                    <ShieldAlert size={12} /> {errors.content}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)} 
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  Post Topic
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Discussions List Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--dark-text-muted)', padding: '2rem' }}>Loading discussions...</p>
          ) : posts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No discussions match your filters.</p>
            </div>
          ) : posts.map(post => {
            const isCommentsOpen = expandedComments[post.id];
            return (
              <div 
                key={post.id}
                className="glass-panel"
                style={{
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem'
                }}
              >
                {/* Author Info Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'var(--gradient-primary)',
                      color: 'var(--dark-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: '700'
                    }}>
                      {post.authorAvatar && (post.authorAvatar.startsWith('/') || post.authorAvatar.startsWith('http')) ? (
                        <img 
                          src={post.authorAvatar.startsWith('/') ? `http://localhost:5000${post.authorAvatar}` : post.authorAvatar} 
                          alt={post.author} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        post.authorAvatar
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--dark-text)', fontWeight: '700' }}>{post.author}</span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{post.authorRole}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Question Details */}
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', marginBottom: '0.5rem', lineHeight: '1.4' }}>{post.title}</h3>
                  <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {post.content}
                  </p>
                </div>

                {/* Footer Likes & Comments Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  paddingTop: '1rem',
                  fontSize: '0.85rem',
                  color: 'var(--dark-text-muted)'
                }}>
                  <button 
                    onClick={() => likePost(post.id).then(() => fetchPosts())}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--dark-text-muted)',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-text-muted)'}
                  >
                    <ThumbsUp size={16} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button 
                    onClick={() => handleToggleComments(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: isCommentsOpen ? 'var(--primary)' : 'var(--dark-text-muted)',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isCommentsOpen ? 'var(--primary)' : 'var(--dark-text-muted)'}
                  >
                    <MessageCircle size={16} />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                {/* Nested Comments Drawer */}
                {isCommentsOpen && (
                  <div style={{
                    marginTop: '0.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    padding: '1.5rem',
                    borderRadius: '12px'
                  }}>
                    {post.comments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {post.comments.map(comment => (
                          <div key={comment.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--dark-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              color: 'var(--dark-text)',
                              fontWeight: '700',
                              flexShrink: 0
                            }}>
                              {comment.avatar && (comment.avatar.startsWith('/') || comment.avatar.startsWith('http')) ? (
                                <img 
                                  src={comment.avatar.startsWith('/') ? `http://localhost:5000${comment.avatar}` : comment.avatar} 
                                  alt={comment.author} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                              ) : (
                                comment.avatar
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: '700', color: 'var(--dark-text)' }}>{comment.author}</span>
                                <span className="badge badge-rose" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>{comment.authorRole}</span>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>• {comment.timestamp}</span>
                              </div>
                              <p style={{ color: 'var(--dark-text-muted)', lineHeight: '1.5' }}>{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>
                        No comments yet. Start the conversation!
                      </p>
                    )}

                    {/* Add comment inline form */}
                    {isAuthenticated ? (
                      <form 
                        onSubmit={(e) => handleAddCommentSubmit(e, post.id)}
                        style={{ position: 'relative', marginTop: '0.5rem' }}
                      >
                        <input 
                          type="text"
                          placeholder="Write a response..."
                          value={newCommentText[post.id] || ''}
                          onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                          className="form-input"
                          style={{
                            paddingRight: '3.5rem',
                            borderRadius: '8px',
                            height: '42px',
                            fontSize: '0.875rem'
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            position: 'absolute',
                            right: '6px',
                            top: '6px',
                            bottom: '6px',
                            width: '32px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--dark-text)'
                          }}
                        >
                          <Send size={14} />
                        </button>
                        {commentErrors[post.id] && (
                          <span className="form-error" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                            {commentErrors[post.id]}
                          </span>
                        )}
                      </form>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)', fontStyle: 'italic' }}>
                        Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>log in</Link> to post comments.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Community;
