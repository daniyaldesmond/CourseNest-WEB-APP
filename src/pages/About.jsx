import React from 'react';
import { Target, Compass, Award, Users, BookOpen, ShieldCheck, Zap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Curated Syllabi',
      description: 'Step-by-step sequential modules instructed by professionals to take you from a absolute beginner to job-ready expert.',
      color: 'var(--primary)'
    },
    {
      icon: Award,
      title: 'Interactive Quizzes',
      description: 'Verify your knowledge with instant graded assessments built into the end of course player workflows.',
      color: 'var(--secondary)'
    },
    {
      icon: Users,
      title: 'Peer Communities',
      description: 'Collaborate with thousands of other developers and designers. Ask questions, post solutions, and share feedback.',
      color: 'var(--accent-cyan)'
    },
    {
      icon: ShieldCheck,
      title: 'Management Portals',
      description: 'Administrative controls to manage active users, update curriculum listings, configure quizzes, and switch between student and admin perspectives.',
      color: 'var(--accent-emerald)'
    }
  ];

  return (
    <div style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      {/* 1. Header Section */}
      <section className="container" style={{ textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(40px)',
          zIndex: -1
        }} />
        <span className="badge badge-primary" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
          ✨ About CourseNest
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--dark-text)' }}>
          Redefining Online <span className="text-gradient">Skill Mastery</span>
        </h1>
        <p style={{ color: 'var(--dark-text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8' }}>
          CourseNest is a comprehensive learning platform designed to bridge the gap between academic theory and practical software engineering, UI/UX design, and digital marketing. We support immersive learning portals, graded milestones, and peer-to-peer discussions.
        </p>
      </section>

      {/* 2. Mission & Vision */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Mission Card */}
          <div className="glass-panel" style={{ padding: '3rem 2rem', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{
              display: 'inline-flex',
              padding: '1rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              color: 'var(--primary)',
              marginBottom: '1.5rem'
            }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-text)', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--dark-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              To empower learners everywhere by providing highly structured, interactive learning pathways. We believe education should be accessible, goal-oriented, and directly applicable. We seek to build the ultimate web interface for students to practice coding, review designs, and excel in their final-year collegiate and professional endeavors.
            </p>
          </div>

          {/* Vision Card */}
          <div className="glass-panel" style={{ padding: '3rem 2rem', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{
              display: 'inline-flex',
              padding: '1rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              color: 'var(--secondary)',
              marginBottom: '1.5rem'
            }}>
              <Compass size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-text)', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--dark-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              To become the standard tool for interactive technical education. We envision a platform where students don't just passively consume lecture slides, but actively code, submit queries, receive automatic feedback, and learn dynamically. We aim to support seamless integrations between local developers, peer groups, and instructors.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Platform Features Showcase */}
      <section className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.75rem' }}>Core Platform Features</h2>
          <p style={{ color: 'var(--dark-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Built using modern frontend standards to deliver a premium user experience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="glass-panel glass-panel-hover" 
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: feature.color,
                  boxShadow: `0 0 15px -3px ${feature.color}15`
                }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--dark-text)' }}>{feature.title}</h4>
                <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Quality Metric Callout */}
      <section className="container">
        <div className="glass-panel" style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={24} color="var(--primary)" /> Ready to Level Up Your Career?
            </h3>
            <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.95rem' }}>
              Create an account today to enroll in our free full-stack bootcamp, submit quizzes, and build real portfolio projects.
            </p>
          </div>
          <div>
            <a href="/signup" className="btn btn-primary" style={{ borderRadius: '12px', padding: '1rem 2rem' }}>
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
