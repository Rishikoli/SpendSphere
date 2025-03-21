/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#4CAF50',  // Positive financial health
          red: '#F44336',    // Expenses and warnings
          blue: '#2196F3',   // Neutral, trust
          orange: '#FF9800', // Budget alerts
          purple: '#9C27B0', // Investment gains
          teal: '#009688',   // Savings goals
          cyan: '#00BCD4',   // Analytics
        },
        budget: {
          low: '#4CAF50',    // Within budget (0-60%)
          medium: '#FF9800',  // Approaching limit (60-85%)
          high: '#F44336',    // Near/exceeded limit (85-100%+)
          bar: '#E0E0E0',     // Budget progress bar background
          barHover: '#BDBDBD', // Hover state for progress bars
        },
        dark: {
          background: '#121212',  // Deep Charcoal
          card: '#1E1E1E',       // Soft Black
          cardHover: '#252525',   // Card hover state
          text: '#E0E0E0',       // Light Gray
          border: '#2D2D2D',     // Subtle borders for budget cards
          accent: '#3D3D3D',     // Accent for interactive elements
        },
        gradient: {
          start: '#1A237E',     // Deep indigo start
          end: '#311B92',       // Deep purple end
          overlay: 'rgba(33, 150, 243, 0.1)', // Subtle blue overlay
        },
      },
      spacing: {
        'budget-card': '18rem',  // Standard width for budget cards
      },
      borderRadius: {
        'budget': '0.75rem',     // Consistent border radius for budget elements
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
}