# MindCare - Mental Health AI Chatbot

A complete, production-ready full-stack mental health AI chatbot web application designed to provide supportive therapy-like conversations and journaling features for mental wellness.

## ⚠️ Important Medical Disclaimer

**MindCare is NOT a substitute for professional mental health care, therapy, or medical treatment.** This AI chatbot is designed to provide supportive conversations and coping strategies, but it cannot diagnose, treat, or cure mental health conditions. 

**If you are experiencing a mental health crisis or emergency, please contact:**
- Emergency Services: 911
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- National Alliance on Mental Illness (NAMI): 1-800-950-NAMI

## Features

### ✨ Core Features
- **AI-Powered Chat Support**: Supportive conversations using OpenAI's GPT models with CBT-informed responses
- **Digital Journaling**: Rich text editor for daily reflection and mood tracking
- **Mood Analytics**: Visual dashboard with mood trends and insights
- **Crisis Detection**: Automatic detection of crisis keywords with immediate resource suggestions
- **Secure Authentication**: JWT-based auth with refresh tokens and secure session management

### 🛡️ Security & Privacy
- End-to-end encryption for sensitive data
- PII redaction before AI processing
- Content sanitization and validation
- Rate limiting and CORS protection
- Secure password hashing (bcrypt)
- RBAC system for potential therapist roles

### 📱 User Experience
- Responsive design with dark/light themes
- Accessible interface with keyboard navigation
- Progressive Web App capabilities
- Real-time chat with streaming responses
- Crisis resource integration

## Architecture

### Tech Stack
```
Frontend:  React 18 + Vite + TypeScript + Tailwind CSS
Backend:   Node.js + Express + TypeScript + MongoDB
AI:        OpenAI GPT-3.5/4 with custom prompts
Auth:      JWT + Refresh Tokens + HttpOnly Cookies
Database:  MongoDB with Mongoose ODM
Security:  Helmet, CORS, Rate Limiting, Input Validation
```

### Project Structure
```
├── apps/
│   ├── web/          # React frontend application
│   └── server/       # Node.js backend API
├── packages/
│   └── shared/       # Shared types and utilities
├── .devcontainer/    # Development container config
├── .github/          # CI/CD workflows
└── docker-compose.yml
```

## 🚀 Quick Start

### 1. One-Click Development (GitHub Codespaces)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Srikar131/mental-health-app)

The development environment will automatically:
- Install all dependencies
- Start MongoDB in Docker
- Start both frontend and backend servers
- Seed demo data
- Forward ports for easy access

### 2. Local Development

#### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

#### Setup
```bash
# Clone the repository
git clone https://github.com/Srikar131/mental-health-app.git
cd mental-health-app

# Install dependencies
npm install

# Start MongoDB
docker compose up mongo -d

# Set up environment variables
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

# Edit the .env files with your configuration
# Required: OPENAI_API_KEY, MONGO_URI, JWT secrets

# Seed demo data
npm run seed

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/healthz

### 3. Demo User
When `SEED_DEMO=true`, a demo account is created:
- Email: `demo@mindcare.app`
- Password: `demo123456`

## Environment Variables

### Backend (.env)
```bash
# Required
MONGO_URI=mongodb://localhost:27017/mental-health-app
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
OPENAI_API_KEY=your-openai-api-key-here

# Optional
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
SEED_DEMO=true
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_NODE_ENV=development
```

## 🚀 Deployment

### Render.com (Recommended)

1. **Fork this repository**

2. **Connect to Render:**
   - Go to [Render Dashboard](https://render.com)
   - Create new Blueprint
   - Connect your GitHub repo
   - Deploy using `render.yaml`

3. **Set Environment Variables:**
   ```bash
   OPENAI_API_KEY=your-actual-openai-api-key
   ```

4. **Optional CI/CD:**
   Add these secrets to your GitHub repo:
   ```bash
   RENDER_API_KEY=your-render-api-key
   RENDER_WEB_SERVICE_ID=your-web-service-id
   RENDER_API_SERVICE_ID=your-api-service-id
   ```

### Railway (Alternative)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### Docker Production
```bash
# Build and run with Docker Compose
docker compose --profile production up -d
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Type checking
npm run typecheck

# Build for production
npm run build
```

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login    - User login
POST /api/auth/refresh  - Token refresh
POST /api/auth/logout   - User logout
POST /api/auth/forgot   - Password reset request
POST /api/auth/reset    - Password reset
```

### Chat Endpoints
```
GET  /api/chat/sessions     - Get user chat sessions
POST /api/chat/sessions     - Create new chat session
GET  /api/chat/stream       - Server-sent events for streaming
POST /api/chat              - Send message to AI
DELETE /api/chat/:sessionId - Delete chat session
```

### Journal Endpoints
```
GET    /api/notes      - Get user journal entries
POST   /api/notes      - Create new journal entry
GET    /api/notes/:id  - Get specific entry
PATCH  /api/notes/:id  - Update journal entry
DELETE /api/notes/:id  - Delete journal entry
GET    /api/notes/export - Export notes (PDF/Markdown)
```

### Mood Tracking
```
GET  /api/mood       - Get mood logs
POST /api/mood       - Log mood entry
GET  /api/mood/stats - Get mood analytics
```

### User Management
```
GET    /api/user/me - Get current user profile
PATCH  /api/user/me - Update user profile
DELETE /api/user/me - Delete user account
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow semantic commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Crisis Resources

### United States
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357
- **National Alliance on Mental Illness**: 1-800-950-NAMI

### International
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/
- **Befrienders Worldwide**: https://www.befrienders.org/

## Support

For technical support or questions about this application:
- Create an issue on GitHub
- Email: support@mindcare.app (placeholder)

---

**Remember**: This application is a supportive tool and should never replace professional mental health care. If you're struggling with your mental health, please reach out to a qualified professional.
