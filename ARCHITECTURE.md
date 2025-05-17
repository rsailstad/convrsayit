# ConversayIt Architecture

This document describes the architecture and design decisions of the ConversayIt application.

## Overview

ConversayIt is a language learning application built with React Native and Expo. It helps users learn new languages through conversational phrases organized by activities (like ordering coffee, asking for directions, etc).

## Technical Stack

- **Frontend:** React Native + Expo
- **State Management:** Redux (Redux Toolkit)
- **Backend:** Supabase
- **AI Integration:** OpenAI GPT-4 API
- **Navigation:** React Navigation
- **Storage:** AsyncStorage + Expo SecureStore
- **Language:** JavaScript / TypeScript

## Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/           # Screen components
├── navigation/        # Navigation configuration
├── store/             # Redux store setup
├── services/          # API and data services
├── utils/             # Utility functions
├── constants/         # Shared constants & values
├── config/            # App configuration
├── theme/             # Styling and theming
├── types/             # TypeScript type definitions
├── db/                # Database utilities
├── models/            # Data models
├── assets/            # Static assets
└── mocks/             # Mock data for development
```

## Core Architecture Decisions

### 1. API Layer Design

The API layer is organized into domain-specific services (activity service, phrase service, user service) that provide a consistent interface for data operations. Key features:

- **Unified Interface:** All API methods follow a consistent pattern
- **Error Handling:** Centralized error handling with proper logging
- **Caching:** API responses are cached in memory and persistently
- **Backward Compatibility:** Aliases preserve backward compatibility

### 2. State Management

Redux is used for global state management with a focused approach:

- **Redux Toolkit:** Simplifies Redux boilerplate
- **Slice Pattern:** State is divided into logical slices
- **Local State:** Component-level state for UI concerns

### 3. Code Organization

- **Feature-Based:** Components and screens are organized by feature
- **Shared Utils:** Common functionality extracted to utility files
- **Constants:** Shared values centralized in constants files

### 4. TypeScript Integration

- **Progressive Adoption:** TypeScript is gradually implemented
- **Interface-First:** Types are defined before implementation
- **Strong Typing:** API responses and component props are typed

### 5. Error Handling

- **Error Boundaries:** React Error Boundaries catch component errors
- **Standardized UI:** Consistent error presentation
- **Graceful Fallbacks:** When services fail, fallbacks are provided

### 6. AI Integration

The application integrates with OpenAI's GPT-4 API for dynamic phrase generation:

- **Secure Key Management:** API keys are stored securely
- **Environment Configuration:** Environment variables control behavior
- **Fallback Mechanism:** Static data is used if AI generation fails

## Key Components

### PhraseCard

The PhraseCard is a core component that displays language learning content. It includes:

- **Swipeable Cards:** Users can swipe between phrases
- **Interactive Elements:** Listen, mark as reviewed, etc.
- **Multiple Data Sources:** Static API data or AI-generated content

### API Service

The API service provides data access for the application:

- **Caching:** Response caching reduces API calls
- **Domain-Specific Services:** Organized by entity type
- **Consistent Interface:** Standard response handling

### Error Handling

Error handling is standardized across the application:

- **Error Boundary:** Catches errors in component trees
- **Error Component:** Displays errors consistently
- **Error Fallbacks:** Graceful degradation when errors occur

## Authentication Flow

1. User signs in through Supabase authentication
2. JWT token is stored securely
3. Auth state is kept in Redux store
4. Protected routes require authentication
5. Token refresh is handled automatically

## Data Flow

1. Components request data through services
2. Services check cache for data
3. If not cached, services fetch from API
4. Results are cached for future use
5. Data is transformed to UI format
6. Components render the formatted data

## Future Considerations

- **Offline Support:** Improve offline capabilities
- **Test Coverage:** Add comprehensive tests
- **Performance Optimization:** Optimize render performance
- **Accessibility:** Enhance accessibility features
- **Internationalization:** Support for more languages 