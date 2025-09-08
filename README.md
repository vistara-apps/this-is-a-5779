# Diginer+ - Business Concept Validation Platform

**Tagline:** Sharpen Your Business Concept Instantly

Diginer+ helps solo founders and builders clarify and validate their business concepts by breaking down core problems and identifying high-impact solutions through AI-powered analysis.

## 🚀 Features

### Core Features (Free Tier)
- **Problem Framing**: Get a clear one-liner for your business idea
- **MECE Pain Point Breakdown**: Comprehensive problem space analysis
- **MVP Suggestions**: 3 actionable MVP ideas with revenue models
- **Usage Limits**: 3 analyses per day, 10 per month

### Pro Features ($15/month)
- **Unlimited Analyses**: No usage restrictions
- **80/20 Focus Identification**: Prioritize high-impact problems
- **Launch Blueprint**: Step-by-step launch strategy
- **Self-Critique & Validation**: Risk assessment and testing methods

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI GPT-4 (via OpenRouter)
- **Payments**: Stripe for subscription management
- **Storage**: LocalStorage for session persistence
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- OpenAI API key (or OpenRouter API key)
- Stripe account for payment processing

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diginer-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
   VITE_STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎨 Design System

The application follows a cohesive design system with:

### Colors
- **Primary**: `hsl(210, 90%, 50%)` - Main brand color
- **Accent**: `hsl(140, 60%, 45%)` - Call-to-action color
- **Background**: Gradient from `#667eea` to `#764ba2`
- **Surface**: Glass morphism with `rgba(255, 255, 255, 0.1)`

### Typography
- **Display**: Large headings (3rem, bold)
- **Heading**: Section titles (1.5rem, semibold)
- **Body**: Regular text (1rem, normal)
- **Caption**: Small text (0.875rem, medium)

### Components
- **Glass Cards**: Backdrop blur with subtle borders
- **Buttons**: Primary, secondary, and outline variants
- **Feature Toggles**: Pro feature gating with upgrade prompts

## 📊 Data Model

### User Entity
```javascript
{
  userId: UUID,
  email: string,
  subscriptionTier: 'free' | 'pro',
  createdAt: ISO8601
}
```

### ConceptSession Entity
```javascript
{
  sessionId: UUID,
  userId: UUID,
  timestamp: ISO8601,
  inputMarkdown: string,
  generatedOutputJson: object,
  refinedProblem: string,
  painPointsArray: array,
  mvpIdeasArray: array,
  launchBlueprint: object,
  selfCritique: object
}
```

## 🔄 User Flows

### New User Flow
1. User lands on homepage
2. Enters business concept in input area
3. System checks usage limits (free tier)
4. AI analyzes concept and returns structured insights
5. Results displayed with Pro features locked
6. User can upgrade to unlock advanced features

### Pro User Flow
1. User upgrades via Stripe checkout
2. Gains unlimited analyses access
3. All features unlocked including:
   - 80/20 Focus Identification
   - Launch Blueprint Generation
   - Self-Critique & Validation

## 🔐 API Integration

### OpenAI Integration
- Uses GPT-4 via OpenRouter for cost efficiency
- Structured prompts for consistent JSON responses
- Fallback analysis for parsing failures
- Comprehensive error handling

### Stripe Integration
- Subscription-based billing model
- Customer portal for subscription management
- Webhook handling for subscription events
- Demo mode for development testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables (Production)
Set these in your hosting platform:
- `VITE_OPENAI_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PRO_PRICE_ID`

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or similar
- **Backend**: Node.js server for Stripe webhooks (future enhancement)

## 📈 Business Model

### Freemium SaaS
- **Free Tier**: Limited usage to drive adoption
- **Pro Tier**: $15/month for unlimited access
- **Target Market**: Solo founders, indie builders, entrepreneurs

### Revenue Projections
- Conversion rate: 5-10% free to paid
- Monthly churn: <5% (high value proposition)
- Customer LTV: $180+ (12+ month retention)

## 🔒 Security & Privacy

- No sensitive data stored permanently
- API keys secured via environment variables
- Local storage for session persistence only
- Stripe handles all payment processing

## 🧪 Testing

### Manual Testing Checklist
- [ ] Free tier usage limits enforced
- [ ] Pro upgrade flow works
- [ ] AI analysis generates valid responses
- [ ] Error handling for API failures
- [ ] Responsive design on mobile/desktop
- [ ] Session persistence across page reloads

### Future Enhancements
- [ ] Unit tests with Jest/React Testing Library
- [ ] E2E tests with Playwright
- [ ] Performance monitoring
- [ ] Analytics integration

## 📝 Development Notes

### Code Organization
```
src/
├── components/          # Reusable UI components
├── services/           # API and business logic
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

### Key Services
- `aiService.js`: OpenAI integration and prompt management
- `dataService.js`: Local storage and session management
- `stripeService.js`: Payment processing and subscription logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical issues or feature requests, please contact the development team.

---

**Built with ❤️ for solo founders and indie builders**
