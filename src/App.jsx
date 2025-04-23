import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import Home from './components/Home';

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;