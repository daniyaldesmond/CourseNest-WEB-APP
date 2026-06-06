import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Signup Validation Logic
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Full name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!values.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Service';
    }
    
    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  }, validate);

  const handleSignupSubmit = async (formValues) => {
    setAuthError('');
    setIsLoading(true);
    
    try {
      const res = await signup(formValues.name, formValues.email, formValues.password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setAuthError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setAuthError(err.message || 'An error occurred during registration.');
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
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.1)'
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>
            Start learning, tracking progress, and taking quizzes.
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

        <form onSubmit={(e) => handleSubmit(e, handleSignupSubmit)}>
          
          {/* Full Name field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Alex Johnson"
                style={{ paddingLeft: '2.5rem' }}
                disabled={isLoading}
              />
              <User size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
            {errors.name && (
              <span className="form-error">
                <ShieldAlert size={12} /> {errors.name}
              </span>
            )}
          </div>

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
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Min 6 characters"
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

          {/* Confirm Password field */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Re-enter password"
                style={{ paddingLeft: '2.5rem' }}
                disabled={isLoading}
              />
              <Lock size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
            {errors.confirmPassword && (
              <span className="form-error">
                <ShieldAlert size={12} /> {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>
              <input 
                type="checkbox"
                name="agreeTerms"
                checked={values.agreeTerms}
                onChange={handleChange}
                style={{
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  marginTop: '2px'
                }}
                disabled={isLoading}
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {errors.agreeTerms && (
              <span className="form-error">
                <ShieldAlert size={12} /> {errors.agreeTerms}
              </span>
            )}
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
                <span>Sign Up</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--dark-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
