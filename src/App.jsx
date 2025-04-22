import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
          <header className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-primary-700 dark:text-primary-300">
              StackFlow
            </h1>
            <ThemeToggle />
          </header>
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Add your existing routes here */}
            </Routes>
          </main>
          
          <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} StackFlow. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Placeholder Home component - replace with your actual component
function Home() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary-800 dark:text-primary-200">Welcome to StackFlow</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Your application with a beautiful purple theme!
      </p>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300">Purple Theme Preview</h3>
        <div className="flex flex-wrap gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded bg-primary-${shade}`}></div>
              <span className="text-sm mt-1">{shade}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button className="mr-4">Primary Button</button>
          <button className="bg-secondary-600 hover:bg-secondary-700">Secondary Button</button>
        </div>
        <div className="mt-4">
          <a href="#" className="mr-6">Primary Link</a>
          <a href="#" className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300">
            Secondary Link
          </a>
        </div>
        <div className="mt-4">
          <input type="text" placeholder="Input field" className="mr-4" />
          <select className="bg-white dark:bg-gray-800">
            <option>Select option</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;