import React from 'react'
import { Crown, Lock } from 'lucide-react'

const FeatureToggle = ({ 
  variant = 'pro', 
  isEnabled = false, 
  onToggle, 
  children,
  className = ''
}) => {
  if (variant === 'pro') {
    return (
      <div className={`relative ${className}`}>
        {!isEnabled && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center text-white">
              <Crown className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="font-medium text-sm">Pro Feature</p>
              <button
                onClick={onToggle}
                className="mt-2 px-3 py-1 bg-accent text-white text-xs rounded-md hover:bg-accent/90 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
        
        <div className={!isEnabled ? 'opacity-30 pointer-events-none' : ''}>
          {children}
        </div>
      </div>
    )
  }
  
  // Default locked feature
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
        <div className="text-center text-white">
          <Lock className="h-6 w-6 mx-auto mb-2" />
          <p className="font-medium text-sm">Feature Locked</p>
        </div>
      </div>
      
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  )
}

export default FeatureToggle
