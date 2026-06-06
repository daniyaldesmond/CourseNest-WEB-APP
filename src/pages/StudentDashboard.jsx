import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, CheckCircle, MessageSquare, ArrowRight, Play, Award, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

const StudentDashboard = () => {
  const { courses, enrollments, posts } = useApp();
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Find enrolled courses with full details
  const enrolledCourses = enrollments.map(enroll => {
    const course = courses.find(c => c.id === enroll.courseId);
    return {
      ...course,
      progress: enroll.progress,
      completedLessons: enroll.completedLessons,
      quizScore: enroll.quizScore
    };
  }).filter(c => c.id !== undefined);

  // Stats Calculations
  const enrolledCount = enrolledCourses.length;
  const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
  const inProgressCount = enrolledCount - completedCount;

  // Total completed lessons count
  const totalCompletedLessons = enrolledCourses.reduce((sum, c) => sum + (c.completedLessons?.length || 0), 0);

  // User community posts/comments count simulation
  const userCommentsCount = posts.reduce((sum, p) => {
    const userComments = p.comments.filter(c => c.author === user.name);
    return sum + userComments.length;
  }, 0) + posts.filter(p => p.author === user.name).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>

      {/* Welcome Banner */}
      <div className="glass-panel dashboard-welcome-banner" style={{
        padding: '2.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>Welcome back, Student</span>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', fontWeight: '800' }}>
            Hello, <span className="text-gradient">{user.name}</span>!
          </h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.95rem' }}>
            You have completed <strong>{totalCompletedLessons}</strong> lessons so far. Ready to tackle today's module?
          </p>
        </div>
        <Link to="/courses" className="btn btn-primary" style={{ borderRadius: '10px' }}>
          Explore New Courses <ArrowRight size={18} />
        </Link>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Stat 1 */}
        <div className="glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '100ms'
        }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{enrolledCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Enrolled Courses</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '200ms'
        }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--accent-emerald)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Active Courses</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '300ms'
        }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.08)', color: 'var(--secondary)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{completedCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Completed Paths</div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '400ms'
        }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.08)', color: 'var(--accent-cyan)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{userCommentsCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Forum Interactions</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left In-progress list, Right Recent Community Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 0.7fr',
        gap: '2.5rem'
      }} className="dashboard-grid">

        {/* Left Column: Progress Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '500ms'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--dark-text)' }}>Continue Learning</h2>
            <Link to="/my-learning" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {enrolledCourses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {enrolledCourses.slice(0, 3).map((course, index) => (
                <div
                  key={course.id}
                  className="glass-panel glass-panel-hover dashboard-course-row"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${550 + index * 100}ms`
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: 'var(--dark-text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {course.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '350px' }}>
                      <ProgressBar progress={course.progress} height={6} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', minWidth: '35px', textAlign: 'right' }}>
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/player/${course.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Resume</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ color: 'var(--dark-text-muted)', marginBottom: '1.5rem' }}>You are not enrolled in any courses yet.</p>
              <Link to="/courses" className="btn btn-primary btn-sm">Explore Courses</Link>
            </div>
          )}
        </div>

        {/* Right Column: Community / Updates */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '600ms'
        }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--dark-text)' }}>Community Activity</h2>

          <div className="glass-panel" style={{
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {posts.slice(0, 3).map((post, index) => (
              <div
                key={post.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${650 + index * 100}ms`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--dark-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
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
                  <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>
                    <strong>{post.author}</strong> posted
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--dark-text-muted)', opacity: 0.7 }}>• {post.timestamp}</span>
                </div>
                <Link to="/community" className="dashboard-link" style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--dark-text)',
                  transition: 'color 0.2s',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.title}
                </Link>
                <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)', display: 'flex', gap: '0.8rem' }}>
                  <span>👍 {post.likes} likes</span>
                  <span>💬 {post.commentsCount} comments</span>
                </span>
              </div>
            ))}

            <Link to="/community" className="btn btn-secondary btn-sm" style={{ width: '100%', borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center' }}>
              Open Forum Feed
            </Link>
          </div>
        </div>

      </div>

      {styleMarkup}
    </div>
  );
};

const styleMarkup = (
  <style dangerouslySetInnerHTML={{
    __html: `
    @media (max-width: 900px) {
      .dashboard-grid {
        grid-template-columns: 1fr !important;
      }
      .dashboard-course-row {
        grid-template-columns: 1fr !important;
        text-align: center;
        justify-items: center;
        gap: 1rem !important;
      }
      .dashboard-course-row div {
        align-items: center !important;
        text-align: center;
      }
    }
  `}} />
);

export default StudentDashboard;
