import React, { useState, useMemo } from 'react';
import { PlusCircle, Edit3, Trash2, ShieldAlert, Award, FileText, Check, Search, X } from 'lucide-react';
import { filterBySearch } from '../utils/listFilters';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import useForm from '../hooks/useForm';

const ManageCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredCourses = useMemo(() => {
    let list = courses;
    list = filterBySearch(list, searchQuery, ['title', 'instructor', 'shortDescription']);
    if (categoryFilter !== 'all') list = list.filter((c) => c.category === categoryFilter);
    if (levelFilter !== 'all') list = list.filter((c) => c.level === levelFilter);
    return list;
  }, [courses, searchQuery, categoryFilter, levelFilter]);

  // Validation Logic
  const validate = (values) => {
    const errors = {};
    if (!values.title) errors.title = 'Title is required';
    if (!values.shortDescription) errors.shortDescription = 'Description snippet is required';
    if (!values.description) errors.description = 'Full description is required';
    if (!values.category) errors.category = 'Category is required';
    if (!values.instructor) errors.instructor = 'Instructor name is required';

    if (values.price === '' || values.price === undefined) {
      errors.price = 'Price is required';
    } else if (parseFloat(values.price) < 0) {
      errors.price = 'Price cannot be negative';
    }

    if (!values.duration) errors.duration = 'Duration description is required (e.g. 12 hours)';
    if (!values.thumbnail) errors.thumbnail = 'Thumbnail image URL is required';
    return errors;
  };

  // 1. Add Form Hook
  const addForm = useForm({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Development',
    instructor: '',
    instructorBio: '',
    price: '',
    originalPrice: '',
    duration: '',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'
  }, validate);

  // 2. Edit Form Hook
  const editForm = useForm({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    instructor: '',
    instructorBio: '',
    price: '',
    originalPrice: '',
    duration: '',
    level: '',
    thumbnail: ''
  }, validate);

  const handleAddSubmit = async (values) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await addCourse({
        ...values,
        price: parseFloat(values.price),
        originalPrice: values.originalPrice && !isNaN(parseFloat(values.originalPrice)) ? parseFloat(values.originalPrice) : null
      });

      if (res.success) {
        setSuccessMsg('Course added successfully!');
        setIsAddModalOpen(false);
        addForm.resetForm();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message || 'Failed to create course');
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.message || 'An error occurred during submission';
      setErrorMsg(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (values) => {
    if (!currentCourse) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await updateCourse(currentCourse.id, {
        ...values,
        price: parseFloat(values.price),
        originalPrice: values.originalPrice && !isNaN(parseFloat(values.originalPrice)) ? parseFloat(values.originalPrice) : null
      });

      if (res.success) {
        setSuccessMsg('Course updated successfully!');
        setIsEditModalOpen(false);
        setCurrentCourse(null);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message || 'Failed to update course');
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.message || 'An error occurred during submission';
      setErrorMsg(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (course) => {
    setErrorMsg('');
    setCurrentCourse(course);
    editForm.setValues({
      title: course.title || '',
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      category: course.category || 'Development',
      instructor: course.instructor || '',
      instructorBio: course.instructorBio || '',
      price: String(course.price) || '0',
      originalPrice: course.originalPrice ? String(course.originalPrice) : '',
      duration: course.duration || '',
      level: course.level || 'Beginner',
      thumbnail: course.thumbnail || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course? This will remove all student enrollments.')) {
      deleteCourse(id);
      setSuccessMsg('Course deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>

      {/* Header toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>Manage Courses</h1>
          <p style={{ color: 'var(--dark-text-muted)' }}>Create new bootcamps, modify details, or remove courses from catalog listing pages.</p>
        </div>

        <button
          onClick={() => { setErrorMsg(''); setIsAddModalOpen(true); }}
          className="btn btn-primary"
          style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <PlusCircle size={18} />
          <span>Add Course</span>
        </button>
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
          gap: '0.6rem'
        }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search title or instructor..."
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <select className="form-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: '180px' }}>
            <option value="all">All categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select className="form-input" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} style={{ maxWidth: '180px' }}>
            <option value="all">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <span style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)', alignSelf: 'center', marginLeft: 'auto' }}>
            {filteredCourses.length} of {courses.length} courses
          </span>
        </div>
      </div>

      {/* Courses database grid table */}
      <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--dark-border)' }}>
        {filteredCourses.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>No courses match your filters.</p>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dark-border)', color: 'var(--dark-text)' }}>
              <th style={{ padding: '1.2rem 1.5rem' }}>Course Details</th>
              <th style={{ padding: '1.2rem 1.5rem' }}>Category</th>
              <th style={{ padding: '1.2rem 1.5rem' }}>Instructor</th>
              <th style={{ padding: '1.2rem 1.5rem' }}>Price</th>
              <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--dark-text-muted)' }}>
                {/* 1. Thumbnail + title */}
                <td style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '320px' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: 'var(--dark-text)', fontWeight: '700', fontSize: '0.9rem' }}>{course.title}</span>
                    <span style={{ fontSize: '0.75rem' }}>Level: {course.level} • {course.lessons.length} lessons</span>
                  </div>
                </td>
                {/* 2. Category */}
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <span className="badge badge-primary">{course.category}</span>
                </td>
                {/* 3. Instructor */}
                <td style={{ padding: '1.2rem 1.5rem', color: 'var(--dark-text)', fontWeight: '500' }}>
                  {course.instructor}
                </td>
                {/* 4. Price */}
                <td style={{ padding: '1.2rem 1.5rem', color: 'var(--dark-text)', fontWeight: '700' }}>
                  ${course.price.toFixed(2)}
                </td>
                {/* 5. Action Buttons */}
                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}
                      title="Edit Course"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}
                      title="Delete Course"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* MODAL 1: ADD COURSE */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Course">
        {errorMsg && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        <form onSubmit={(e) => addForm.handleSubmit(e, handleAddSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Course Title</label>
              <input type="text" name="title" value={addForm.values.title} onChange={addForm.handleChange} className="form-input" placeholder="e.g. Intro to Modern React" disabled={isLoading} />
              {addForm.errors.title && <span className="form-error">{addForm.errors.title}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select name="category" value={addForm.values.category} onChange={addForm.handleChange} className="form-input" style={{ appearance: 'none', backgroundColor: 'var(--dark-surface)' }} disabled={isLoading}>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Skill Level</label>
                <select name="level" value={addForm.values.level} onChange={addForm.handleChange} className="form-input" style={{ appearance: 'none', backgroundColor: 'var(--dark-surface)' }} disabled={isLoading}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" name="price" value={addForm.values.price} onChange={addForm.handleChange} className="form-input" placeholder="e.g. 49.99" disabled={isLoading} />
                {addForm.errors.price && <span className="form-error">{addForm.errors.price}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Duration (hours)</label>
                <input type="text" name="duration" value={addForm.values.duration} onChange={addForm.handleChange} className="form-input" placeholder="e.g. 36 hours" disabled={isLoading} />
                {addForm.errors.duration && <span className="form-error">{addForm.errors.duration}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Instructor Name</label>
              <input type="text" name="instructor" value={addForm.values.instructor} onChange={addForm.handleChange} className="form-input" placeholder="e.g. Sarah Croft" disabled={isLoading} />
              {addForm.errors.instructor && <span className="form-error">{addForm.errors.instructor}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Thumbnail URL</label>
              <input type="text" name="thumbnail" value={addForm.values.thumbnail} onChange={addForm.handleChange} className="form-input" disabled={isLoading} />
              {addForm.errors.thumbnail && <span className="form-error">{addForm.errors.thumbnail}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Short Description</label>
              <input type="text" name="shortDescription" value={addForm.values.shortDescription} onChange={addForm.handleChange} className="form-input" placeholder="Provide a brief summary line..." disabled={isLoading} />
              {addForm.errors.shortDescription && <span className="form-error">{addForm.errors.shortDescription}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Description</label>
              <textarea name="description" value={addForm.values.description} onChange={addForm.handleChange} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} disabled={isLoading} />
              {addForm.errors.description && <span className="form-error">{addForm.errors.description}</span>}
            </div>

          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '8px' }} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT COURSE */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Course Details">
        {errorMsg && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        <form onSubmit={(e) => editForm.handleSubmit(e, handleEditSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Course Title</label>
              <input type="text" name="title" value={editForm.values.title} onChange={editForm.handleChange} className="form-input" disabled={isLoading} />
              {editForm.errors.title && <span className="form-error">{editForm.errors.title}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select name="category" value={editForm.values.category} onChange={editForm.handleChange} className="form-input" style={{ appearance: 'none', backgroundColor: 'var(--dark-surface)' }} disabled={isLoading}>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Skill Level</label>
                <select name="level" value={editForm.values.level} onChange={editForm.handleChange} className="form-input" style={{ appearance: 'none', backgroundColor: 'var(--dark-surface)' }} disabled={isLoading}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" name="price" value={editForm.values.price} onChange={editForm.handleChange} className="form-input" disabled={isLoading} />
                {editForm.errors.price && <span className="form-error">{editForm.errors.price}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Duration</label>
                <input type="text" name="duration" value={editForm.values.duration} onChange={editForm.handleChange} className="form-input" disabled={isLoading} />
                {editForm.errors.duration && <span className="form-error">{editForm.errors.duration}</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Instructor Name</label>
              <input type="text" name="instructor" value={editForm.values.instructor} onChange={editForm.handleChange} className="form-input" disabled={isLoading} />
              {editForm.errors.instructor && <span className="form-error">{editForm.errors.instructor}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Thumbnail URL</label>
              <input type="text" name="thumbnail" value={editForm.values.thumbnail} onChange={editForm.handleChange} className="form-input" disabled={isLoading} />
              {editForm.errors.thumbnail && <span className="form-error">{editForm.errors.thumbnail}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Short Description</label>
              <input type="text" name="shortDescription" value={editForm.values.shortDescription} onChange={editForm.handleChange} className="form-input" disabled={isLoading} />
              {editForm.errors.shortDescription && <span className="form-error">{editForm.errors.shortDescription}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Description</label>
              <textarea name="description" value={editForm.values.description} onChange={editForm.handleChange} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} disabled={isLoading} />
              {editForm.errors.description && <span className="form-error">{editForm.errors.description}</span>}
            </div>

          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '8px' }} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageCourses;
