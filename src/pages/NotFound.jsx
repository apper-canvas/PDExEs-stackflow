import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home as HomeIcon } from 'lucide-react'

function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center"
    >
      <div className="mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block relative"
        >
          <div className="text-9xl font-bold text-surface-200 dark:text-surface-800">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">404</div>
          </div>
        </motion.div>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/"
        className="btn btn-primary flex items-center gap-2"
      >
        <HomeIcon size={18} />
        <span>Back to Home</span>
      </Link>
    </motion.div>
  )
}

export default NotFound