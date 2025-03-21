'use client';

import { useEffect, useState } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
}

export default function RotatingText({ texts, interval = 2000 }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 500); // Half of the transition time
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <span
      className={`inline-block transition-all duration-500 ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`}
    >
      {texts[currentIndex]}
    </span>
  );
}