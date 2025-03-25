'use client';

import React from 'react';

const BudgetAnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" className="animate-float">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          
          <pattern id="circles" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="1" 
                    className="animate-pulse" />
          </pattern>
          
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="currentColor" className="animate-pulse" />
          </pattern>

          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>

        {/* Rotating hexagon */}
        <g className="animate-rotate" style={{ transformOrigin: 'center' }}>
          <path
            d="M100,50 L150,100 L150,150 L100,200 L50,150 L50,100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="10,5"
            className="animate-dash"
          />
        </g>

        {/* Background patterns */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#circles)" />
        <rect width="100%" height="100%" fill="url(#dots)" opacity="0.5" />
        
        {/* Floating circles */}
        <circle cx="80%" cy="20%" r="30" fill="none" stroke="currentColor" className="animate-float" />
        <circle cx="20%" cy="80%" r="20" fill="none" stroke="currentColor" className="animate-float" style={{ animationDelay: '-2s' }} />
        
        {/* Gradient overlay */}
        <rect width="100%" height="100%" fill="url(#gradient)" className="animate-pulse" />
      </svg>
    </div>
  );
};

export default BudgetAnimatedBackground;
