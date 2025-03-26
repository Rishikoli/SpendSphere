'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import RotatingText from './RotatingText';

const rotatingTexts = [
  "Track your expenses with ease",
  "Get AI-powered budget insights",
  "Plan your financial future",
  "Manage your money wisely",
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-card shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-dark-text flex items-center gap-2">
                SpendSphere
              </Link>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              <RotatingText
                texts={rotatingTexts}
                rotationInterval={3000}
                staggerDuration={0.02}
                splitBy="words"
                mainClassName="text-sm"
                elementLevelClassName="opacity-80"
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                initial={{ y: "50%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-50%", opacity: 0 }}
              />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-text hover:text-primary-blue focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        </div>
      </div>
    </nav>
  );
}