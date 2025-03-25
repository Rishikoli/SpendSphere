'use client';

import React from 'react';

// Predefined positions for small orbs to ensure consistent server/client rendering
const smallOrbPositions = [
  { top: '15%', left: '75%' },
  { top: '65%', left: '15%' },
  { top: '85%', left: '85%' },
];

const ReactOrbBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main React Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-32 h-32">
          {/* Center Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary-purple opacity-30 animate-pulse-react" />
          </div>
          
          {/* Orbiting Electrons */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 animate-orbit">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-purple opacity-50" />
            </div>
          </div>
          
          <div className="absolute inset-0 rotate-60">
            <div className="absolute inset-0 animate-orbit-delayed">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-purple opacity-50" />
            </div>
          </div>
          
          <div className="absolute inset-0 -rotate-60">
            <div className="absolute inset-0 animate-orbit" style={{ animationDelay: '-2s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-purple opacity-50" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Small React Orbs */}
      {smallOrbPositions.map((position, i) => (
        <div
          key={i}
          className="absolute w-16 h-16"
          style={{
            top: position.top,
            left: position.left,
            opacity: 0.1,
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary-purple animate-pulse-react" />
            </div>
            <div className="absolute inset-0 animate-orbit">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-purple" />
            </div>
            <div className="absolute inset-0 rotate-120 animate-orbit-delayed">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-purple" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReactOrbBackground;
