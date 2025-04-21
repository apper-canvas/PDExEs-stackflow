import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpDown, ExternalLink, ThumbsUp, MessageSquare, Eye, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

function MainFeature() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('activity')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const searchInputRef = useRef(null)

  const sortOptions = [
    { value: 'activity', label: 'Activity' },
    { value: 'votes', label: 'Votes' },
    { value: 'creation', label: 'Creation Date' },
    { value: 'hot', label: 'Hot' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = new URL('https://api.stackexchange.com/2.3/questions')
      url.search = new URLSearchParams({
        order: 'desc',
        sort: sortOption,
        site: 'stackoverflow',
        page: page,
        pagesize: 10,
        ...(searchTerm && { intitle: searchTerm })
      }).toString()
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.error_message) {
        throw new Error(data.error_message)
      }
      
      setQuestions(prev => page === 1 ? data.items : [...prev, ...data.items])
      setHasMore(!data.has_more)
    } catch (err) {
      setError(err.message || 'Failed to fetch questions')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchQuestions()
  }, [sortOption, page])
  
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchQuestions()
  }
  
  const handleRefresh = () => {
    setPage(1)
    fetchQuestions()
  }
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }
  
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question)
  }
  
  const handleBackToList = () => {
    setSelectedQuestion(null)
  }
  
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }
  
  const formatDate = (timestamp) => {
    return format(new Date(timestamp * 1000), 'MMM d, yyyy')
  }

  return (
    <div className="relative">
      <motion.div 
        layout
        className="card overflow-visible"
      >
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-3 justify-between">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="input pl-10 pr-4 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            </div>
          </form>
          
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn btn-outline flex items-center gap-2"
              aria-expanded={isFilterOpen}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="btn btn-primary flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only sm:not-sr-only">Refresh</span>
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-surface-200 dark:border-surface-700"
            >
              <div className="p-4 bg-surface-50 dark:bg-surface-800">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-surface-500" />
                    <span className="text-sm font-medium">Sort by:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOption(option.value)
                          setPage(1)
                        }}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${
                          sortOption === option.value
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {selectedQuestion ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <button
                onClick={handleBackToList}
                className="mb-4 flex items-center gap-1 text-surface-500 hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to list</span>
              </button>
              
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{decodeHtml(selectedQuestion.title)}</h2>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedQuestion.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-surface-500 mb-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedQuestion.score} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{selectedQuestion.answer_count} answers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedQuestion.view_count} views</span>
                  </div>
                  <div>
                    <span>Asked on {formatDate(selectedQuestion.creation_date)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <img 
                      src={selectedQuestion.owner.profile_image || 'https://www.gravatar.com/avatar/0?d=identicon&s=32'} 
                      alt={selectedQuestion.owner.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{selectedQuestion.owner.display_name}</div>
                      <div className="text-xs text-surface-500">Reputation: {selectedQuestion.owner.reputation}</div>
                    </div>
                  </div>
                  
                  <a 
                    href={selectedQuestion.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Stack Overflow</span>
                  </a>
                </div>
                
                <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                  <p className="text-sm text-surface-600 dark:text-surface-300 italic">
                    To view the full question content and answers, please visit Stack Overflow using the link above.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Error Loading Questions</h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
                  <button 
                    onClick={handleRefresh}
                    className="btn btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : questions.length === 0 && !loading ? (
                <div className="p-8 text-center">
                  <p className="text-surface-600 dark:text-surface-400 mb-4">No questions found. Try a different search term or filter.</p>
                  <button 
                    onClick={handleRefresh}
                    className="btn btn-primary"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-surface-200 dark:divide-surface-700">
                  <AnimatePresence>
                    {questions.map((question) => (
                      <motion.li
                        key={question.question_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group"
                      >
                        <button
                          onClick={() => handleQuestionClick(question)}
                          className="w-full text-left p-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                        >
                          <div className="flex justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors text-balance">
                                {decodeHtml(question.title)}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {question.tags.slice(0, 4).map(tag => (
                                  <span key={tag} className="tag">
                                    {tag}
                                  </span>
                                ))}
                                {question.tags.length > 4 && (
                                  <span className="tag">+{question.tags.length - 4}</span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-surface-500">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{question.score}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{question.answer_count}</span>
                                </div>
                                <div>
                                  <span>{formatDate(question.creation_date)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <img 
                                src={question.owner.profile_image || 'https://www.gravatar.com/avatar/0?d=identicon&s=32'} 
                                alt={question.owner.display_name}
                                className="w-8 h-8 rounded-full"
                              />
                            </div>
                          </div>
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
              
              {!error && (
                <div className="p-4 flex justify-center">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-primary rounded-full animate-spin"></div>
                      <span className="text-surface-600 dark:text-surface-400">Loading...</span>
                    </div>
                  ) : hasMore ? (
                    <button
                      onClick={handleLoadMore}
                      className="btn btn-outline"
                    >
                      Load More
                    </button>
                  ) : (
                    <p className="text-sm text-surface-500">No more questions to load</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MainFeature