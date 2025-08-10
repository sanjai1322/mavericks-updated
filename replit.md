# Mavericks Coding Platform

## Overview

The Mavericks Coding Platform is a comprehensive coding education application built with modern web technologies. It provides interactive coding assessments, personalized learning paths, hackathons, competitive programming features, and progress tracking. The platform aims to create an engaging environment where developers can learn, compete, and grow their programming skills through hands-on challenges and community interaction.

## Recent Changes (August 10, 2025)

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

### Assessment System Overhaul
- Fixed critical assessment evaluation bugs - now correctly grades submissions
- Added 15+ new coding challenges across Easy/Medium/Hard difficulty levels
- Enhanced function name matching for both Python and JavaScript
- Improved JSON output parsing and comparison logic
- Added comprehensive quiz-based assessments for progressive learning
- Categories: Math, Arrays, Strings, Search Algorithms, Sorting, Data Structures

### Technical Improvements
- Fixed JSON parsing errors in authentication flow
- Resolved nested anchor tag warnings in navigation
- Added proper TypeScript types for API responses
- Enhanced error handling and logging for debugging
- Fixed LSP errors and code structure issues
- Improved skill extraction with better fallback handling

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Planned AI Integration
- **Agent-Based Architecture**: Modular AI agents for different platform functions
  - ProfileAgent: User learning pattern analysis and profile recommendations
  - AssessmentAgent: Code evaluation, feedback generation, and test case creation
  - RecommenderAgent: Personalized learning path and challenge recommendations
  - HackathonAgent: Team formation, project ideas, and submission evaluation
  - TrackerAgent: Progress analytics, goal setting, and performance insights

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