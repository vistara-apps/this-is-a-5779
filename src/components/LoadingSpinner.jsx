import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="glass-card rounded-lg p-8 text-center max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-white/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-white">
          <p className="font-medium">Analyzing your business concept...</p>
          <p className="text-sm opacity-80 mt-1">This may take a few moments</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner