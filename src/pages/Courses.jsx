import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import apiService from '../services/api';
import { normalizeCourse } from '../utils/listFilters';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['All', 'Development', 'Design', 'Marketing'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title A–Z' },
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [freeOnly, setFreeOnly] = useState(searchParams.get('free') === 'true');

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const buildApiFilters = useCallback(() => {
    const filters = { sort: sortBy };
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    if (selectedLevel !== 'All') filters.level = selectedLevel;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    if (freeOnly) {
      filters.free = 'true';
    } else {
      if (minPrice !== '') filters.minPrice = minPrice;
      if (maxPrice !== '') filters.maxPrice = maxPrice;
    }
    return filters;
  }, [selectedCategory, selectedLevel, searchQuery, sortBy, minPrice, maxPrice, freeOnly]);

  const syncUrlParams = useCallback(() => {
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedLevel !== 'All') params.level = selectedLevel;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (sortBy !== 'newest') params.sort = sortBy;
    if (freeOnly) params.free = 'true';
    else {
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;
    }
    setSearchParams(params);
  }, [selectedCategory, selectedLevel, searchQuery, sortBy, minPrice, maxPrice, freeOnly, setSearchParams]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getCourses(buildApiFilters());
      setCourses(data.map(normalizeCourse));
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [buildApiFilters]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedLevel(searchParams.get('level') || 'All');
    setSortBy(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setFreeOnly(searchParams.get('free') === 'true');
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    syncUrlParams();
    fetchCourses();
  };

  const applyFilters = () => {
    syncUrlParams();
    fetchCourses();
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setFreeOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedLevel !== 'All' ||
    searchQuery.trim() ||
    sortBy !== 'newest' ||
    freeOnly ||
    minPrice !== '' ||
    maxPrice !== '';

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Explore Our Courses</h1>
          <p style={{ color: 'var(--dark-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Expand your programming knowledge, refine design methodologies, and master product strategy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Search courses, instructors, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '3rem', borderRadius: '12px', height: '52px', fontSize: '1rem' }}
            />
            <Search size={20} color="var(--dark-text-muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--dark-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="btn btn-secondary"
            style={{ borderRadius: '12px', height: '52px', padding: '0 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>

        {(mobileFiltersOpen || true) && (
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              marginBottom: '2.5rem',
              border: '1px solid var(--dark-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dark-border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dark-text)' }}>
                Refine Course Catalog
              </span>
              {hasActiveFilters && (
                <button type="button" onClick={clearAllFilters} style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', cursor: 'pointer', fontWeight: '600' }}>
                  Clear All Filters
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span className="form-label">Sort by</span>
                <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginTop: '0.25rem' }}>
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="form-label">Min price ($)</span>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  disabled={freeOnly}
                  placeholder="0"
                  style={{ marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <span className="form-label">Max price ($)</span>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={freeOnly}
                  placeholder="Any"
                  style={{ marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--dark-text-muted)', paddingBottom: '0.6rem' }}>
                  <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Free courses only
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark-text-muted)', marginBottom: '0.6rem' }}>Category</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--surface-elevated)',
                        color: selectedCategory === cat ? 'white' : 'var(--dark-text-muted)',
                        border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--dark-border)',
                        cursor: 'pointer',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark-text-muted)', marginBottom: '0.6rem' }}>Skill Level</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: selectedLevel === lvl ? 'var(--secondary)' : 'var(--surface-elevated)',
                        color: selectedLevel === lvl ? 'white' : 'var(--dark-text-muted)',
                        border: selectedLevel === lvl ? '1px solid var(--secondary)' : '1px solid var(--dark-border)',
                        cursor: 'pointer',
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="button" onClick={applyFilters} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '8px' }}>
              Apply filters
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner type="skeleton" count={3} height={180} />
        ) : courses.length > 0 ? (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="animate-fade-in">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Search size={28} color="var(--dark-text-muted)" />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-text)' }}>No Courses Found</h3>
            <p style={{ color: 'var(--dark-text-muted)', maxWidth: '400px' }}>
              We couldn&apos;t find any courses matching your criteria. Try adjusting filters or search keywords.
            </p>
            <button type="button" onClick={clearAllFilters} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px', marginTop: '0.5rem' }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
