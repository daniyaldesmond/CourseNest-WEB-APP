import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Award, CheckCircle, XCircle, ChevronRight, HelpCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, enrollments, submitQuizScore } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const foundCourse = courses.find(c => String(c.id) === String(courseId));

    // Simulate delay
    const timer = setTimeout(() => {
      setCourse(foundCourse);
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [courseId, courses]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--dark-bg)', minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!course || !course.quiz || course.quiz.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--dark-text)' }}>
        <h2>Quiz Not Found</h2>
        <p style={{ color: 'var(--dark-text-muted)', marginBottom: '1.5rem' }}>This course does not have a quiz module loaded.</p>
        <Link to={`/player/${courseId}`} className="btn btn-primary">Back to Player</Link>
      </div>
    );
  }

  const quizQuestions = course.quiz;
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate Score
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quizQuestions.length) * 100);
    setScore(calculatedScore);

    // Save to AppContext
    submitQuizScore(course.id, calculatedScore);
    setShowResults(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      padding: '3rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--dark-bg)'
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          padding: '2.5rem 2rem',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.12)'
        }}
      >

        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <Link to={`/player/${course.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Player
          </Link>
          <span style={{ fontSize: '0.85rem', color: 'var(--dark-text-muted)', fontWeight: '600' }}>
            {course.title}
          </span>
        </div>

        {!showResults ? (
          /* ACTIVE QUIZ SCREEN */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Progress indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                <span style={{ color: 'var(--dark-text-muted)' }}>Progress: {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`, height: '100%', background: 'var(--gradient-primary)' }} />
              </div>
            </div>

            {/* Question Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <HelpCircle size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', lineHeight: '1.4' }}>
                  {currentQuestion.question}
                </h3>
              </div>
            </div>

            {/* Options grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className="glass-panel"
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
                      color: isSelected ? 'white' : 'var(--dark-text-muted)',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid var(--primary)' : '2px solid var(--dark-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: isSelected ? 'var(--primary)' : 'var(--dark-text-muted)',
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={handlePrevious}
                className="btn btn-secondary btn-sm"
                disabled={currentQuestionIndex === 0}
                style={{ borderRadius: '8px', opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
              >
                Previous
              </button>

              {currentQuestionIndex === quizQuestions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px' }}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px' }}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULTS DISPLAY SCREEN */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center', animation: 'fadeIn 0.4s ease-out' }}>

            <div>
              <div style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: score >= 70 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                color: score >= 70 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                marginBottom: '1rem'
              }}>
                <Award size={48} />
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>
                {score >= 70 ? 'Congratulations! You Passed!' : 'Try Again'}
              </h2>
              <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.9rem' }}>
                You scored <strong>{score}%</strong> on this graded assessment.
              </p>
            </div>

            {/* Score Ring / Bar */}
            <div style={{
              padding: '1.5rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--dark-text-muted)' }}>
                Result Summary
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Minimum Passing Grade: 70%</span>
                <span style={{ color: score >= 70 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: '800' }}>
                  {score >= 70 ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${score}%`,
                    height: '100%',
                    backgroundColor: score >= 70 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}
                />
              </div>
            </div>

            {/* Answer Key Review Details */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ color: 'var(--dark-text)', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>Review Questions</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {quizQuestions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.answer;

                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: isCorrect ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(244,63,94,0.15)',
                        display: 'flex',
                        gap: '0.6rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      {isCorrect ? (
                        <CheckCircle size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      ) : (
                        <XCircle size={16} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: '700', color: 'var(--dark-text)' }}>{idx + 1}. {q.question}</span>
                        <span style={{ color: 'var(--dark-text-muted)' }}>
                          Your answer: <span style={{ color: isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: '600' }}>
                            {q.options[userAnswer] || 'Unanswered'}
                          </span>
                        </span>
                        {!isCorrect && (
                          <span style={{ color: 'var(--accent-emerald)' }}>
                            Correct: <strong>{q.options[q.answer]}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleRetake}
                className="btn btn-secondary"
                style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={16} />
                <span>Retake Quiz</span>
              </button>
              <Link
                to={`/player/${course.id}`}
                className="btn btn-primary"
                style={{ borderRadius: '10px' }}
              >
                Return to Course Player
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default QuizPage;
