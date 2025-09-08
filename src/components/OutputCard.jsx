import React from 'react'
import { 
  Target, 
  Lightbulb, 
  LayoutGrid, 
  Focus, 
  Rocket, 
  Shield,
  Lock,
  Crown
} from 'lucide-react'

const iconMap = {
  'problem-framing': Target,
  'pain-points': LayoutGrid,
  'mvp-ideas': Lightbulb,
  'focus-identification': Focus,
  'launch-blueprint': Rocket,
  'self-critique': Shield
}

const OutputCard = ({ title, type, data, isPro, onUpgrade }) => {
  const Icon = iconMap[type] || Target
  const isLocked = isPro === false && (type === 'focus-identification' || type === 'launch-blueprint' || type === 'self-critique')

  if (isLocked) {
    return (
      <div className="glass-card rounded-lg p-6 relative">
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-white">
            <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <p className="font-medium">Pro Feature</p>
            <p className="text-sm opacity-80 mb-3">Upgrade to unlock</p>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="px-3 py-1 bg-accent text-white text-xs rounded-md hover:bg-accent/90 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
        
        <div className="opacity-30">
          <div className="flex items-center space-x-2 text-white mb-4">
            <Icon className="h-5 w-5" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center space-x-2 text-white mb-4">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      
      <div className="text-white/90 space-y-3">
        {type === 'problem-framing' && (
          <div>
            <p className="font-medium mb-2">Core Problem:</p>
            <p className="text-sm leading-relaxed">{data?.problem}</p>
            {data?.oneLiner && (
              <>
                <p className="font-medium mb-2 mt-4">One-Liner:</p>
                <p className="text-sm leading-relaxed italic">"{data.oneLiner}"</p>
              </>
            )}
          </div>
        )}
        
        {type === 'pain-points' && (
          <div className="space-y-3">
            {data?.categories?.map((category, index) => (
              <div key={index} className="border-l-2 border-accent pl-3">
                <p className="font-medium text-sm">{category.name}</p>
                <p className="text-xs opacity-80">{category.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {type === 'mvp-ideas' && (
          <div className="space-y-3">
            {data?.ideas?.map((idea, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <p className="font-medium text-sm mb-1">{idea.name}</p>
                <p className="text-xs opacity-80 mb-2">{idea.description}</p>
                <p className="text-xs text-accent font-medium">Revenue: {idea.revenue}</p>
              </div>
            ))}
          </div>
        )}
        
        {type === 'focus-identification' && (
          <div className="space-y-2">
            <p className="font-medium text-sm">Top Priority:</p>
            <p className="text-sm leading-relaxed">{data?.topPriority}</p>
            <p className="font-medium text-sm mt-3">Why:</p>
            <p className="text-sm leading-relaxed">{data?.reasoning}</p>
          </div>
        )}
        
        {type === 'launch-blueprint' && (
          <div className="space-y-2">
            <p className="font-medium text-sm">Launch Strategy:</p>
            <ul className="text-sm space-y-1">
              {data?.steps?.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-accent font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {type === 'self-critique' && (
          <div className="space-y-2">
            <p className="font-medium text-sm">Biggest Risk:</p>
            <p className="text-sm leading-relaxed">{data?.risk}</p>
            <p className="font-medium text-sm mt-3">24h Test:</p>
            <p className="text-sm leading-relaxed">{data?.test}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputCard
