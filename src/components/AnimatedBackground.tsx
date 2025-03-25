'use client';

import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            className="animate-float"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="circle-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            className="animate-pulse"
          >
            <circle
              cx="30"
              cy="30"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        <rect width="100%" height="100%" fill="url(#circle-pattern)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
