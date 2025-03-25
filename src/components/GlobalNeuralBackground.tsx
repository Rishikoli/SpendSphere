'use client';

import React, { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  delay: number;
}

const GlobalNeuralBackground = () => {
  // More points for a fuller background
  const neurons: Point[] = [
    { x: 10, y: 10, delay: 0 },
    { x: 90, y: 20, delay: 1 },
    { x: 20, y: 80, delay: 2 },
    { x: 80, y: 90, delay: 1.5 },
    { x: 50, y: 50, delay: 0.5 },
    { x: 30, y: 30, delay: 2.5 },
    { x: 70, y: 40, delay: 3 },
    { x: 40, y: 70, delay: 1.8 },
    { x: 60, y: 85, delay: 2.2 },
    { x: 85, y: 60, delay: 1.2 },
  ];

  const [mousePoint, setMousePoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePoint({ x, y });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="global-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>

        {/* Background gradient */}
        <rect width="100%" height="100%" fill="url(#neural-gradient)" />

        {/* Neural Connections */}
        {neurons.map((point, i) => (
          <React.Fragment key={i}>
            {/* Connect to mouse position with distance-based opacity */}
            <line
              x1={`${point.x}%`}
              y1={`${point.y}%`}
              x2={`${mousePoint.x}%`}
              y2={`${mousePoint.y}%`}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.1"
              className="animate-signal"
              style={{ animationDelay: `${point.delay}s` }}
            />
            
            {/* Connect to nearby neurons */}
            {neurons.slice(i + 1).map((target, j) => {
              const distance = Math.hypot(target.x - point.x, target.y - point.y);
              return distance < 40 ? ( // Only connect nearby neurons
                <line
                  key={j}
                  x1={`${point.x}%`}
                  y1={`${point.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.1"
                  className="animate-signal"
                  style={{ animationDelay: `${(point.delay + target.delay) / 2}s` }}
                />
              ) : null;
            })}
          </React.Fragment>
        ))}

        {/* Neurons */}
        {neurons.map((point, i) => (
          <g key={i} filter="url(#global-glow)">
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="2"
              fill="currentColor"
              className="animate-neuron"
              style={{ animationDelay: `${point.delay}s` }}
            />
          </g>
        ))}

        {/* Mouse follower neuron */}
        <g filter="url(#global-glow)">
          <circle
            cx={`${mousePoint.x}%`}
            cy={`${mousePoint.y}%`}
            r="3"
            fill="currentColor"
            className="animate-neuron"
          />
        </g>
      </svg>
    </div>
  );
};

export default GlobalNeuralBackground;
