import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, count, showNumber = true }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.4 && value % 1 < 0.9;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<StarHalf key={i} size={16} fill="#f59e0b" color="#f59e0b" />);
    } else {
      stars.push(<Star key={i} size={16} color="rgba(255, 255, 255, 0.2)" />);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }}>
        {stars}
      </div>
      {showNumber && (
        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#f59e0b' }}>
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default Rating;
