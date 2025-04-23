import React from 'react';

function Home() {
  // Array of color shades to display
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  
  // Map of shade to corresponding Tailwind class
  const shadeClasses = {
    50: 'bg-primary-50',
    100: 'bg-primary-100',
    200: 'bg-primary-200',
    300: 'bg-primary-300',
    400: 'bg-primary-400',
    500: 'bg-primary-500',
    600: 'bg-primary-600',
    700: 'bg-primary-700',
    800: 'bg-primary-800',
    900: 'bg-primary-900',
    950: 'bg-primary-950'
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary-800 dark:text-primary-200">Welcome to StackFlow</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Your application with a beautiful purple theme!
      </p>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300">Purple Theme Preview</h3>
        <div className="flex flex-wrap gap-4">
          {shades.map((shade) => (
            <div key={shade} className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded ${shadeClasses[shade]}`}></div>
              <span className="text-sm mt-1">{shade}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded shadow mr-4">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded shadow">
            Secondary Button
          </button>
        </div>
        <div className="mt-4">
          <a href="#" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-6">
            Primary Link
          </a>
          <a href="#" className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300">
            Secondary Link
          </a>
        </div>
        <div className="mt-4">
          <input 
            type="text" 
            placeholder="Input field" 
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mr-4" 
          />
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Select option</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Home;