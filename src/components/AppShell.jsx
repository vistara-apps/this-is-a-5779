import React from 'react'
import { Crown, Menu, X } from 'lucide-react'
import { useState } from 'react'

const AppShell = ({ children, userTier, onToggleTier, onUpgrade }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Diginer+</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white/80">
              <Crown className="h-4 w-4" />
              <span className="text-sm">
                {userTier === 'pro' ? 'Pro User' : 'Free User'}
              </span>
            </div>
            
            <button
              onClick={userTier === 'pro' ? onToggleTier : onUpgrade}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                userTier === 'pro'
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {userTier === 'pro' ? 'Pro Active' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center space-x-2 text-white/80">
                <Crown className="h-4 w-4" />
                <span className="text-sm">
                  {userTier === 'pro' ? 'Pro User' : 'Free User'}
                </span>
              </div>
              
              <button
                onClick={userTier === 'pro' ? onToggleTier : onUpgrade}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  userTier === 'pro'
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {userTier === 'pro' ? 'Pro Active' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}

export default AppShell
