import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Trash2, ShieldAlert, ArrowRight, Play, Check, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useForm from '../hooks/useForm';
import { filterBySearch } from '../utils/listFilters';

const ManageLessons = () => {
  const { courses, updateCourse } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [lessonSearch, setLessonSearch] = useState('');

  const filteredCourseOptions = useMemo(
    () => filterBySearch(courses, courseSearch, ['title', 'instructor']),
    [courses, courseSearch]
  );

  useEffect(() => {
    if (filteredCourseOptions.length > 0 && !filteredCourseOptions.some((c) => String(c.id) === String(selectedCourseId))) {
      setSelectedCourseId(filteredCourseOptions[0].id);
    }
  }, [filteredCourseOptions, selectedCourseId]);

  const activeCourse = courses.find(c => String(c.id) === String(selectedCourseId));

  const filteredLessons = useMemo(() => {
    if (!activeCourse?.lessons) return [];
    return filterBySearch(activeCourse.lessons, lessonSearch, ['title']);
  }, [activeCourse, lessonSearch]);

  // Form Validation
  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = 'Lesson title is required';
    } else if (values.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!values.duration) {
      errors.duration = 'Duration is required';
    } else if (!/^\d+:\d+$/.test(values.duration)) {
      errors.duration = 'Duration must be in MM:SS format (e.g. 15:40)';
    }

    if (!values.videoUrl) {
      errors.videoUrl = 'Video URL is required';
    }

    return errors;
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm({
    title: '',
    duration: '',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4'
  }, validate);

  const handleAddLessonSubmit = (formValues) => {
    if (!activeCourse) return;

    // Generate new lesson ID
    const newLessonId = activeCourse.lessons.length > 0
      ? Math.max(...activeCourse.lessons.map(l => l.id)) + 1
      : 101;

    const newLesson = {
      id: newLessonId,
      title: formValues.title,
      duration: formValues.duration,
      videoUrl: formValues.videoUrl
    };

    const updatedLessons = [...activeCourse.lessons, newLesson];
    updateCourse(activeCourse.id, { lessons: updatedLessons });

    setSuccessMsg('Lesson added successfully!');
    resetForm();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteLesson = (lessonId) => {
    if (!activeCourse) return;

    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = activeCourse.lessons.filter(l => l.id !== lessonId);
      updateCourse(activeCourse.id, { lessons: updatedLessons });

      setSuccessMsg('Lesson deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>Manage Lessons</h1>
        <p style={{ color: 'var(--dark-text-muted)' }}>Configure course syllabi, upload lecture video URLs, and restructure student pathways.</p>
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

      <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark-text)' }}>Select Course</span>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Filter courses..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="form-input"
          style={{ maxWidth: '100%', appearance: 'none', cursor: 'pointer' }}
        >
          {filteredCourseOptions.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        {filteredCourseOptions.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>No courses match your search.</p>
        )}
      </div>

      {activeCourse ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem'
        }} className="admin-grid">

          {/* Left Column: Lesson Listing */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)' }}>Current Lectures ({filteredLessons.length}{lessonSearch ? ` of ${activeCourse.lessons.length}` : ''})</h3>

            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search lessons..."
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
              {lessonSearch && (
                <button type="button" onClick={() => setLessonSearch('')} style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer' }}>
                  <X size={16} color="var(--dark-text-muted)" />
                </button>
              )}
            </div>

            {filteredLessons.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredLessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--dark-text)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>Duration: {lesson.duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      style={{
                        padding: '0.4rem',
                        borderRadius: '50%',
                        color: 'var(--accent-rose)',
                        backgroundColor: 'rgba(244, 63, 94, 0.05)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.05)'}
                      title="Delete Lesson"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--dark-text-muted)' }}>
                {lessonSearch ? 'No lessons match your search.' : 'No lectures uploaded for this course yet.'}
              </p>
            )}
          </div>

          {/* Right Column: Add Lesson Form */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', marginBottom: '1.5rem' }}>Upload Lecture</h3>

            <form onSubmit={(e) => handleSubmit(e, handleAddLessonSubmit)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Lecture Title</label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="e.g. Direct DOM Manipulation"
                    className="form-input"
                  />
                  {errors.title && <span className="form-error"><ShieldAlert size={12} /> {errors.title}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Duration (MM:SS)</label>
                  <input
                    type="text"
                    name="duration"
                    value={values.duration}
                    onChange={handleChange}
                    placeholder="e.g. 14:20"
                    className="form-input"
                  />
                  {errors.duration && <span className="form-error"><ShieldAlert size={12} /> {errors.duration}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Video URL (MP4 file)</label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={values.videoUrl}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.videoUrl && <span className="form-error"><ShieldAlert size={12} /> {errors.videoUrl}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: '8px', display: 'flex', justifyAlignment: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <PlusCircle size={16} />
                  <span>Upload Lesson</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        <p style={{ color: 'var(--dark-text-muted)' }}>Create a course first to begin restructuring syllabus lists.</p>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
};

export default ManageLessons;
