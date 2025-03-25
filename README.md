# SpendSphere - Smart Financial Management

SpendSphere is a modern financial management application built with Next.js, featuring AI-powered budget recommendations and real-time expense tracking.

## 🌟 Features

- 📊 Interactive Dashboard with Real-time Analytics
- 🤖 AI-Powered Budget Recommendations
- 💰 Expense Tracking and Categorization
- 📈 Visual Data Representation with Recharts
- 🧠 Neural Network Animated Interface
- 🔄 Real-time Data Updates
- 📱 Responsive Design

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spendsphere.git
cd spendsphere
```

2. Create environment files:

Create `.env.development` with these variables:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_MODEL=gemini-2-flash  # Specific Gemini model for better performance
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> **Note**: This project uses the `gemini-2-flash` model for faster and more efficient AI recommendations. Make sure you have access to this model in your Gemini API subscription.

Create `.env.production` with production values.

3. Install dependencies:
```bash
# Install core dependencies
npm install next@14 react react-dom typescript @types/react @types/node

# Install UI and styling dependencies
npm install tailwindcss postcss autoprefixer @heroicons/react recharts

# Install animation and icon dependencies
npm install react-icons framer-motion

# Install AI and utility dependencies
npm install @google/generative-ai date-fns

# Or install everything at once
npm install next@14 react react-dom typescript @types/react @types/node tailwindcss postcss autoprefixer @heroicons/react recharts react-icons framer-motion @google/generative-ai date-fns
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **AI Integration:** Google Gemini API
- **Animations:** Custom SVG Animations
- **State Management:** React Hooks


## 📚 Documentation

- [Project Presentation (PPT)](./ppt/SpendSphere.pptx)


## 🎯 Key Features in Detail

### AI Budget Recommendations
- Analyzes spending patterns
- Provides personalized budget allocations
- Adjusts recommendations based on financial behavior
- Real-time updates with dynamic variations

### Neural Network Interface
- Interactive background animations
- Responsive to user interactions
- Dynamic node connections
- Smooth transitions and effects

### Expense Analytics
- Real-time transaction tracking
- Category-wise breakdown
- Visual representations
- Trend analysis
