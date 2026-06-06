import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, User, Layout, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleNavSearch = (e) => {
    e.preventDefault();
    const q = navSearch.trim();
    navigate(q ? `/courses?search=${encodeURIComponent(q)}` : '/courses');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--header-height)',
      backgroundColor: 'var(--header-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--dark-border)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
          }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            background: 'var(--logo-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Course<span style={{ color: 'var(--secondary)' }}>Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-only">
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--dark-text-muted)',
                fontWeight: '600',
                transition: 'color var(--transition-fast)'
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--dark-text-muted)',
                fontWeight: '600',
                transition: 'color var(--transition-fast)'
              })}
            >
              Courses
            </NavLink>
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--dark-text-muted)',
                fontWeight: '600',
                transition: 'color var(--transition-fast)'
              })}
            >
              About
            </NavLink>
            <NavLink
              to="/community"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--dark-text-muted)',
                fontWeight: '600',
                transition: 'color var(--transition-fast)'
              })}
            >
              Community
            </NavLink>
          </div>
        </div>

        {/* User Account Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <form onSubmit={handleNavSearch} className="desktop-only" style={{ position: 'relative' }}>
            <input
              type="search"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search courses..."
              className="form-input"
              style={{ width: '200px', height: '40px', paddingLeft: '2.25rem', borderRadius: '10px', fontSize: '0.85rem' }}
              aria-label="Search courses"
            />
            <Search size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
          </form>

          <ThemeToggle />

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              {/* Profile Selector Trigger */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--dark-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-elevated-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-elevated)'; }}
              >
                {/* User Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'var(--dark-text)'
                }}>
                  {user.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
                    <img 
                      src={user.avatar.startsWith('/') ? `http://localhost:5000${user.avatar}` : user.avatar} 
                      alt={user.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    user.avatar
                  )}
                </div>
                <div style={{ textAlign: 'left' }} className="desktop-only">
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark-text)', lineHeight: '1.2' }}>{user.name}</div>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginTop: '0.1rem' }}>
                    {user.role}
                  </span>
                </div>
                <ChevronDown size={14} color="var(--dark-text-muted)" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      width: '240px',
                      padding: '0.75rem',
                      zIndex: 100,
                      border: '1px solid var(--dark-border)',
                      backgroundColor: 'var(--dropdown-bg)',
                      boxShadow: 'var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem'
                    }}
                  >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>Logged in as</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark-text)' }}>{user.email}</div>
                    </div>

                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '8px', fontSize: '0.875rem' }}
                      className="dropdown-item"
                    >
                      <Layout size={16} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '8px', fontSize: '0.875rem' }}
                      className="dropdown-item"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>



                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer', color: 'var(--accent-rose)' }}
                      className="dropdown-item"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.8rem' }} className="desktop-only">
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ borderRadius: '10px' }}>Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ borderRadius: '10px' }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.4rem', color: 'var(--dark-text)', cursor: 'pointer' }}
            className="mobile-only"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--header-height)',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--nav-overlay-bg)',
          zIndex: 998,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: '600' }}>Home</Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: '600' }}>Courses</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: '600' }}>About</Link>
          <Link to="/community" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: '600' }}>Community</Link>

          <form onSubmit={handleNavSearch} style={{ position: 'relative' }}>
            <input
              type="search"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search courses..."
              className="form-input"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
            <Search size={18} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </form>

          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>Log In</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Sign Up</Link>
            </div>
          )}

          {isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  background: 'var(--gradient-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--dark-text)', 
                  fontWeight: '700' 
                }}>
                  {user.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http')) ? (
                    <img 
                      src={user.avatar.startsWith('/') ? `http://localhost:5000${user.avatar}` : user.avatar} 
                      alt={user.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    user.avatar
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: '700' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>{user.email}</div>
                </div>
              </div>

              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <Layout size={16} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Global CSS Inject to handle media queries on navbar and custom menu items */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 8px;
          color: var(--dark-text-muted);
          transition: all 0.2s;
        }
        .dropdown-item:hover {
          color: var(--dark-text);
          background-color: var(--surface-elevated-hover);
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
