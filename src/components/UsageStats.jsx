import React from 'react'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'
import { getUsageStats, FREE_TIER_LIMITS } from '../services/dataService'

const UsageStats = ({ userTier }) => {
  const stats = getUsageStats()
  
  if (userTier === 'pro') {
    return (
      <div className="glass-card rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-white mb-3">
          <TrendingUp className="h-4 w-4" />
          <h3 className="font-medium">Usage Statistics</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-accent">{stats.todaySessions}</p>
            <p className="text-xs text-white/70">Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{stats.thisMonthSessions}</p>
            <p className="text-xs text-white/70">This Month</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{stats.totalSessions}</p>
            <p className="text-xs text-white/70">Total</p>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-white/60">
            ✨ Pro User - Unlimited analyses
          </p>
        </div>
      </div>
    )
  }
  
  // Free tier usage display
  const dailyProgress = (stats.todaySessions / FREE_TIER_LIMITS.DAILY_ANALYSES) * 100
  const monthlyProgress = (stats.thisMonthSessions / FREE_TIER_LIMITS.MONTHLY_ANALYSES) * 100
  
  return (
    <div className="glass-card rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 text-white mb-3">
        <BarChart3 className="h-4 w-4" />
        <h3 className="font-medium">Usage Limits</h3>
      </div>
      
      <div className="space-y-3">
        {/* Daily Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-white/80">Daily</span>
            <span className="text-sm text-white/80">
              {stats.todaySessions}/{FREE_TIER_LIMITS.DAILY_ANALYSES}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                dailyProgress >= 100 ? 'bg-red-500' : dailyProgress >= 80 ? 'bg-yellow-500' : 'bg-accent'
              }`}
              style={{ width: `${Math.min(dailyProgress, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Monthly Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-white/80">Monthly</span>
            <span className="text-sm text-white/80">
              {stats.thisMonthSessions}/{FREE_TIER_LIMITS.MONTHLY_ANALYSES}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                monthlyProgress >= 100 ? 'bg-red-500' : monthlyProgress >= 80 ? 'bg-yellow-500' : 'bg-accent'
              }`}
              style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {(dailyProgress >= 100 || monthlyProgress >= 100) && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-200 text-center">
            Limit reached! Upgrade to Pro for unlimited analyses.
          </p>
        </div>
      )}
      
      {(dailyProgress >= 80 || monthlyProgress >= 80) && (dailyProgress < 100 && monthlyProgress < 100) && (
        <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-200 text-center">
            Approaching limit! Consider upgrading to Pro.
          </p>
        </div>
      )}
    </div>
  )
}

export default UsageStats
