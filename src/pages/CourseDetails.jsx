import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, Users, Award, ChevronDown, ChevronUp, ArrowLeft, Star, Heart, CreditCard, Lock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/Rating';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, enrollments, enrollInCourse } = useApp();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Payment gateway simulation states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
    if (user && !paymentForm.name) {
      setPaymentForm(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setPaymentForm(prev => ({ ...prev, cardNumber: formatted }));
    if (paymentErrors.cardNumber) {
      setPaymentErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setPaymentForm(prev => ({ ...prev, expiry: formatted }));
    if (paymentErrors.expiry) {
      setPaymentErrors(prev => ({ ...prev, expiry: '' }));
    }
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setPaymentForm(prev => ({ ...prev, cvc: value }));
    if (paymentErrors.cvc) {
      setPaymentErrors(prev => ({ ...prev, cvc: '' }));
    }
  };

  const handleNameChange = (e) => {
    setPaymentForm(prev => ({ ...prev, name: e.target.value }));
    if (paymentErrors.name) {
      setPaymentErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s+/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    return 'unknown';
  };

  const validatePaymentForm = () => {
    const errors = {};
    const cleanCard = paymentForm.cardNumber.replace(/\s+/g, '');
    
    if (!paymentForm.name.trim()) {
      errors.name = 'Cardholder name is required';
    }
    
    if (cleanCard.length < 15 || cleanCard.length > 16) {
      errors.cardNumber = 'Enter a valid 15 or 16 digit card number';
    }
    
    if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) {
      errors.expiry = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = paymentForm.expiry.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      
      if (month < 1 || month > 12) {
        errors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = 'Card has expired';
      }
    }
    
    const cardType = getCardType(cleanCard);
    const expectedCvcLen = cardType === 'amex' ? 4 : 3;
    if (paymentForm.cvc.length !== expectedCvcLen) {
      errors.cvc = `CVC must be ${expectedCvcLen} digits`;
    }
    
    return errors;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const errors = validatePaymentForm();
    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }

    setPaymentStatus('processing');
    setProcessingStep('Initializing secure connection...');

    setTimeout(() => {
      setProcessingStep('Contacting bank card network...');
      
      setTimeout(() => {
        setProcessingStep('Authorizing secure checkout payment...');
        
        setTimeout(() => {
          setProcessingStep('Simulating successful Stripe charge...');
          
          setTimeout(() => {
            setPaymentStatus('success');
            
            setTimeout(() => {
              enrollInCourse(course.id);
              setShowPaymentModal(false);
              setPaymentStatus('idle');
              setPaymentForm({
                name: user?.name || '',
                cardNumber: '',
                expiry: '',
                cvc: ''
              });
              navigate(`/player/${course.id}`);
            }, 1800);
            
          }, 1000);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    // Find course by ID
    const foundCourse = courses.find(c => String(c.id) === String(id));

    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setCourse(foundCourse);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id, courses]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--dark-text)', marginBottom: '1rem' }}>Course Not Found</h2>
        <p style={{ color: 'var(--dark-text-muted)', marginBottom: '2rem' }}>The course you are looking for does not exist or has been removed.</p>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  const isEnrolled = enrollments.some(e => e.courseId === course.id);
  const enrollmentDetails = enrollments.find(e => e.courseId === course.id);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isEnrolled) {
      navigate(`/player/${course.id}`);
    } else if (course.price === 0 || !course.price) {
      enrollInCourse(course.id);
      navigate(`/player/${course.id}`);
    } else {
      setShowPaymentModal(true);
    }
  };

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>

      {/* 1. Header Banner/Hero */}
      <section style={{
        backgroundColor: '#0c0d15',
        borderBottom: '1px solid var(--dark-border)',
        padding: '4rem 0 3rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark-text-muted)', marginBottom: '2rem', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-text-muted)'}>
            <ArrowLeft size={16} /> Back to Catalog
          </Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3rem',
            alignItems: 'center'
          }} className="hero-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <span className="badge badge-primary">{course.category}</span>
                <span className="badge badge-cyan">{course.level}</span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--dark-text)', lineHeight: '1.2' }}>{course.title}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--dark-text-muted)', lineHeight: '1.6' }}>{course.shortDescription}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--dark-text-muted)' }}>
                <Rating value={course.rating} count={course.reviewsCount} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} color="var(--primary)" />
                  <span>{(course.studentsEnrolled + (isEnrolled ? 1 : 0)).toLocaleString()} Enrolled Students</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} color="var(--secondary)" />
                  <span>{course.duration} total duration</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-text)',
                  fontWeight: '700'
                }}>
                  {course.instructor.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>Instructed by</div>
                  <div style={{ color: 'var(--dark-text)', fontWeight: '700', fontSize: '0.95rem' }}>{course.instructor}</div>
                </div>
              </div>
            </div>

            {/* Sidebar Checkout Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '380px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.15)'
              }}>
                <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(9, 10, 15, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={handleEnrollClick}
                      style={{
                        padding: '1rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'var(--dark-text)',
                        boxShadow: 'var(--shadow-glow)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Play size={24} fill="white" style={{ marginLeft: '4px' }} />
                    </button>
                  </div>
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isEnrolled ? (
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: '800', fontSize: '1.4rem' }}>
                        Enrolled ({enrollmentDetails.progress}%)
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--dark-text)' }}>${course.price}</span>
                        {course.originalPrice && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--dark-text-muted)' }}>${course.originalPrice}</span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--dark-border)',
                        color: isWishlisted ? 'var(--accent-rose)' : 'var(--dark-text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={18} fill={isWishlisted ? 'var(--accent-rose)' : 'none'} />
                    </button>
                  </div>

                  <button
                    onClick={handleEnrollClick}
                    className="btn btn-primary"
                    style={{ width: '100%', borderRadius: '10px', height: '48px' }}
                  >
                    {isEnrolled ? 'Resume Learning' : 'Enroll in Course'}
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--dark-text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Play size={12} color="var(--primary)" />
                      <span>Full lifetime access to video content</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={12} color="var(--secondary)" />
                      <span>Certificate of completion in dashboard</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={12} color="var(--accent-cyan)" />
                      <span>Interactive quizzes & forum collaboration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Content Details & Curriculum */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '4rem'
        }} className="hero-grid">

          {/* Left Description & Curriculum Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

            {/* Course Description */}
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-text)', marginBottom: '1rem' }}>About This Course</h2>
              <p style={{ color: 'var(--dark-text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>{course.description}</p>
            </div>

            {/* Curriculum (Lessons list) */}
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-text)', marginBottom: '1.25rem' }}>Course Curriculum</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="glass-panel"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      style={{
                        width: '100%',
                        padding: '1.2rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--dark-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          color: 'var(--primary)',
                          fontWeight: '700'
                        }}>
                          {idx + 1}
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--dark-text)' }}>{lesson.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--dark-text-muted)' }}>
                        <span style={{ fontSize: '0.8rem' }}>{lesson.duration}</span>
                        {activeAccordion === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {activeAccordion === idx && (
                      <div style={{
                        padding: '0 1.5rem 1.2rem 3.8rem',
                        color: 'var(--dark-text-muted)',
                        fontSize: '0.875rem',
                        borderTop: '1px solid rgba(255,255,255,0.03)',
                        paddingTop: '1rem',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        lineHeight: '1.6'
                      }}>
                        This lecture covers the foundational criteria for {lesson.title.toLowerCase()}. Learn theoretical design workflows and complete the lesson to progress through your student goals.
                        {isEnrolled ? (
                          <div style={{ marginTop: '0.75rem' }}>
                            <Link to={`/player/${course.id}`} className="btn btn-secondary btn-sm" style={{ borderRadius: '6px', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                              Watch Video
                            </Link>
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--primary)' }}>
                            Enroll in the course to unlock and watch this lecture video.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Box */}
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', marginBottom: '1.25rem' }}>Your Instructor</h3>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }} className="hero-grid">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-text)',
                  fontWeight: '700',
                  fontSize: '1.4rem',
                  flexShrink: 0
                }}>
                  {course.instructor.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--dark-text)' }}>{course.instructor}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>Senior Developer & Academic Educator</p>
                  <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>{course.instructorBio || 'An industry leader who teaches complex methodologies through structured visual timelines.'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Placeholder (For desktop grid alignment) */}
          <div className="desktop-only" />

        </div>
      </section>

      {/* 3. Payment Gateway Simulation Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 6, 10, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {/* Modal Card */}
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#0c0d15',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15)',
            position: 'relative',
            animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.01)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark-text)' }}>
                <Lock size={16} color="var(--primary)" />
                <span style={{ fontWeight: '700', fontSize: '1rem', letterSpacing: '-0.01em' }}>Secure Checkout</span>
              </div>
              <button 
                type="button"
                onClick={() => {
                  if (paymentStatus !== 'processing') {
                    setShowPaymentModal(false);
                    setPaymentErrors({});
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--dark-text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s'
                }}
                disabled={paymentStatus === 'processing'}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-text-muted)'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {paymentStatus === 'idle' && (
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Course Summary card inside form */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                    <div style={{ minWidth: 0, flexGrow: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>You are enrolling in:</div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: 'var(--dark-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {course.title}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--dark-text)' }}>
                      ${course.price}
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Cardholder Name */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--dark-text-muted)' }} htmlFor="cardholder-name">
                        Cardholder Name
                      </label>
                      <input 
                        type="text"
                        id="cardholder-name"
                        value={paymentForm.name}
                        onChange={handleNameChange}
                        placeholder="e.g. Alex Johnson"
                        className="form-input"
                        style={{ height: '40px', fontSize: '0.9rem' }}
                      />
                      {paymentErrors.name && (
                        <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertCircle size={12} /> {paymentErrors.name}
                        </div>
                      )}
                    </div>

                    {/* Card Number */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--dark-text-muted)' }} htmlFor="card-number">
                        Card Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="text"
                          id="card-number"
                          value={paymentForm.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 1234 5678 9010"
                          className="form-input"
                          style={{ height: '40px', fontSize: '0.9rem', paddingLeft: '2.8rem' }}
                        />
                        {/* Dynamic Card Icon */}
                        <div style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--dark-text-muted)',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {getCardType(paymentForm.cardNumber) === 'visa' && (
                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#1A1F71', backgroundcolor: 'var(--dark-text)', padding: '0.1rem 0.2rem', borderRadius: '2px' }}>VISA</span>
                          )}
                          {getCardType(paymentForm.cardNumber) === 'mastercard' && (
                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#EB001B', backgroundcolor: 'var(--dark-text)', padding: '0.1rem 0.2rem', borderRadius: '2px' }}>MC</span>
                          )}
                          {getCardType(paymentForm.cardNumber) === 'amex' && (
                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#0070d2', backgroundcolor: 'var(--dark-text)', padding: '0.1rem 0.2rem', borderRadius: '2px' }}>AMEX</span>
                          )}
                          {getCardType(paymentForm.cardNumber) === 'unknown' && (
                            <CreditCard size={18} />
                          )}
                        </div>
                      </div>
                      {paymentErrors.cardNumber && (
                        <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertCircle size={12} /> {paymentErrors.cardNumber}
                        </div>
                      )}
                    </div>

                    {/* Expiry and CVC Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {/* Expiry */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--dark-text-muted)' }} htmlFor="card-expiry">
                          Expiration (MM/YY)
                        </label>
                        <input 
                          type="text"
                          id="card-expiry"
                          value={paymentForm.expiry}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          className="form-input"
                          style={{ height: '40px', fontSize: '0.9rem' }}
                        />
                        {paymentErrors.expiry && (
                          <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <AlertCircle size={12} /> {paymentErrors.expiry}
                          </div>
                        )}
                      </div>

                      {/* CVC */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--dark-text-muted)' }} htmlFor="card-cvc">
                          CVC
                        </label>
                        <input 
                          type="text"
                          id="card-cvc"
                          value={paymentForm.cvc}
                          onChange={handleCvcChange}
                          placeholder="123"
                          className="form-input"
                          style={{ height: '40px', fontSize: '0.9rem' }}
                        />
                        {paymentErrors.cvc && (
                          <div style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <AlertCircle size={12} /> {paymentErrors.cvc}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lock Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--dark-text-muted)',
                    lineHeight: '1.4'
                  }}>
                    <Lock size={12} style={{ flexShrink: 0 }} />
                    <span>Your transaction is simulated. No real credit card details or billing charges will occur.</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setPaymentErrors({});
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1, borderRadius: '8px', height: '42px', fontSize: '0.9rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 1, borderRadius: '8px', height: '42px', fontSize: '0.9rem', fontWeight: '700' }}
                    >
                      Pay ${course.price}
                    </button>
                  </div>
                </form>
              )}

              {/* Processing/Validation State */}
              {paymentStatus === 'processing' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem 1rem',
                  gap: '1.5rem',
                  textAlign: 'center'
                }}>
                  {/* Premium Spinner */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '3px solid rgba(99, 102, 241, 0.1)',
                    borderTopColor: 'var(--primary)',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-text)', marginBottom: '0.4rem', fontWeight: '700' }}>Processing Payment</h3>
                    <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>{processingStep}</p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {paymentStatus === 'success' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem 1rem',
                  gap: '1.5rem',
                  textAlign: 'center',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '2px solid var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-emerald)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
                    animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem', fontWeight: '800' }}>Payment Successful!</h3>
                    <p style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: '600' }}>Enrolling you in the bootcamp...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scaleIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
};

export default CourseDetails;
