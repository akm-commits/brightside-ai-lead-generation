# Overview

Brightside AI is a B2B cold email lead generation agency website built as a single-page application. The platform showcases conversion-focused marketing services targeting marketing agencies and SaaS companies. The site emphasizes mathematical precision in design using Fibonacci sequences and golden ratio proportions, with a premium aesthetic inspired by platforms like Stripe and Linear.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18+ with TypeScript**: Modern functional components using hooks for state management
- **Single Page Application**: Uses Wouter for client-side routing with minimal overhead
- **Component-Based Design**: Modular architecture with reusable UI components organized by feature

## Design System
- **Shadcn/UI Component Library**: Comprehensive set of accessible UI components built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Mathematical Layout System**: Fibonacci-based spacing and golden ratio proportions for visual harmony
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## State Management
- **TanStack Query**: Server state management for API calls and caching
- **React Hook Form**: Form state management with validation
- **Local Component State**: React hooks for UI-specific state

## UI Components
- **Radix UI Primitives**: Accessible, unstyled components for complex interactions
- **Lucide React Icons**: Consistent iconography throughout the application
- **Custom Components**: Business-specific components like ClientLogos, HeroSection, TestimonialsSection

## Build System
- **Vite**: Fast development server and build tool optimized for modern frontend development
- **TypeScript Strict Mode**: Type safety with comprehensive error checking
- **ESBuild**: Fast JavaScript/TypeScript compilation for production builds

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware support
- **Modular Route Structure**: Organized API endpoints with prefix /api
- **Memory Storage Interface**: Abstracted storage layer supporting future database integration

## Data Layer
- **Drizzle ORM**: Type-safe database queries with schema validation
- **PostgreSQL Ready**: Configured for PostgreSQL with Neon serverless support
- **Schema Validation**: Zod integration for runtime type checking

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Connect PG Simple**: PostgreSQL session store for Express sessions

## UI Libraries
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Feather-inspired icon library

## Development Tools
- **Replit Integration**: Development environment with hot reload and error handling
- **Vite Plugins**: Runtime error modal and cartographer for enhanced development experience

## Third-Party Integrations
- **Google Fonts (Inter)**: Typography system for mathematical precision
- **Calendar Booking**: Placeholder for appointment scheduling integration (to be implemented)
- **Form Handling**: Contact form submissions with validation

## Testing & Validation
- **React Hook Form Resolvers**: Form validation with schema integration
- **Zod**: Runtime type validation and schema definition
- **TypeScript**: Compile-time type checking and IDE support