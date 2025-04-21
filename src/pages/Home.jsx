import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'

function Home() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-[80vh] flex flex-col items-center justify-center"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-t-4 border-secondary animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-4 text-surface-600 dark:text-surface-400 font-medium">Loading questions...</p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Explore C# Stack Overflow Questions
              </h1>
              <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                Browse through the latest C# and related tag questions from the Stack Overflow community.
                Filter, search, and discover C# programming solutions.
              </p>
            </div>
            
            <MainFeature />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Home