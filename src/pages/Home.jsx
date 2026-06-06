import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Users, Trophy, Code, Palette, Megaphone, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const { courses } = useApp();
  
  // Featured 3 courses
  const featuredCourses = courses.slice(0, 3);

  const categories = [
    { name: 'Development', icon: Code, count: '120+ Courses', color: 'var(--primary)' },
    { name: 'Design', icon: Palette, count: '85+ Courses', color: 'var(--secondary)' },
    { name: 'Marketing', icon: Megaphone, count: '45+ Courses', color: 'var(--accent-cyan)' },
    { name: 'Business', icon: Briefcase, count: '60+ Courses', color: 'var(--accent-amber)' }
  ];

  const testimonials = [
    {
      quote: "CourseNest helped me transition from a retail job to a Full-Stack Engineer in under 9 months. The course player and quizzes kept me highly engaged!",
      author: "Michael Green",
      role: "Software Developer at Google",
      avatar: "MG",
      rating: 5
    },
    {
      quote: "The Advanced UI/UX masterclass was absolute gold. The lessons list and Figma assets were structured perfectly, giving me immediate freelance clients.",
      author: "Elena Rostova",
      role: "Freelance UI Designer",
      avatar: "ER",
      rating: 5
    },
    {
      quote: "I love the community forum! Being able to ask questions and get instant feedback from instructors like Dr. Angela Chen is incredible.",
      author: "Devon Lee",
      role: "CS Student",
      avatar: "DL",
      rating: 4.8
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      
      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        padding: '6rem 0 4rem 0',
        background: 'radial-gradient(circle at 80% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)',
        overflow: 'hidden'
      }}>
        <div className="container hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          alignItems: 'center',
          gap: '3rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.15', color: 'var(--dark-text)' }}>
              Master Critical Tech & Design Skills with <span className="text-gradient">CourseNest</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--dark-text-muted)', maxWidth: '600px', lineHeight: '1.7' }}>
              Access premium interactive bootcamps, track your syllabus with real-time course players, complete programming quizzes, and collaborate with peers globally.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <Link to="/courses" className="btn btn-primary btn-lg" style={{ borderRadius: '12px' }}>
                Browse Courses <ArrowRight size={20} />
              </Link>
              <Link to="/signup" className="btn btn-secondary btn-lg" style={{ borderRadius: '12px' }}>
                Join for Free
              </Link>
            </div>
            
            {/* Trust Stats */}
            <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--dark-text)', fontWeight: '800' }}>15k+</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>Active Learners</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--dark-text)', fontWeight: '800' }}>120+</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>Expert Courses</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--dark-text)', fontWeight: '800' }}>99.4%</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Interactive Floating Mockup Graphics */}
          <div className="desktop-only" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div className="glass-panel" style={{
              width: '100%',
              maxWidth: '380px',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
              boxShadow: 'var(--shadow-lg), 0 0 40px rgba(99, 102, 241, 0.2)',
              position: 'relative',
              zIndex: 2,
              animation: 'float 6s ease-in-out infinite'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="badge badge-emerald">Active Learning</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Full Syllabus</span>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--dark-text)' }}>React Native Masters</h3>
              
              {/* Progress visual */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>Lesson 12 of 18</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>66%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '66%', height: '100%', background: 'var(--gradient-primary)' }} />
                </div>
              </div>

              {/* Lesson checklist mock */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', opacity: 0.6 }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                  <span style={{ textDecoration: 'line-through' }}>Setting up iOS Simulator</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', opacity: 0.6 }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                  <span style={{ textDecoration: 'line-through' }}>State vs Props Redux</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--primary)' }} />
                  <span>Deploying to App Store</span>
                </div>
              </div>
            </div>

            {/* Glowing background bubble behind the mockup */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(var(--primary) 0%, transparent 60%)',
              top: '10%',
              left: '10%',
              opacity: 0.35,
              zIndex: 1,
              filter: 'blur(30px)'
            }} />
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '1rem' }}>Browse Top Categories</h2>
          <p style={{ color: 'var(--dark-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Choose from a wide variety of topics instructed by industry veterans.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.name} 
                to={`/courses?category=${cat.name}`} 
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  color: cat.color,
                  boxShadow: `0 0 20px -5px ${cat.color}22`
                }}>
                  <Icon size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-text)', marginBottom: '0.2rem' }}>{cat.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Courses Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Our Featured Bootcamps</h2>
            <p style={{ color: 'var(--dark-text-muted)' }}>Accelerate your career goals with hand-picked interactive courses.</p>
          </div>
          <Link to="/courses" className="btn btn-secondary btn-sm desktop-only" style={{ borderRadius: '8px' }}>
            Explore All Courses <ArrowRight size={16} />
          </Link>
        </div>

        <div className="course-grid">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 4. Why Choose CourseNest Section */}
      <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--dark-border)', borderBottom: '1px solid var(--dark-border)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '1rem' }}>Designed For Modern Learning</h2>
            <p style={{ color: 'var(--dark-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Unlike static video directories, CourseNest focuses on real-time feedback loops and structured learning tools.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '1.25rem' }}><BookOpen size={28} /></div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', marginBottom: '0.6rem' }}>Structured Syllabus</h4>
              <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Every course outlines structured modules and lectures. Check off topics as you watch videos to sync progress globally.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ color: 'var(--secondary)', marginBottom: '1.25rem' }}><Trophy size={28} /></div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', marginBottom: '0.6rem' }}>Interactive Quizzes</h4>
              <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Test your conceptual details with multiple-choice quizzes integrated directly into student dashboard trackers.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '1.25rem' }}><Users size={28} /></div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', marginBottom: '0.6rem' }}>Discussion Forum</h4>
              <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Engage in direct community discussion threads. Share code syntax, design prototypes, and resolve learning hurdles.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '1.25rem' }}><ShieldCheck size={28} /></div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--dark-text)', marginBottom: '0.6rem' }}>University Grade</h4>
              <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                A highly comprehensive, responsive react platform suited for mockups, prototypes, or academic graduation submissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '1rem' }}>Success Stories From Our Students</h2>
          <p style={{ color: 'var(--dark-text-muted)' }}>Hear directly from learners who transformed their technical skillsets.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ color: 'var(--accent-amber)', fontSize: '1.2rem', display: 'flex', gap: '0.1rem' }}>
                {'★'.repeat(Math.floor(t.rating))}
              </div>
              <p style={{ color: 'var(--dark-text)', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.7', flexGrow: 1 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-text)',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {t.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--dark-text)', fontWeight: '700' }}>{t.author}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Styles for Floating Graphics */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid span.badge {
            align-self: center !important;
          }
          .hero-grid div {
            justify-content: center !important;
          }
        }
      `}} />
    </div>
  );
};

export default Home;
