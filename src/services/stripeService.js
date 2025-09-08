import { loadStripe } from '@stripe/stripe-js'
import { setUserTier } from './dataService'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

// Stripe configuration
const STRIPE_CONFIG = {
  PRO_PRICE_ID: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  SUCCESS_URL: `${window.location.origin}?success=true`,
  CANCEL_URL: `${window.location.origin}?canceled=true`
}

// Create checkout session for Pro subscription
export const createCheckoutSession = async (userEmail = null) => {
  try {
    const stripe = await stripePromise
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize')
    }

    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the checkout process
    const checkoutSession = {
      id: 'cs_demo_' + Date.now(),
      url: '#demo-checkout',
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [{
        price: STRIPE_CONFIG.PRO_PRICE_ID,
        quantity: 1
      }],
      success_url: STRIPE_CONFIG.SUCCESS_URL,
      cancel_url: STRIPE_CONFIG.CANCEL_URL
    }

    // For demo purposes, we'll simulate a successful upgrade
    // In production, this would redirect to Stripe Checkout
    if (window.confirm('Demo Mode: Upgrade to Pro for $15/month?\n\n(This is a simulation - no actual payment will be processed)')) {
      setUserTier('pro')
      window.location.href = STRIPE_CONFIG.SUCCESS_URL
      return { success: true, sessionId: checkoutSession.id }
    } else {
      window.location.href = STRIPE_CONFIG.CANCEL_URL
      return { success: false, error: 'User canceled checkout' }
    }

  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw new Error('Failed to create checkout session')
  }
}

// Handle successful payment (called from success page)
export const handleSuccessfulPayment = async (sessionId) => {
  try {
    // In a real implementation, you would:
    // 1. Verify the session with your backend
    // 2. Update user subscription status in your database
    // 3. Send confirmation email
    
    // For demo purposes, we'll just update local storage
    setUserTier('pro')
    
    return {
      success: true,
      message: 'Successfully upgraded to Pro! You now have unlimited access to all features.'
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      message: 'There was an issue verifying your payment. Please contact support.'
    }
  }
}

// Create customer portal session (for managing subscription)
export const createPortalSession = async (customerId) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the portal
    
    if (window.confirm('Demo Mode: Open customer portal?\n\n(This would normally redirect to Stripe Customer Portal)')) {
      return {
        success: true,
        url: '#demo-portal',
        message: 'In production, this would redirect to Stripe Customer Portal where users can manage their subscription, update payment methods, and view billing history.'
      }
    }
    
    return { success: false, error: 'User canceled portal access' }
    
  } catch (error) {
    console.error('Portal session error:', error)
    throw new Error('Failed to create portal session')
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate cancellation
    
    if (window.confirm('Demo Mode: Cancel Pro subscription?\n\n(This would normally cancel your subscription at the end of the billing period)')) {
      // Don't immediately downgrade - let them use Pro until period ends
      return {
        success: true,
        message: 'Subscription canceled. You will retain Pro access until the end of your billing period.',
        cancelAtPeriodEnd: true
      }
    }
    
    return { success: false, error: 'User canceled subscription cancellation' }
    
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    throw new Error('Failed to cancel subscription')
  }
}

// Get subscription status
export const getSubscriptionStatus = async (customerId) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll return mock data based on local storage
    
    const userTier = localStorage.getItem('diginer_user_tier') || 'free'
    
    if (userTier === 'pro') {
      return {
        status: 'active',
        tier: 'pro',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        cancelAtPeriodEnd: false,
        priceId: STRIPE_CONFIG.PRO_PRICE_ID
      }
    }
    
    return {
      status: 'inactive',
      tier: 'free',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      priceId: null
    }
    
  } catch (error) {
    console.error('Subscription status error:', error)
    return {
      status: 'error',
      tier: 'free',
      error: error.message
    }
  }
}

// Webhook handler for Stripe events (would be implemented on backend)
export const handleStripeWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        // Handle new subscription
        console.log('New subscription created:', event.data.object)
        break
        
      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', event.data.object)
        break
        
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        console.log('Subscription canceled:', event.data.object)
        break
        
      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object)
        break
        
      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object)
        break
        
      default:
        console.log('Unhandled event type:', event.type)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Webhook handling error:', error)
    return { success: false, error: error.message }
  }
}

// Pricing information
export const PRICING_INFO = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '3 analyses per day',
      '10 analyses per month',
      'Basic problem framing',
      'MECE pain points',
      'MVP suggestions'
    ],
    limitations: [
      'No 80/20 focus identification',
      'No launch blueprint',
      'No self-critique analysis',
      'Limited usage'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 15,
    features: [
      'Unlimited analyses',
      'All free features',
      '80/20 focus identification',
      'Launch blueprint generation',
      'Self-critique & validation',
      'Priority support'
    ],
    limitations: []
  }
}
