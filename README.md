# ConvrsayIt: Language Learning App

ConvrsayIt is a language learning application built with React Native and Expo, designed to help users learn conversational phrases for real-world situations.

## Features

- **Activity-Based Phrases:** Learn phrases organized by everyday activities
- **Interactive Flashcards:** Swipe through phrase cards with pronunciation, grammar notes, and slang alternatives
- **AI-Generated Content:** Dynamic phrase generation via OpenAI integration
- **Progress Tracking:** Track reviewed phrases and mastery level

## Project Architecture

For detailed information about the application architecture, design decisions, and code organization, see the [ARCHITECTURE.md](./ARCHITECTURE.md) document.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   
   Create a `.env` file in the root directory with:
   
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   EXPO_PUBLIC_APP_ENV=development
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```
   
   For testing on external devices, use tunnel mode:
   
   ```bash
   npx expo start --tunnel
   ```

## Development Workflow

### Code Organization

The project follows a feature-based organization structure:

- `src/components/`: Reusable UI components
- `src/screens/`: Screen components
- `src/services/`: API and data services
- `src/utils/`: Utility functions
- `src/constants/`: Shared constants
- `src/types/`: TypeScript type definitions

### Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator
- `npm run ios`: Run on iOS simulator
- `npm run web`: Run in web browser
- `npm run lint`: Run ESLint

## Technologies

- React Native / Expo
- Redux Toolkit
- React Navigation
- TypeScript
- Supabase
- OpenAI API

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [React Native documentation](https://reactnative.dev/docs/getting-started): Reference for React Native components and APIs.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
