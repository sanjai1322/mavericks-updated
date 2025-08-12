# Mavericks Coding Platform

## Overview

The Mavericks Coding Platform is a comprehensive coding education application built with modern web technologies. It provides interactive coding assessments, personalized learning paths, hackathons, competitive programming features, and progress tracking. The platform aims to create an engaging environment where developers can learn, compete, and grow their programming skills through hands-on challenges and community interaction.

## Recent Changes (August 10, 2025)

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
  - HackathonAgent: Team formation, project ideas, and submission evaluation
  - TrackerAgent: Progress analytics, goal setting, and performance insights

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