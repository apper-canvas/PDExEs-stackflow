import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ThumbsUp, MessageSquare, Eye, ExternalLink, AlertCircle, Calendar, User, Award, Clock } from 'lucide-react'
import { formatRelativeTime } from '../utils/dateUtils'

function QuestionDetail() {
  const { questionId } = useParams()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const url = new URL(`https://api.stackexchange.com/2.3/questions/${questionId}`)
        const params = {
          order: 'desc',
          sort: 'activity',
          site: 'stackoverflow',
          filter: 'withbody' // Get the body content as well
        }
        
        url.search = new URLSearchParams(params).toString()
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.error_message) {
          throw new Error(data.error_message)
        }
        
        if (data.items && data.items.length > 0) {
          setQuestion(data.items[0])
        } else {
          throw new Error('Question not found')
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch question details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuestionDetails()
  }, [questionId])
  
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-surface-600 dark:text-surface-400">Loading question details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Error Loading Question</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Link 
                to="/" 
                className="btn btn-outline flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Questions
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Question Not Found</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              The requested question could not be found or may have been removed.
            </p>
            <Link 
              to="/" 
              className="btn btn-primary flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Questions
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-surface-500 hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to questions</span>
          </Link>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">{decodeHtml(question.title)}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Asked {formatRelativeTime(question.creation_date)}</span>
              </div>
              
              {question.last_activity_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Active {formatRelativeTime(question.last_activity_date)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{question.view_count} views</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="md:col-span-3">
                {question.body && (
                  <div 
                    className="prose dark:prose-invert max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: question.body }}
                  />
                )}
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-2">
                    <img 
                      src={question.owner.profile_image || 'https://www.gravatar.com/avatar/0?d=identicon&s=64'} 
                      alt={question.owner.display_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{question.owner.display_name}</div>
                      <div className="text-xs flex items-center gap-1 text-surface-500">
                        <Award className="w-3 h-3" />
                        <span>Reputation: {question.owner.reputation.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={question.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Stack Overflow</span>
                  </a>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Question Stats</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <ThumbsUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{question.score}</div>
                        <div className="text-xs text-surface-500">Votes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">{question.answer_count}</div>
                        <div className="text-xs text-surface-500">
                          Answers
                          {question.is_answered && (
                            <span className="ml-1 text-green-500">
                              • Answered
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {question.bounty_amount && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                          <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="font-medium">{question.bounty_amount}</div>
                          <div className="text-xs text-surface-500">Bounty</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-surface-200 dark:border-surface-700 mt-2">
                      <p className="text-xs text-surface-500">
                        Stack Exchange API does not provide answers in the basic tier. Please visit Stack Overflow to see answers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuestionDetail