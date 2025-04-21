import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpDown, ExternalLink, ThumbsUp, MessageSquare, Eye, ChevronLeft, ChevronRight, RefreshCw, AlertCircle, ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { formatRelativeTime } from '../utils/dateUtils'

function MainFeature() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('activity')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState('')
  const searchInputRef = useRef(null)

  const sortOptions = [
    { value: 'activity', label: 'Activity' },
    { value: 'votes', label: 'Votes' },
    { value: 'creation', label: 'Creation Date' },
    { value: 'hot', label: 'Hot' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]

  const pageSizeOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
  ]

  // Check URL for tag parameter on component mount
  useEffect(() => {
    const url = new URL(window.location.href)
    const tagParam = url.searchParams.get('tagged')
    if (tagParam) {
      setTagFilter(tagParam)
    }
  }, [])

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = new URL('https://api.stackexchange.com/2.3/questions')
      // Always include 'c#' as a default tag
      let taggedValue = 'c#'
      
      // If there's a user-specified tag filter, combine it with the default c# tag
      if (tagFilter && tagFilter !== 'c#') {
        taggedValue = `${taggedValue};${tagFilter}`
      }
      
      const params = {
        order: 'desc',
        sort: sortOption,
        site: 'stackoverflow',
        page: page,
        pagesize: pageSize,
        tagged: taggedValue, // Always include c# tag
        ...(searchTerm && { intitle: searchTerm })
      }
      
      url.search = new URLSearchParams(params).toString()
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.error_message) {
        throw new Error(data.error_message)
      }
      
      setQuestions(data.items)
      setHasMore(!data.has_more)
      // Calculate total pages based on total and pageSize
      // Stack API doesn't provide exact count, so we estimate
      const estimatedTotal = data.has_more ? (data.quota_max || 1000) : (page * pageSize)
      setTotalItems(estimatedTotal)
      setTotalPages(Math.ceil(estimatedTotal / pageSize))
    } catch (err) {
      setError(err.message || 'Failed to fetch questions')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchQuestions()
  }, [sortOption, page, pageSize, tagFilter])
  
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchQuestions()
  }
  
  const handleRefresh = () => {
    setPage(1)
    fetchQuestions()
  }
  
  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setPage(1) // Reset to first page when changing page size
  }
  
  const handleQuestionClick = (question) => {
    navigate(`/questions/${question.question_id}`)
  }
  
  const clearTagFilter = () => {
    setTagFilter('')
    // Update URL by removing the tagged parameter
    const url = new URL(window.location.href)
    url.searchParams.delete('tagged')
    window.history.pushState({}, '', url)
    setPage(1)
  }
  
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    // Determine which page numbers to show
    let pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first page, last page, and current page
      pageNumbers.push(1);
      
      // Determine the range around the current page
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      
      // Adjust to show up to 3 pages in the middle
      if (start === 2) end = Math.min(totalPages - 1, start + 2);
      if (end === totalPages - 1) start = Math.max(2, end - 2);
      
      // Add ellipsis if needed
      if (start > 2) pageNumbers.push('...');
      
      // Add the pages around the current page
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (end < totalPages - 1) pageNumbers.push('...');
      
      pageNumbers.push(totalPages);
    }
    
    return (
      <div className="flex items-center justify-center gap-1 mt-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={page === 1 || loading}
          className={`p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-700 ${
            page === 1 || loading ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed' : 'text-surface-600 dark:text-surface-300'
          }`}
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className={`p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-700 ${
            page === 1 || loading ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed' : 'text-surface-600 dark:text-surface-300'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {pageNumbers.map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-surface-400">...</span>
          ) : (
            <button
              key={`page-${pageNum}`}
              onClick={() => handlePageChange(pageNum)}
              disabled={loading}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                page === pageNum 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={page === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        ))}
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading || questions.length === 0}
          className={`p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-700 ${
            page === totalPages || loading || questions.length === 0
              ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed' 
              : 'text-surface-600 dark:text-surface-300'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages || loading || questions.length === 0}
          className={`p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-700 ${
            page === totalPages || loading || questions.length === 0
              ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed' 
              : 'text-surface-600 dark:text-surface-300'
          }`}
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

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
        
        {/* Tag filter indicator */}
        {tagFilter && (
          <div className="px-4 py-2 bg-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filtered by tag:</span>
              <span className="tag bg-primary text-white">{tagFilter}</span>
            </div>
            <button 
              onClick={clearTagFilter} 
              className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              aria-label="Clear tag filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-surface-200 dark:border-surface-700"
            >
              <div className="p-4 bg-surface-50 dark:bg-surface-800">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Page size:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {pageSizeOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handlePageSizeChange(option.value)}
                          className={`px-3 py-1 text-sm rounded-full transition-all ${
                            pageSize === option.value
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
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
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {tagFilter ? 
                  `No questions found with tag '${tagFilter}'. Try a different filter or clear the tag.` : 
                  'No questions found. Try a different search term or filter.'}
              </p>
              <div className="flex gap-2 justify-center">
                {tagFilter && (
                  <button 
                    onClick={clearTagFilter}
                    className="btn btn-outline"
                  >
                    Clear Tag Filter
                  </button>
                )}
                <button 
                  onClick={handleRefresh}
                  className="btn btn-primary"
                >
                  Refresh
                </button>
              </div>
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
                              <span key={tag} className={`tag ${tag === tagFilter ? 'bg-primary text-white' : ''}`}>
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
                              <span>{formatRelativeTime(question.creation_date)}</span>
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
            <div className="p-4 flex flex-col items-center">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-primary rounded-full animate-spin"></div>
                  <span className="text-surface-600 dark:text-surface-400">Loading...</span>
                </div>
              ) : questions.length > 0 ? (
                <div className="w-full">
                  <div className="flex justify-center mb-4">
                    {renderPagination()}
                  </div>
                  <div className="text-center text-sm text-surface-500">
                    Page {page} of {totalPages > 0 ? totalPages : 1} 
                    {totalItems > 0 && ` • Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalItems)} of about ${totalItems} results`}
                    {tagFilter && ` • Filtered by tag: ${tagFilter}`}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MainFeature