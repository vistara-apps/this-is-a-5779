import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import InputArea from './components/InputArea'
import OutputCard from './components/OutputCard'
import LoadingSpinner from './components/LoadingSpinner'
import UsageStats from './components/UsageStats'
import Button from './components/Button'
import { analyzeBusinessConcept } from './services/aiService'
import { 
  initializeUser, 
  getUserTier, 
  setUserTier, 
  saveConceptSession, 
  canUserAnalyze 
} from './services/dataService'
import { createCheckoutSession, handleSuccessfulPayment } from './services/stripeService'

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [userTier, setUserTierState] = useState('free')
  const [currentInput, setCurrentInput] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Initialize user and check for successful payment on component mount
  useEffect(() => {
    // Initialize user data
    initializeUser()
    
    // Get current user tier
    const tier = getUserTier()
    setUserTierState(tier)
    
    // Check for successful payment
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      handleSuccessfulPayment().then(result => {
        if (result.success) {
          setShowSuccessMessage(true)
          setUserTierState('pro')
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      })
    }
  }, [])

  const handleAnalysis = async (businessConcept) => {
    if (!businessConcept.trim()) {
      setError('Please enter your business concept')
      return
    }

    // Check usage limits
    const usageCheck = canUserAnalyze(userTier)
    if (!usageCheck.canAnalyze) {
      setError(usageCheck.reason)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setCurrentInput(businessConcept)
    
    try {
      const result = await analyzeBusinessConcept(businessConcept, userTier)
      setAnalysis(result)
      
      // Save the session
      saveConceptSession({
        input: businessConcept,
        analysis: result
      })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      await createCheckoutSession()
    } catch (err) {
      setError('Failed to start upgrade process. Please try again.')
    }
  }

  const toggleTier = () => {
    const newTier = userTier === 'free' ? 'pro' : 'free'
    setUserTier(newTier)
    setUserTierState(newTier)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <AppShell userTier={userTier} onToggleTier={toggleTier} onUpgrade={handleUpgrade}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-center">
                🎉 Successfully upgraded to Pro! You now have unlimited access to all features.
              </p>
              <div className="text-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSuccessMessage(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Diginer+
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              Sharpen Your Business Concept Instantly
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Clarify and validate your business concepts by breaking down core problems and identifying high-impact solutions.
            </p>
          </div>

          {/* Usage Stats */}
          <div className="max-w-md mx-auto mb-8">
            <UsageStats userTier={userTier} />
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <InputArea 
              onAnalyze={handleAnalysis}
              isLoading={isAnalyzing}
              error={error}
              userTier={userTier}
              onUpgrade={handleUpgrade}
            />
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="flex justify-center mb-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Results Section */}
          {analysis && !isAnalyzing && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Your Business Concept Analysis
                </h2>
                <p className="text-white/70 text-sm">
                  Based on: "{currentInput.substring(0, 100)}{currentInput.length > 100 ? '...' : ''}"
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <OutputCard
                  title="Problem Framing"
                  type="problem-framing"
                  data={analysis.problemFraming}
                  isPro={false}
                />
                
                <OutputCard
                  title="MECE Pain Points"
                  type="pain-points"
                  data={analysis.painPoints}
                  isPro={false}
                />
                
                <OutputCard
                  title="MVP Suggestions"
                  type="mvp-ideas"
                  data={analysis.mvpIdeas}
                  isPro={false}
                />
                
                <OutputCard
                  title="80/20 Focus"
                  type="focus-identification"
                  data={analysis.focusIdentification}
                  isPro={userTier === 'pro'}
                  onUpgrade={handleUpgrade}
                />
                
                <OutputCard
                  title="Launch Blueprint"
                  type="launch-blueprint"
                  data={analysis.launchBlueprint}
                  isPro={userTier === 'pro'}
                  onUpgrade={handleUpgrade}
                />
                
                <OutputCard
                  title="Self-Critique"
                  type="self-critique"
                  data={analysis.selfCritique}
                  isPro={userTier === 'pro'}
                  onUpgrade={handleUpgrade}
                />
              </div>

              {/* Pro Features CTA */}
              {userTier === 'free' && (
                <div className="mt-12 text-center">
                  <div className="glass-card rounded-lg p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Unlock Advanced Features
                    </h3>
                    <p className="text-white/80 mb-6">
                      Get unlimited analyses, 80/20 focus identification, launch blueprints, and self-critique validation to accelerate your business success.
                    </p>
                    <Button onClick={handleUpgrade} size="lg">
                      Upgrade to Pro - $15/month
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AppShell>
    </div>
  )
}

export default App
