# Mavericks Coding Platform

## Overview
The Mavericks Coding Platform is a comprehensive coding education application designed to provide an engaging environment for developers to learn, compete, and grow programming skills. It offers interactive coding assessments, personalized learning paths, hackathons, competitive programming features, and progress tracking. The platform aims to foster skill development through hands-on challenges and community interaction.

## User Preferences
Preferred communication style: Simple, everyday language.
Feature priorities: Resume upload functionality and AI-powered career recommendations working properly.
Testing approach: Prefers sample solutions to verify assessment functionality.
Recent requirements: Fix resume upload issues and integrate OpenAI/free API for career AI features.

## System Architecture

### Frontend Architecture
- **Technology Stack**: React 18 with TypeScript, Vite build system.
- **Styling**: Tailwind CSS with shadcn/ui for consistent and accessible UI.
- **State Management**: TanStack Query for server state management and data fetching.
- **Routing**: Wouter for client-side routing.
- **Animations**: Framer Motion for smooth transitions and interactive elements.
- **Theming**: Custom dark/light theme implementation with localStorage persistence.

### Backend Architecture
- **Technology Stack**: Node.js with Express and TypeScript.
- **Authentication**: JWT-based authentication with HTTP-only cookies and bcrypt password hashing.
- **Database ORM**: Drizzle ORM for type-safe PostgreSQL operations.
- **API Structure**: Modular, controller-based RESTful API for various features.
- **Storage**: Interface-based storage abstraction for database flexibility.

### Design System
- **Branding**: Dark purple (#1E003E) primary color with gold (#FFD700) accents.
- **Typography**: Poppins font family.
- **Responsiveness**: Mobile-first approach with adaptive layouts.
- **Components**: shadcn/ui for consistent, accessible UI elements.

### Database Schema
- **Key Entities**: Users (profiles, auth, gamification), Assessments (challenges, test cases), Learning Paths, Hackathons, Progress Tracking (submissions, activity).

### Security Architecture
- **Password Security**: Bcrypt hashing.
- **Token-Based Auth**: JWT tokens with HTTP-only cookie storage.
- **Route Protection**: Middleware for protected endpoints.
- **Input Validation**: Zod schema validation.

### AI Integration
- **Agent-Based Architecture**: Modular AI agents for specific functions:
    - **ProfileAgent**: User learning pattern analysis.
    - **AssessmentAgent**: Code evaluation and feedback.
    - **RecommendationAgent**: Personalized learning paths and challenge recommendations.
    - **ResumeAgent**: Advanced resume parsing, NLP, and skill extraction.
    - **HackathonAgent**: Team formation and submission evaluation.
    - **TrackerAgent**: Progress analytics and goal setting.

### Python FastAPI Resume Parser
- **Functionality**: Standalone Python backend for multi-format (PDF, DOCX) resume processing.
- **NLP**: spaCy integration for advanced text analysis and Named Entity Recognition.
- **Skill Detection**: Recognition of technical and soft skills.
- **Information Extraction**: Contact information, experience years, and education background.
- **Quality Metrics**: Confidence scoring.
- **API**: REST API with Swagger/OpenAPI documentation.

### Recommendation Engine Features
- **Smart Problem Scoring**: Multi-factor analysis of user performance, difficulty, and topic mastery.
- **AI-Enhanced Insights**: Intelligent learning path suggestions.
- **Adaptive Difficulty**: Dynamic adjustment based on performance.
- **Skill Gap Analysis**: Identification of weak areas.
- **Personalized Challenges**: Daily coding challenges tailored to skill level.
- **Learning Velocity Tracking**: Categorization of users for optimal challenge selection.

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection.
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM.
- **@radix-ui/***: Unstyled, accessible UI primitives.
- **@tanstack/react-query**: Data synchronization for React.

### Authentication & Security
- **jsonwebtoken**: JWT token handling.
- **bcrypt**: Password hashing.

### AI/ML APIs
- **HUGGINGFACE_API_KEY**: For AI skill analysis (fallback for OpenRouter).
- **OPENROUTER_API_KEY**: For advanced AI recommendations and insights.

### Code Execution
- **RAPIDAPI_KEY (Judge0)**: For real-time code execution and assessment of multiple programming languages.

### Other Integrations
- **connect-pg-simple**: PostgreSQL session store.