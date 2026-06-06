import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form Validation Logic
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    email: '',
    password: '',
    rememberMe: false
  }, validate);

  const handleLoginSubmit = async (formValues) => {
    setAuthError('');
    setIsLoading(true);
    
    try {
      const res = await login(formValues.email, formValues.password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setAuthError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setAuthError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height) - 100px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.1)'
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>
            Log in to continue tracking your course progress.
          </p>
        </div>

        {authError && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem'
          }}>
            <ShieldAlert size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, handleLoginSubmit)}>
          
          {/* Email field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="form-input"
                placeholder="alex@example.com"
                style={{ paddingLeft: '2.5rem' }}
                disabled={isLoading}
              />
              <Mail size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
            {errors.email && (
              <span className="form-error">
                <ShieldAlert size={12} /> {errors.email}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '2.5rem' }}
                disabled={isLoading}
              />
              <Lock size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
            {errors.password && (
              <span className="form-error">
                <ShieldAlert size={12} /> {errors.password}
              </span>
            )}
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>
              <input 
                type="checkbox"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                style={{
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', borderRadius: '10px', height: '46px', display: 'flex', gap: '0.6rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopcolor: 'var(--dark-text)',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : (
              <>
                <span>Sign In</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        {/* Hints */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>
          <div style={{ fontWeight: '700', color: 'var(--dark-text)', marginBottom: '0.2rem' }}>💡 Quick Testing Credentials:</div>
          <div>• Student: <code>alex@example.com</code> / <code>password123</code></div>
          <div>• Instructor: <code>angela@example.com</code> / <code>password123</code></div>
          <div>• Admin Panel: <code>admin@coursenest.com</code> / <code>password123</code></div>
        </div>

        {/* Footer link */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Sign up for free
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
