import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent glow-effect',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white/50',
    outline: 'bg-transparent text-white border border-white/30 hover:bg-white/10 focus:ring-white/50'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg'
  }
  
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.md
  
  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  )
}

export default Button
