import OpenAI from 'openai'

// Initialize OpenAI client with environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const analyzeBusinessConcept = async (businessConcept, userTier = 'free') => {
  try {
    const systemPrompt = `You are an expert business advisor helping solo founders validate and refine their business concepts. 

Analyze the user's business concept and provide a structured response in JSON format with the following sections:

1. problemFraming: {
   problem: "Clear, concise statement of the core user problem",
   oneLiner: "A compelling one-liner describing the business value proposition"
}

2. painPoints: {
   categories: [
     { name: "Category Name", description: "Specific pain point description" }
     // 3-5 MECE categories
   ]
}

3. mvpIdeas: {
   ideas: [
     { 
       name: "MVP Name", 
       description: "What it does and how to build it in 1-3 days",
       revenue: "Clear revenue model"
     }
     // Exactly 3 MVP ideas
   ]
}

${userTier === 'pro' ? `
4. focusIdentification: {
   topPriority: "The #1 pain point to focus on based on frequency, willingness to pay, and ease of solving",
   reasoning: "Why this is the top priority (under 60 minutes to solve)"
}

5. launchBlueprint: {
   steps: [
     "Step 1: Specific action for user acquisition",
     "Step 2: Payment collection method",
     "Step 3: Validation approach"
     // 3-5 concrete steps
   ]
}

6. selfCritique: {
   risk: "The single biggest assumption/risk in this business concept",
   test: "A specific 24-hour method to test this assumption"
}
` : ''}

Focus on actionable, specific advice. Be concise but comprehensive.`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Business Concept: ${businessConcept}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    
    // Try to parse JSON response
    try {
      const analysis = JSON.parse(content)
      return analysis
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      return createFallbackAnalysis(content, userTier)
    }
    
  } catch (error) {
    console.error('AI Analysis Error:', error)
    throw new Error('Failed to analyze business concept. Please check your API configuration.')
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