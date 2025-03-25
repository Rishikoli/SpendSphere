'use client';

import React, { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  delay: number;
}

const NeuralBackground = () => {
  // Predefined points for SSR compatibility
  const neurons: Point[] = [
    { x: 20, y: 20, delay: 0 },
    { x: 80, y: 30, delay: 1 },
    { x: 30, y: 70, delay: 2 },
    { x: 70, y: 80, delay: 1.5 },
    { x: 50, y: 50, delay: 0.5 },
  ];

  const [mousePoint, setMousePoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('neural-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePoint({ x, y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="neural-container" className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Neural Connections */}
        {neurons.map((point, i) => (
          <React.Fragment key={i}>
            {/* Connect to mouse position */}
            <line
              x1={`${point.x}%`}
              y1={`${point.y}%`}
              x2={`${mousePoint.x}%`}
              y2={`${mousePoint.y}%`}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.2"
              className="animate-signal"
              style={{ animationDelay: `${point.delay}s` }}
            />
            
            {/* Connect to other neurons */}
            {neurons.slice(i + 1).map((target, j) => (
              <line
                key={j}
                x1={`${point.x}%`}
                y1={`${point.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
                className="animate-signal"
                style={{ animationDelay: `${(point.delay + target.delay) / 2}s` }}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Neurons */}
        {neurons.map((point, i) => (
          <g key={i} filter="url(#glow)">
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="4"
              fill="currentColor"
              className="animate-neuron"
              style={{ animationDelay: `${point.delay}s` }}
            />
          </g>
        ))}

        {/* Mouse follower neuron */}
        <g filter="url(#glow)">
          <circle
            cx={`${mousePoint.x}%`}
            cy={`${mousePoint.y}%`}
            r="4"
            fill="currentColor"
            className="animate-neuron"
          />
        </g>
      </svg>
    </div>
  );
};

export default NeuralBackground;
