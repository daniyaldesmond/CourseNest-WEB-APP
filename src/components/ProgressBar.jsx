import React from 'react';

const ProgressBar = ({ progress, height = 8, showText = false }) => {
  const cleanProgress = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%' }}>
      {showText && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600' }}>
          <span style={{ color: 'var(--dark-text-muted)' }}>Progress</span>
          <span style={{ color: 'var(--primary)' }}>{cleanProgress}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${cleanProgress}%`,
          height: '100%',
          background: 'var(--gradient-primary)',
          borderRadius: '999px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
