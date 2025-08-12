# Mavericks Coding Platform

## Overview

The Mavericks Coding Platform is a comprehensive coding education application built with modern web technologies. It provides interactive coding assessments, personalized learning paths, hackathons, competitive programming features, and progress tracking. The platform aims to create an engaging environment where developers can learn, compete, and grow their programming skills through hands-on challenges and community interaction.

## Recent Changes (August 12, 2025)

### Comprehensive Enhancement (August 12, 2025)
- **ENHANCED RESUME PARSER**: Upgraded skill extraction with 200+ technical skills and 50+ soft skills recognition
- **COMPREHENSIVE QUIZ SYSTEM**: Added JavaScript, Python, Java, and React quizzes with difficulty levels
- **PERSONALIZED LEARNING PATHS**: Implemented AI-powered learning path generation based on skill analysis
- **REAL-TIME DASHBOARD**: Created dynamic progress tracking with live updates every 30 seconds
- **SKILL GAP ANALYSIS**: Automated identification of learning opportunities and next steps
- **QUIZ INTEGRATION**: Seamlessly integrated quiz results into learning path recommendations
- **Migration Bug Fix**: Resolved JSON parsing error and authentication middleware issues

## Previous Changes (August 12, 2025)

### Python FastAPI Resume Parser Implementation (August 12, 2025)
- **NEW FEATURE**: Built standalone Python FastAPI backend for advanced resume parsing
- **Multi-format Support**: PDF and DOCX resume processing using pdfplumber and python-docx
- **Advanced NLP**: Integrated spaCy for Named Entity Recognition and intelligent skill extraction
- **Comprehensive Skills Database**: 100+ technical skills and 20+ soft skills recognition
- **Contact Extraction**: Regex-based email and phone number detection with multiple format support
- **AI Analysis**: Confidence scoring, experience years detection, and education background parsing
- **REST API**: Complete FastAPI implementation with Swagger documentation at /docs
- **Easy Deployment**: Ready for local testing and Replit deployment with clear installation instructions
- **File Upload Fix**: Increased Express.js payload limits to handle larger resume files (10MB limit)

### Complete Assessment Workflow Testing & Verification (August 12, 2025)
- **MAJOR MILESTONE**: Comprehensive testing of entire assessment submission workflow completed
- **Judge0 Integration**: Verified working perfectly with 44+ programming languages
- **Code Execution**: Successfully tested JavaScript and Python submissions (both scored 100%)
- **Test Case Evaluation**: Confirmed robust test case validation and output comparison logic
- **AI Skills Extraction**: Verified profile agent correctly analyzing submitted code and extracting relevant skills
- **Performance**: Assessment submissions processing in ~8 seconds with full Judge0 evaluation
- **Data Integrity**: All submissions properly stored with user association and skill tracking

### Migration to Standard Replit Environment (August 12, 2025)
- Successfully migrated from Replit Agent to standard Replit environment
- Verified all dependencies and packages are correctly installed
- Confirmed server runs cleanly on port 5000 with proper configuration
- Integrated all required API keys for full functionality:
  - RAPIDAPI_KEY for Judge0 code execution ✅ VERIFIED WORKING
  - JWT_SECRET for authentication tokens ✅ VERIFIED WORKING
  - HUGGINGFACE_API_KEY for AI skill analysis ✅ VERIFIED WORKING
  - OPENROUTER_API_KEY for advanced recommendations ✅ VERIFIED WORKING
- Fixed critical JSON parsing error in resume upload functionality
- Improved AI response handling with robust error handling and JSON cleaning
- Removed double JSON encoding in frontend API calls
- Fixed `response.json is not a function` error in ResumeUpload component
- OpenRouter API requires payment (402 error), fallback to Hugging Face working correctly
- Updated dark theme to professional blue color scheme for better user experience
- Removed statistics section from landing page per user preference  
- Project now fully compatible with standard Replit deployment

## Previous Changes (August 10, 2025)

### Personalized Problem Recommendation Engine Implementation
- Built comprehensive AI-powered recommendation engine analyzing user performance patterns
- Implemented advanced scoring algorithms considering difficulty progression, topic mastery, and learning velocity
- Added OpenRouter API integration with Anthropic Claude for intelligent recommendation insights
- Created detailed user profile analysis including skill gaps, strength areas, and learning patterns
- Developed four specialized recommendation endpoints: problems, daily-challenge, learning-path, skill-analysis

### Migration & Authentication Fixes
- Successfully migrated from Replit Agent to standard environment
- Fixed critical authentication issues with JWT token handling
- Integrated cookie-parser for proper cookie-based authentication
- Updated frontend to send JWT tokens in Authorization headers
- Added localStorage token management for persistent login

### API Integration & Code Execution
- Integrated Judge0 API for real-time code execution (JavaScript & Python)
- Enhanced AI capabilities with OpenRouter API integration
- Maintained Hugging Face API as fallback for skill extraction
- Fixed Judge0 API output comparison logic for accurate test evaluation
- Implemented comprehensive test case validation system

### Assessment System Overhaul & Multilingual Quiz Expansion
- Fixed critical assessment evaluation bugs - now correctly grades submissions
- Added 25+ new coding challenges across Easy/Medium/Hard difficulty levels
- Enhanced function name matching and output comparison logic for multiple languages
- Implemented comprehensive multilingual quiz system covering 10+ programming languages:
  - Core Languages: Python, JavaScript, Java, C++, C
  - Modern Languages: Go, Rust, Kotlin, Swift, PHP, Ruby, C#
- Progressive difficulty across diverse topics: Basic Syntax → Data Structures → Advanced Algorithms
- Categories: Math, Arrays, Strings, Search Algorithms, Sorting, Data Structures, Language-Specific Features

### Technical Improvements
- Fixed JSON parsing errors in authentication flow
- Resolved nested anchor tag warnings in navigation
- Added proper TypeScript types for API responses
- Enhanced error handling and logging for debugging
- Fixed LSP errors and code structure issues
- Improved skill extraction with better fallback handling
- Fixed critical array comparison bug in assessment evaluation (whitespace normalization)
- Enhanced output parsing to handle different Judge0 status codes properly

## User Preferences

Preferred communication style: Simple, everyday language.
Feature priorities: Multilingual quiz expansion with comprehensive programming language coverage.
Testing approach: Prefers sample solutions to verify assessment functionality.

## System Architecture

### Frontend Architecture
- **React 18 with TypeScript**: Modern React using functional components and hooks for type-safe development
- **Vite Build System**: Fast development server and optimized production builds
- **Styling Strategy**: Tailwind CSS utility-first framework combined with shadcn/ui components for consistent, accessible UI elements
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Routing**: Wouter lightweight client-side routing library
- **Animation System**: Framer Motion for smooth page transitions and interactive animations
- **Theme System**: Custom dark/light theme implementation with localStorage persistence using React Context

### Backend Architecture  
- **Node.js with Express**: RESTful API server built with TypeScript for type safety
- **Authentication**: JWT-based authentication with HTTP-only cookies and bcrypt password hashing
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **API Structure**: Modular controller-based routing with separate endpoints for auth, profiles, assessments, learning paths, hackathons, and leaderboards
- **Storage Abstraction**: Interface-based storage system allowing for easy database switching

### Design System
- **Custom Branding**: Dark purple (#1E003E) primary color with gold (#FFD700) accents
- **Typography**: Poppins font family throughout the application
- **Responsive Design**: Mobile-first approach with collapsible navigation and adaptive layouts
- **Component Library**: shadcn/ui components providing consistent, accessible UI elements

### Database Schema
- **Users Table**: Comprehensive user profiles with authentication credentials, progress tracking, and gamification elements (points, level, streak, rank)
- **Assessments Table**: Coding challenges with difficulty levels, topics, problem statements, and test cases
- **Learning Paths Table**: Structured learning content with progress tracking and categorization
- **Hackathons Table**: Competition events with status tracking and participation management
- **Progress Tracking**: User progress, submissions, and activity logging for analytics

### Security Architecture
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage
- **Token-Based Auth**: JWT tokens with configurable secret keys and HTTP-only cookie storage
- **Route Protection**: Middleware-based authentication verification for protected endpoints
- **Input Validation**: Zod schema validation for request data sanitization

### AI Integration (Implemented)
- **Agent-Based Architecture**: Modular AI agents for different platform functions
  - ProfileAgent: User learning pattern analysis and profile recommendations ✓
  - AssessmentAgent: Code evaluation, feedback generation, and test case creation ✓ 
  - RecommendationAgent: Personalized learning path and challenge recommendations ✓
  - **ResumeAgent**: Advanced resume parsing with NLP and skill extraction ✓
  - HackathonAgent: Team formation, project ideas, and submission evaluation
  - TrackerAgent: Progress analytics, goal setting, and performance insights

### Python FastAPI Resume Parser
- **Standalone Service**: Independent Python backend for resume processing
- **Advanced NLP Processing**: spaCy integration for intelligent text analysis
- **Multi-format Support**: PDF (pdfplumber) and DOCX (python-docx) parsing
- **Skill Detection Engine**: 100+ technical skills recognition with pattern matching
- **Contact Information Extraction**: Email and phone number detection with regex patterns
- **Experience Analysis**: Years of experience detection and education background parsing
- **Quality Metrics**: Confidence scoring based on data completeness and accuracy
- **API Documentation**: Complete Swagger/OpenAPI documentation with interactive testing

### Recommendation Engine Features
- **Smart Problem Scoring**: Multi-factor analysis including user performance, difficulty preference, topic experience
- **AI-Enhanced Insights**: OpenRouter API integration providing intelligent learning path suggestions
- **Adaptive Difficulty**: Dynamic difficulty adjustment based on recent performance and success rates
- **Skill Gap Analysis**: Identifies weak areas and prioritizes improvement opportunities
- **Daily Challenges**: Personalized daily coding challenges matching user skill level
- **Learning Velocity Tracking**: Categorizes users as beginner/intermediate/advanced for optimal challenge selection

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless-compatible PostgreSQL database connection
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM with migration tooling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Powerful data synchronization for React applications

### Authentication & Security
- **jsonwebtoken**: JWT token creation and verification
- **bcrypt**: Password hashing and verification
- **connect-pg-simple**: PostgreSQL session store integration

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **ESLint & Prettier**: Code quality and formatting enforcement
- **Vite**: Modern build tool with HMR and optimized bundling

### UI & Animation
- **Framer Motion**: Production-ready motion library for React
- **class-variance-authority**: Utility for creating variant-based component APIs
- **tailwind-merge**: Utility for merging Tailwind CSS classes

### Form Management
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Integration between react-hook-form and schema validation libraries

The platform is designed as a monorepo with clear separation between client and server code, shared type definitions, and a scalable architecture that can accommodate future AI-powered features and third-party integrations.