import { v4 as uuidv4 } from 'uuid'

// Local storage keys
const STORAGE_KEYS = {
  USER_DATA: 'diginer_user_data',
  CONCEPT_SESSIONS: 'diginer_concept_sessions',
  USER_TIER: 'diginer_user_tier'
}

// User data management
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export const setUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
    return true
  } catch (error) {
    console.error('Error setting user data:', error)
    return false
  }
}

export const createUser = (email = null) => {
  const userData = {
    userId: uuidv4(),
    email: email,
    subscriptionTier: 'free',
    createdAt: new Date().toISOString()
  }
  
  setUserData(userData)
  return userData
}

// User tier management
export const getUserTier = () => {
  try {
    const tier = localStorage.getItem(STORAGE_KEYS.USER_TIER)
    return tier || 'free'
  } catch (error) {
    console.error('Error getting user tier:', error)
    return 'free'
  }
}

export const setUserTier = (tier) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_TIER, tier)
    return true
  } catch (error) {
    console.error('Error setting user tier:', error)
    return false
  }
}

// Concept session management
export const getConceptSessions = () => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEYS.CONCEPT_SESSIONS)
    return sessions ? JSON.parse(sessions) : []
  } catch (error) {
    console.error('Error getting concept sessions:', error)
    return []
  }
}

export const saveConceptSession = (sessionData) => {
  try {
    const sessions = getConceptSessions()
    const newSession = {
      sessionId: uuidv4(),
      userId: getUserData()?.userId || 'anonymous',
      timestamp: new Date().toISOString(),
      inputMarkdown: sessionData.input,
      generatedOutputJson: sessionData.analysis,
      refinedProblem: sessionData.analysis?.problemFraming?.problem,
      painPointsArray: sessionData.analysis?.painPoints?.categories || [],
      mvpIdeasArray: sessionData.analysis?.mvpIdeas?.ideas || [],
      launchBlueprint: sessionData.analysis?.launchBlueprint,
      selfCritique: sessionData.analysis?.selfCritique
    }
    
    sessions.unshift(newSession) // Add to beginning of array
    
    // Keep only last 50 sessions to prevent storage bloat
    const trimmedSessions = sessions.slice(0, 50)
    
    localStorage.setItem(STORAGE_KEYS.CONCEPT_SESSIONS, JSON.stringify(trimmedSessions))
    return newSession
  } catch (error) {
    console.error('Error saving concept session:', error)
    return null
  }
}

export const getConceptSession = (sessionId) => {
  try {
    const sessions = getConceptSessions()
    return sessions.find(session => session.sessionId === sessionId) || null
  } catch (error) {
    console.error('Error getting concept session:', error)
    return null
  }
}

export const deleteConceptSession = (sessionId) => {
  try {
    const sessions = getConceptSessions()
    const filteredSessions = sessions.filter(session => session.sessionId !== sessionId)
    localStorage.setItem(STORAGE_KEYS.CONCEPT_SESSIONS, JSON.stringify(filteredSessions))
    return true
  } catch (error) {
    console.error('Error deleting concept session:', error)
    return false
  }
}

// Usage analytics (for free tier limits)
export const getUsageStats = () => {
  const sessions = getConceptSessions()
  const today = new Date().toDateString()
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  const todaySessions = sessions.filter(session => 
    new Date(session.timestamp).toDateString() === today
  )
  
  const thisMonthSessions = sessions.filter(session => {
    const sessionDate = new Date(session.timestamp)
    return sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear
  })
  
  return {
    totalSessions: sessions.length,
    todaySessions: todaySessions.length,
    thisMonthSessions: thisMonthSessions.length,
    lastSessionDate: sessions.length > 0 ? sessions[0].timestamp : null
  }
}

// Free tier limits
export const FREE_TIER_LIMITS = {
  DAILY_ANALYSES: 3,
  MONTHLY_ANALYSES: 10
}

export const canUserAnalyze = (userTier = 'free') => {
  if (userTier === 'pro') {
    return { canAnalyze: true, reason: null }
  }
  
  const stats = getUsageStats()
  
  if (stats.todaySessions >= FREE_TIER_LIMITS.DAILY_ANALYSES) {
    return { 
      canAnalyze: false, 
      reason: `Daily limit reached (${FREE_TIER_LIMITS.DAILY_ANALYSES} analyses per day)` 
    }
  }
  
  if (stats.thisMonthSessions >= FREE_TIER_LIMITS.MONTHLY_ANALYSES) {
    return { 
      canAnalyze: false, 
      reason: `Monthly limit reached (${FREE_TIER_LIMITS.MONTHLY_ANALYSES} analyses per month)` 
    }
  }
  
  return { canAnalyze: true, reason: null }
}

// Initialize user if not exists
export const initializeUser = () => {
  let userData = getUserData()
  if (!userData) {
    userData = createUser()
  }
  return userData
}
