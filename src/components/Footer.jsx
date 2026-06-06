import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowRight, Code, Globe, Briefcase, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer style={{
      backgroundColor: 'var(--dark-bg)',
      borderTop: '1px solid var(--dark-border)',
      padding: '5rem 0 2rem 0',
      color: 'var(--dark-text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        {/* Branding Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: 'var(--gradient-primary)',
              padding: '0.4rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: 'var(--dark-text)'
            }}>
              CourseNest
            </span>
          </Link>
          <p style={{ lineHeight: '1.6' }}>
            Empowering students worldwide to master software development, design, and business through hands-on learning portals.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <a href="#" className="social-icon" style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', color: 'var(--dark-text-muted)', transition: 'all 0.2s' }}><Globe size={16} /></a>
            <a href="#" className="social-icon" style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', color: 'var(--dark-text-muted)', transition: 'all 0.2s' }}><Briefcase size={16} /></a>
            <a href="#" className="social-icon" style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', color: 'var(--dark-text-muted)', transition: 'all 0.2s' }}><Code size={16} /></a>
          </div>
        </div>

        {/* Resources Link Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--dark-text)', fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>Resources</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/courses" className="footer-link">Explore Courses</Link></li>
            <li><Link to="/about" className="footer-link">Our Mission</Link></li>
            <li><Link to="/community" className="footer-link">Community Forum</Link></li>
            <li><a href="#" className="footer-link">Blog & News</a></li>
          </ul>
        </div>

        {/* Platform Link Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--dark-text)', fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><a href="#" className="footer-link">Partner Program</a></li>
            <li><a href="#" className="footer-link">Careers</a></li>
            <li><a href="#" className="footer-link">Help Center</a></li>
            <li><a href="#" className="footer-link">System Status</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--dark-text)', fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>Subscribe</h4>
          <p>Get notified about new courses, system enhancements, and educational discounts.</p>
          <form onSubmit={handleSubscribe} style={{ position: 'relative', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 3rem 0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--dark-border)',
                color: 'var(--dark-text)',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '4px',
                top: '4px',
                bottom: '4px',
                width: '36px',
                borderRadius: '6px',
                backgroundColor: subscribed ? 'var(--accent-emerald)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--dark-text)',
                transition: 'background-color 0.2s'
              }}
            >
              {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>
          {error && <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{error}</span>}
          {subscribed && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>Subscribed successfully!</span>}
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 CourseNest Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .footer-link {
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: white;
        }
        .social-icon:hover {
          background-color: rgba(255,255,255,0.08) !important;
          color: white !important;
          transform: translateY(-2px);
        }
      `}} />
    </footer>
  );
};

export default Footer;
