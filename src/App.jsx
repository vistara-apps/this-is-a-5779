import React, { useState } from 'react'
import AppShell from './components/AppShell'
import InputArea from './components/InputArea'
import OutputCard from './components/OutputCard'
import LoadingSpinner from './components/LoadingSpinner'
import { analyzeBusinessConcept } from './services/aiService'

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [userTier, setUserTier] = useState('free') // 'free' or 'pro'

  const handleAnalysis = async (businessConcept) => {
    if (!businessConcept.trim()) {
      setError('Please enter your business concept')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    
    try {
      const result = await analyzeBusinessConcept(businessConcept, userTier)
      setAnalysis(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleTier = () => {
    setUserTier(prev => prev === 'free' ? 'pro' : 'free')
  }

  return (
    <div className="min-h-screen gradient-bg">
      <AppShell userTier={userTier} onToggleTier={toggleTier}>
        <div className="max-w-6xl mx-auto px-6 py-8">
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

          {/* Input Section */}
          <div className="mb-8">
            <InputArea 
              onAnalyze={handleAnalysis}
              isLoading={isAnalyzing}
              error={error}
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
              <h2 className="text-2xl font-semibold text-white text-center mb-8">
                Your Business Concept Analysis
              </h2>
              
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
                />
                
                <OutputCard
                  title="Launch Blueprint"
                  type="launch-blueprint"
                  data={analysis.launchBlueprint}
                  isPro={userTier === 'pro'}
                />
                
                <OutputCard
                  title="Self-Critique"
                  type="self-critique"
                  data={analysis.selfCritique}
                  isPro={userTier === 'pro'}
                />
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </div>
  )
}

export default App