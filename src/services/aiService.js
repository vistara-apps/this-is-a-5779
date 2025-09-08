import OpenAI from 'openai'

// Initialize OpenAI client with environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const analyzeBusinessConcept = async (businessConcept, userTier = 'free') => {
  try {
    const systemPrompt = `You are an expert business advisor helping solo founders validate and refine their business concepts. You have deep experience in lean startup methodology, product-market fit, and rapid MVP development.

CRITICAL: You MUST respond with valid JSON only. No additional text, explanations, or markdown formatting.

Analyze the user's business concept and provide a structured response in this EXACT JSON format:

{
  "problemFraming": {
    "problem": "Clear, concise statement of the core user problem (1-2 sentences)",
    "oneLiner": "A compelling one-liner describing the business value proposition"
  },
  "painPoints": {
    "categories": [
      {
        "name": "Primary Pain Category",
        "description": "Specific pain point description with real-world impact"
      },
      {
        "name": "Secondary Pain Category", 
        "description": "Another specific pain point with measurable consequences"
      },
      {
        "name": "Tertiary Pain Category",
        "description": "Additional pain point that compounds the problem"
      }
    ]
  },
  "mvpIdeas": {
    "ideas": [
      {
        "name": "Quick Validation MVP",
        "description": "Specific MVP that can be built in 1-3 days with exact implementation steps",
        "revenue": "Clear revenue model with pricing strategy"
      },
      {
        "name": "Manual Service MVP",
        "description": "Service-based MVP approach with step-by-step execution plan",
        "revenue": "Revenue model with specific pricing and payment method"
      },
      {
        "name": "Content-First MVP",
        "description": "Content-driven MVP with distribution and engagement strategy",
        "revenue": "Monetization approach with clear value exchange"
      }
    ]
  }${userTier === 'pro' ? `,
  "focusIdentification": {
    "topPriority": "The #1 pain point to focus on based on frequency, willingness to pay, and ease of solving (under 60 minutes)",
    "reasoning": "Detailed explanation of why this is the top priority with specific criteria analysis"
  },
  "launchBlueprint": {
    "steps": [
      "Step 1: Specific user acquisition action with target numbers",
      "Step 2: Payment collection setup with exact tools/platforms",
      "Step 3: Validation method with success metrics",
      "Step 4: Feedback collection and iteration process",
      "Step 5: Scale preparation and next milestone"
    ]
  },
  "selfCritique": {
    "risk": "The single biggest assumption/risk in this business concept with potential impact",
    "test": "A specific 24-hour method to test this assumption with measurable outcomes"
  }` : ''}
}

Guidelines:
- Be specific and actionable, not generic
- Include real numbers, timeframes, and concrete steps
- Focus on rapid validation and quick wins
- Consider the target market's actual behavior and willingness to pay
- Prioritize solutions that can be tested quickly and cheaply`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Business Concept: ${businessConcept}

Please analyze this concept and provide actionable insights in the exact JSON format specified. Focus on practical, implementable advice that a solo founder can execute immediately.` }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = response.choices[0].message.content.trim()
    
    // Clean up the response to ensure it's valid JSON
    let cleanContent = content
    if (content.startsWith('```json')) {
      cleanContent = content.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (content.startsWith('```')) {
      cleanContent = content.replace(/```\n?/, '').replace(/\n?```$/, '')
    }
    
    // Try to parse JSON response
    try {
      const analysis = JSON.parse(cleanContent)
      
      // Validate the structure
      if (!analysis.problemFraming || !analysis.painPoints || !analysis.mvpIdeas) {
        throw new Error('Invalid analysis structure')
      }
      
      return analysis
    } catch (parseError) {
      console.warn('JSON parsing failed, using fallback analysis:', parseError)
      // If JSON parsing fails, create a structured response from the text
      return createFallbackAnalysis(content, userTier)
    }
    
  } catch (error) {
    console.error('AI Analysis Error:', error)
    
    // Provide more specific error messages
    if (error.message.includes('API key')) {
      throw new Error('API key not configured. Please check your environment variables.')
    } else if (error.message.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.')
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection and try again.')
    } else {
      throw new Error('Failed to analyze business concept. Please try again or contact support if the issue persists.')
    }
  }
}

// Fallback function to create structured analysis if JSON parsing fails
const createFallbackAnalysis = (content, userTier) => {
  const analysis = {
    problemFraming: {
      problem: "Core problem identification needed",
      oneLiner: "Business value proposition to be refined"
    },
    painPoints: {
      categories: [
        { name: "Primary Pain", description: "Main user frustration" },
        { name: "Secondary Issues", description: "Supporting problems" },
        { name: "Market Gaps", description: "Unmet needs in the market" }
      ]
    },
    mvpIdeas: {
      ideas: [
        { 
          name: "Quick Validation MVP", 
          description: "Simple landing page with signup to test demand",
          revenue: "Pre-order or waitlist model"
        },
        { 
          name: "Manual Service MVP", 
          description: "Provide the service manually before building automation",
          revenue: "Direct service fees"
        },
        { 
          name: "Content-First MVP", 
          description: "Create valuable content around the problem space",
          revenue: "Sponsored content or premium access"
        }
      ]
    }
  }

  if (userTier === 'pro') {
    analysis.focusIdentification = {
      topPriority: "Focus on the most urgent and solvable pain point",
      reasoning: "Prioritize based on user feedback and market validation"
    }
    
    analysis.launchBlueprint = {
      steps: [
        "Create simple landing page",
        "Set up payment processing",
        "Launch to target audience",
        "Collect user feedback",
        "Iterate based on data"
      ]
    }
    
    analysis.selfCritique = {
      risk: "Assumption that users will pay for this solution",
      test: "Create a simple survey or prototype to test willingness to pay"
    }
  }

  return analysis
}
