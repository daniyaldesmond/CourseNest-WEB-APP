import React from 'react';

const LoadingSpinner = ({ type = 'spinner', count = 3, height = 150 }) => {
  if (type === 'skeleton') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className="glass-panel" 
            style={{ 
              height: `${height}px`, 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Pulsating animation overlay via custom inline style */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
              animation: 'shimmer 1.5s infinite',
              transform: 'translateX(-100%)'
            }} />
            <div style={{ height: '24px', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
            <div style={{ height: '14px', width: '90%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
            <div style={{ height: '14px', width: '80%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ height: '30px', width: '100px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
              <div style={{ height: '20px', width: '50px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem', width: '100%' }}>
      <div 
        className="animate-spin"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '4px solid rgba(255, 255, 255, 0.08)',
          borderTopColor: 'var(--primary)',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
        }} 
      />
    </div>
  );
};

export default LoadingSpinner;
