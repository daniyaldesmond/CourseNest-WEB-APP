import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, ChevronRight, BookOpen, FileQuestion, ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, enrollments, completeLesson } = useApp();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCourse = courses.find(c => String(c.id) === String(courseId));

    // Simulate latency
    const timer = setTimeout(() => {
      setCourse(foundCourse);
      if (foundCourse && foundCourse.lessons.length > 0) {
        setActiveLesson(foundCourse.lessons[0]);
      }
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [courseId, courses]);

  // Restart video playback when active lesson changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      // Try to autoplay, ignoring errors due to browser autoplay policies
      videoRef.current.play().catch(() => { });
    }
  }, [activeLesson]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--dark-bg)', minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--dark-text)' }}>
        <h2>Course Not Found</h2>
        <Link to="/my-learning" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to My Learning</Link>
      </div>
    );
  }

  // Get active enrollment
  const enrollment = enrollments.find(e => e.courseId === course.id) || {
    progress: 0,
    completedLessons: []
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment.completedLessons.includes(lessonId);
  };

  const handleLessonToggle = (lessonId) => {
    completeLesson(course.id, lessonId);
  };

  const handleNextLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < course.lessons.length - 1) {
      setActiveLesson(course.lessons[currentIndex + 1]);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      height: 'calc(100vh - var(--header-height))',
      backgroundColor: 'var(--dark-bg)'
    }} className="player-layout">

      {/* LEFT: Video Player Panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid var(--dark-border)'
      }} className="player-main">
        {/* Video Area */}
        <div style={{
          position: 'relative',
          backgroundColor: '#000',
          aspectRatio: '16/9',
          maxHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video
            ref={videoRef}
            controls
            style={{ width: '100%', height: '100%', outline: 'none' }}
            poster={course.thumbnail}
          >
            {activeLesson && <source src={activeLesson.videoUrl} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info / Tab controls */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{course.category}</span>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-text)', fontWeight: '700' }}>
                {activeLesson ? activeLesson.title : 'No Lesson Selected'}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>
                Course: {course.title} • Instructed by {course.instructor}
              </span>
            </div>

            {activeLesson && (
              <button
                onClick={() => handleLessonToggle(activeLesson.id)}
                className={`btn btn-sm ${isLessonCompleted(activeLesson.id) ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderColor: isLessonCompleted(activeLesson.id) ? 'var(--accent-emerald)' : 'transparent'
                }}
              >
                <CheckCircle
                  size={16}
                  color={isLessonCompleted(activeLesson.id) ? 'var(--accent-emerald)' : 'white'}
                  fill={isLessonCompleted(activeLesson.id) ? 'var(--accent-emerald-light)' : 'none'}
                />
                <span>{isLessonCompleted(activeLesson.id) ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            )}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--dark-text)' }}>Lecture Details</h3>
            <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Welcome to this lecture. In this lesson, we will focus on key core concepts.
              Be sure to follow along, replicate the code examples, and test your understanding by answering the matching quiz questions at the completion of the course syllabus.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT: Scrollable Lessons Sidebar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--dark-surface)',
        overflow: 'hidden'
      }} className="player-sidebar">

        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark-text)' }}>Syllabus Checklist</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700' }}>{enrollment.progress}% done</span>
          </div>

          {/* Simple progress bar */}
          <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${enrollment.progress}%`, height: '100%', background: 'var(--gradient-primary)' }} />
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {course.lessons.map((lesson, idx) => {
            const isActive = activeLesson && activeLesson.id === lesson.id;
            const isCompleted = isLessonCompleted(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                  padding: '1.1rem 1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                  width: '100%',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                }}
                className="syllabus-item"
              >
                {/* Circle status indicator */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLessonToggle(lesson.id);
                  }}
                  style={{ cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                >
                  <CheckCircle
                    size={16}
                    color={isCompleted ? 'var(--accent-emerald)' : 'var(--dark-text-muted)'}
                    fill={isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'none'}
                  />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0 }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? 'white' : 'var(--dark-text-muted)',
                    lineHeight: '1.3'
                  }}>
                    {idx + 1}. {lesson.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                    <Play size={10} />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quiz Button CTA at bottom */}
        {course.quiz && course.quiz.length > 0 && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              to={`/quiz/${course.id}`}
              className={`btn ${enrollment.progress === 100 ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                width: '100%',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}
            >
              <FileQuestion size={16} />
              <span>Take Final Quiz</span>
            </Link>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 900px) {
          .player-layout {
            grid-template-columns: 1fr !important;
            height: auto !important;
            min-height: calc(100vh - var(--header-height));
          }
          .player-sidebar {
            height: 50vh !important;
            border-top: 1px solid var(--dark-border);
          }
          .player-main {
            height: auto !important;
          }
        }
        .syllabus-item:hover {
          background-color: rgba(255,255,255,0.02);
        }
      `}} />
    </div>
  );
};

export default CoursePlayer;
