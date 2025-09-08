import React, { useState } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'

const InputArea = ({ onAnalyze, isLoading, error, userTier, onUpgrade }) => {
  const [businessConcept, setBusinessConcept] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAnalyze(businessConcept)
  }

  const placeholderText = `Describe your business idea or problem you want to solve...

Examples:
• "I want to help remote workers stay focused during video calls"
• "Small restaurants struggle with inventory management"
• "Freelancers have trouble tracking time across multiple projects"`

  return (
    <div className="glass-card rounded-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="business-concept" className="block text-white font-medium mb-2">
            What's your business concept or problem?
          </label>
          <textarea
            id="business-concept"
            value={businessConcept}
            onChange={(e) => setBusinessConcept(e.target.value)}
            placeholder={placeholderText}
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="flex items-center justify-between p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
            {error.includes('limit') && userTier === 'free' && (
              <button
                onClick={onUpgrade}
                className="px-3 py-1 bg-accent text-white text-xs rounded-md hover:bg-accent/90 transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !businessConcept.trim()}
          className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 glow-effect"
        >
          <Sparkles className="h-5 w-5" />
          <span>{isLoading ? 'Analyzing...' : 'Generate Analysis'}</span>
        </button>
      </form>
    </div>
  )
}

export default InputArea
