import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Award, CheckCircle, Clock, Search, X } from 'lucide-react';
import { filterBySearch } from '../utils/listFilters';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';

const MyLearning = () => {
  const { courses, enrollments } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Build enrolled courses list
  const enrolledCourses = enrollments.map(enroll => {
    const course = courses.find(c => c.id === enroll.courseId);
    return {
      ...course,
      progress: enroll.progress,
      completedLessons: enroll.completedLessons,
      quizScore: enroll.quizScore
    };
  }).filter(c => c.id !== undefined);

  const filteredCourses = useMemo(() => {
    let list = enrolledCourses;
    if (activeTab === 'in-progress') list = list.filter((c) => c.progress < 100);
    if (activeTab === 'completed') list = list.filter((c) => c.progress === 100);
    return filterBySearch(list, searchQuery, ['title', 'instructor', 'category']);
  }, [enrolledCourses, activeTab, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>My Learning</h1>
        <p style={{ color: 'var(--dark-text-muted)' }}>Keep track of your course progress, complete curriculum lessons, and take quizzes.</p>
      </div>

      <div style={{ position: 'relative', maxWidth: '420px' }}>
        <Search size={18} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Search your enrolled courses..."
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

      {/* Tabs Menu */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        {['all', 'in-progress', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`dashboard-tab${activeTab === tab ? ' active' : ''}`}
          >
            {tab.replace('-', ' ')} ({
              tab === 'all' ? enrolledCourses.length :
              tab === 'in-progress' ? enrolledCourses.filter(c => c.progress < 100).length :
              enrolledCourses.filter(c => c.progress === 100).length
            })
          </button>
        ))}
      </div>

      {/* Course Progress List */}
      {filteredCourses.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              {/* Image Banner */}
              <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {course.progress === 100 && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    backgroundColor: 'var(--accent-emerald)',
                    color: 'var(--dark-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <CheckCircle size={12} />
                    <span>Completed</span>
                  </div>
                )}
                <span className="badge badge-primary" style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  {course.category}
                </span>
              </div>

              {/* Progress Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>By {course.instructor}</span>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--dark-text)',
                  lineHeight: '1.4',
                  minHeight: '2.8rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course.title}
                </h3>

                {/* Progress bar container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--dark-text-muted)' }}>Syllabus Completed</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{course.progress}%</span>
                  </div>
                  <ProgressBar progress={course.progress} height={6} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--dark-text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="var(--primary)" />
                    <span>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={14} color="var(--secondary)" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Link 
                    to={`/player/${course.id}`} 
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Play size={12} fill="white" />
                    <span>{course.progress === 100 ? 'Review Lectures' : 'Continue Learning'}</span>
                  </Link>

                  {/* Quiz Option if course has quizzes */}
                  {course.quiz && course.quiz.length > 0 && (
                    <Link
                      to={`/quiz/${course.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '8px', padding: '0.5rem' }}
                      title="Take Quiz"
                    >
                      <Award size={16} />
                    </Link>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
          <BookOpen size={48} color="var(--dark-text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>No Enrolled Courses Found</h3>
          <p style={{ color: 'var(--dark-text-muted)', marginBottom: '1.5rem' }}>
            {activeTab === 'all' 
              ? "You haven't enrolled in any bootcamps yet."
              : `You don't have any courses under the "${activeTab}" filter.`}
          </p>
          <Link to="/courses" className="btn btn-primary btn-sm">Explore Courses</Link>
        </div>
      )}

    </div>
  );
};

export default MyLearning;
