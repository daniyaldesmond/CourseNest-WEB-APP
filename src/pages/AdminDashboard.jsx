import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Layers, Award, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminDashboard = () => {
  const { courses, users, enrollments } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const totalEnrollments = enrollments.length;

  // Render pure CSS responsive graphs
  const enrolmentData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 72 },
    { label: 'Mar', value: 110 },
    { label: 'Apr', value: 95 },
    { label: 'May', value: 154 },
    { label: 'Jun', value: 210 }
  ];

  const maxVal = Math.max(...enrolmentData.map(d => d.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>Admin Control Center</h1>
        <p style={{ color: 'var(--dark-text-muted)' }}>Manage course curriculums, user records, interactive quizzes, and monitor enrollments.</p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* KPI 1 */}
        <div className="glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0ms'
        }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{totalUsers}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Total Users</div>
          </div>
        </div>

        {/* KPI 2 */}
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
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.08)', color: 'var(--secondary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{totalCourses}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Total Courses</div>
          </div>
        </div>

        {/* KPI 3 */}
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
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.08)', color: 'var(--accent-cyan)' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{totalLessons}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Total Lessons</div>
          </div>
        </div>

        {/* KPI 4 */}
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
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--accent-emerald)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{totalEnrollments}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Total Enrollments</div>
          </div>
        </div>
      </div>

      {/* Grid: Charts + Activities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.5rem'
      }} className="admin-grid">

        {/* Graph Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '400ms'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <span>Enrollment Velocity (Monthly)</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Updated 1 hour ago</span>
          </div>

          {/* Bar Graph container */}
          <div style={{
            height: '220px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            padding: '1rem 0',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {enrolmentData.map((d, index) => {
              const heightPct = Math.round((d.value / maxVal) * 100);
              return (
                <div key={index} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  {/* Glowing Bar */}
                  <div style={{
                    width: '100%',
                    maxWidth: '45px',
                    height: isLoaded ? `${heightPct}%` : '0%',
                    background: 'var(--gradient-primary)',
                    borderRadius: '6px 6px 0 0',
                    position: 'relative',
                    boxShadow: '0 0 15px -3px rgba(99, 102, 241, 0.35)',
                    transition: 'height 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${index * 120}ms`
                  }} className="chart-bar">
                    {/* Tooltip on hover */}
                    <div style={{
                      position: 'absolute',
                      top: '-32px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--dark-surface)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: 'var(--dark-text)',
                      border: '1px solid var(--dark-border)',
                      fontWeight: '700',
                      whiteSpace: 'nowrap'
                    }} className="chart-tooltip">
                      {d.value} items
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)', fontWeight: '600' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '500ms'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={18} color="var(--accent-cyan)" />
            <span>Audit Action Log</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Audit row 1 */}
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--dark-text)', lineHeight: '1.4' }}>
                  <strong>Alex Johnson</strong> enrolled in <em>Full-Stack Web Development Bootcamp</em>.
                </p>
                <span style={{ color: 'var(--dark-text-muted)', fontSize: '0.7rem' }}>2 minutes ago</span>
              </div>
            </div>

            {/* Audit row 2 */}
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--dark-text)', lineHeight: '1.4' }}>
                  Instructor <strong>Dr. Angela Chen</strong> uploaded a new lesson file to <em>Python Data Science</em>.
                </p>
                <span style={{ color: 'var(--dark-text-muted)', fontSize: '0.7rem' }}>45 minutes ago</span>
              </div>
            </div>

            {/* Audit row 3 */}
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--dark-text)', lineHeight: '1.4' }}>
                  Student <strong>Marcus Miller</strong> achieved a score of <strong>100%</strong> on <em>Figma UI/UX quiz</em>.
                </p>
                <span style={{ color: 'var(--dark-text-muted)', fontSize: '0.7rem' }}>2 hours ago</span>
              </div>
            </div>

            {/* Audit row 4 */}
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-rose)', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <p style={{ color: 'var(--dark-text)', lineHeight: '1.4' }}>
                  User account <strong>Marcus Miller</strong> status was suspended due to billing check.
                </p>
                <span style={{ color: 'var(--dark-text-muted)', fontSize: '0.7rem' }}>1 day ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Tooltip Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .chart-tooltip {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .chart-bar:hover .chart-tooltip {
          opacity: 1;
        }
      `}} />
    </div>
  );
};

export default AdminDashboard;
