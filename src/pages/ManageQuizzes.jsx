import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Trash2, ShieldAlert, Check, HelpCircle, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useForm from '../hooks/useForm';
import { filterBySearch } from '../utils/listFilters';

const ManageQuizzes = () => {
  const { courses, updateCourse } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');

  const filteredCourseOptions = useMemo(
    () => filterBySearch(courses, courseSearch, ['title', 'instructor']),
    [courses, courseSearch]
  );

  useEffect(() => {
    if (filteredCourseOptions.length > 0 && !filteredCourseOptions.some((c) => String(c.id) === String(selectedCourseId))) {
      setSelectedCourseId(filteredCourseOptions[0].id);
    }
  }, [filteredCourseOptions, selectedCourseId]);

  const activeCourse = courses.find(c => String(c.id) === String(selectedCourseId));

  const filteredQuestions = useMemo(() => {
    if (!activeCourse?.quiz) return [];
    return filterBySearch(activeCourse.quiz, questionSearch, ['question']);
  }, [activeCourse, questionSearch]);

  // Form Validation
  const validate = (values) => {
    const errors = {};
    if (!values.question) errors.question = 'Question text is required';
    if (!values.optionA) errors.optionA = 'Option A is required';
    if (!values.optionB) errors.optionB = 'Option B is required';
    if (!values.optionC) errors.optionC = 'Option C is required';
    if (!values.optionD) errors.optionD = 'Option D is required';
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '0'
  }, validate);

  const handleAddQuestionSubmit = (formValues) => {
    if (!activeCourse) return;

    const newQuestionId = activeCourse.quiz.length > 0
      ? Math.max(...activeCourse.quiz.map(q => q.id)) + 1
      : 1;

    const newQuestion = {
      id: newQuestionId,
      question: formValues.question,
      options: [
        formValues.optionA,
        formValues.optionB,
        formValues.optionC,
        formValues.optionD
      ],
      answer: parseInt(formValues.correctAnswer)
    };

    const updatedQuiz = [...activeCourse.quiz, newQuestion];
    updateCourse(activeCourse.id, { quiz: updatedQuiz });

    setSuccessMsg('Quiz question added successfully!');
    resetForm();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteQuestion = (questionId) => {
    if (!activeCourse) return;

    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuiz = activeCourse.quiz.filter(q => q.id !== questionId);
      updateCourse(activeCourse.id, { quiz: updatedQuiz });

      setSuccessMsg('Question deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--dark-text)', marginBottom: '0.4rem' }}>Manage Quizzes</h1>
        <p style={{ color: 'var(--dark-text-muted)' }}>Configure multiple-choice questions, verify answer keys, and graded parameters for select bootcamps.</p>
      </div>

      {successMsg && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: 'var(--accent-emerald)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark-text)' }}>Select Course</span>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Filter courses..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="form-input"
          style={{ maxWidth: '100%', appearance: 'none', cursor: 'pointer' }}
        >
          {filteredCourseOptions.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {activeCourse ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem'
        }} className="admin-grid">

          {/* Left Column: Questions Listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)' }}>Current Questions ({filteredQuestions.length}{questionSearch ? ` of ${activeCourse.quiz.length}` : ''})</h3>

            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search questions..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
              {questionSearch && (
                <button type="button" onClick={() => setQuestionSearch('')} style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer' }}>
                  <X size={16} color="var(--dark-text-muted)" />
                </button>
              )}
            </div>

            {filteredQuestions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="glass-panel"
                    style={{
                      padding: '1.5rem 2rem',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative'
                    }}
                  >
                    {/* Delete Icon Trigger */}
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        padding: '0.4rem',
                        borderRadius: '50%',
                        color: 'var(--accent-rose)',
                        backgroundColor: 'rgba(244, 63, 94, 0.05)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.05)'}
                      title="Delete Question"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', paddingRight: '2rem' }}>
                      <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--dark-text)', lineHeight: '1.4' }}>
                        {idx + 1}. {q.question}
                      </span>
                    </div>

                    {/* Options list */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      paddingLeft: '1.8rem'
                    }} className="quiz-options-grid">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = q.answer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '0.6rem 0.8rem',
                              borderRadius: '8px',
                              border: isCorrect ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.03)',
                              backgroundColor: isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.01)',
                              color: isCorrect ? 'white' : 'var(--dark-text-muted)',
                              fontSize: '0.8rem',
                              fontWeight: isCorrect ? '700' : '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <span style={{ color: isCorrect ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.2)', fontWeight: '700' }}>
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                            {isCorrect && <Check size={12} color="var(--accent-emerald)" style={{ marginLeft: 'auto' }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--dark-text-muted)' }}>
                {questionSearch ? 'No questions match your search.' : 'No questions compiled for this course yet.'}
              </p>
            )}
          </div>

          {/* Right Column: Add Question Form */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-text)', marginBottom: '1.5rem' }}>Add Question</h3>

            <form onSubmit={(e) => handleSubmit(e, handleAddQuestionSubmit)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Question Text</label>
                  <input
                    type="text"
                    name="question"
                    value={values.question}
                    onChange={handleChange}
                    placeholder="e.g. Which hook triggers local state resets?"
                    className="form-input"
                  />
                  {errors.question && <span className="form-error"><ShieldAlert size={12} /> {errors.question}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Option A</label>
                  <input type="text" name="optionA" value={values.optionA} onChange={handleChange} className="form-input" placeholder="Option A text" />
                  {errors.optionA && <span className="form-error"><ShieldAlert size={12} /> {errors.optionA}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Option B</label>
                  <input type="text" name="optionB" value={values.optionB} onChange={handleChange} className="form-input" placeholder="Option B text" />
                  {errors.optionB && <span className="form-error"><ShieldAlert size={12} /> {errors.optionB}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Option C</label>
                  <input type="text" name="optionC" value={values.optionC} onChange={handleChange} className="form-input" placeholder="Option C text" />
                  {errors.optionC && <span className="form-error"><ShieldAlert size={12} /> {errors.optionC}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Option D</label>
                  <input type="text" name="optionD" value={values.optionD} onChange={handleChange} className="form-input" placeholder="Option D text" />
                  {errors.optionD && <span className="form-error"><ShieldAlert size={12} /> {errors.optionD}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Correct Option</label>
                  <select
                    name="correctAnswer"
                    value={values.correctAnswer}
                    onChange={handleChange}
                    className="form-input"
                    style={{ appearance: 'none', backgroundColor: 'var(--dark-surface)', cursor: 'pointer' }}
                  >
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: '8px', display: 'flex', justifyAlignment: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
                >
                  <PlusCircle size={16} />
                  <span>Compile Question</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        <p style={{ color: 'var(--dark-text-muted)' }}>Create a course first to begin configuring quiz questions.</p>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .quiz-options-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
};

export default ManageQuizzes;
