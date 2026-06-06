import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Users } from 'lucide-react';
import Rating from './Rating';
import { useApp } from '../context/AppContext';

const CourseCard = ({ course }) => {
  const { enrollments } = useApp();
  const isEnrolled = enrollments.some(e => e.courseId === course.id);
  const studentEnrollment = enrollments.find(e => e.courseId === course.id);

  // Helper for level colors
  const getLevelBadge = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'badge-emerald';
      case 'intermediate': return 'badge-cyan';
      default: return 'badge-rose';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      position: 'relative'
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden' }}>
        <img 
          src={course.thumbnail} 
          alt={course.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <span className={`badge ${getLevelBadge(course.level)}`} style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1
        }}>
          {course.level}
        </span>
        <span className="badge badge-primary" style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          color: 'var(--dark-text)'
        }}>
          {course.category}
        </span>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)', fontWeight: '500' }}>
            By {course.instructor}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>
            <Users size={12} />
            <span>{(course.studentsEnrolled + (isEnrolled ? 1 : 0)).toLocaleString()}</span>
          </div>
        </div>

        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          lineHeight: '1.4',
          color: 'var(--dark-text)',
          minHeight: '2.8rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <Link to={`/courses/${course.id}`} style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-text)'}>
            {course.title}
          </Link>
        </h4>

        {/* Rating */}
        <Rating value={course.rating} count={course.reviewsCount} />

        {/* Info Rows */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          padding: '0.6rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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

        {/* Pricing & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.5rem'
        }}>
          <div>
            {isEnrolled ? (
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Award size={14} />
                <span>Enrolled ({studentEnrollment.progress}%)</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark-text)' }}>
                  ${course.price}
                </span>
                {course.originalPrice && (
                  <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--dark-text-muted)' }}>
                    ${course.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          <Link 
            to={isEnrolled ? `/player/${course.id}` : `/courses/${course.id}`}
            className={`btn btn-sm ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
            style={{ borderRadius: '8px' }}
          >
            {isEnrolled ? 'Resume' : 'Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
