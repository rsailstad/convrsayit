# Authentication Logic for convrSAYit (Rails Backend & React Native Frontend)

This document outlines the authentication flow, backend API endpoints, and frontend considerations for user authentication in the convrSAYit application.

## 1. Authentication Flows

### 1.1. Email/Password Authentication

**Registration:**
1.  **Frontend (React Native):** User enters email, password, and password confirmation.
2.  **Frontend:** Client-side validation (e.g., password strength, email format).
3.  **Frontend:** Sends registration request to backend API (`POST /api/v1/users` or `/api/v1/auth/register`).
4.  **Backend (Rails):**
    *   Validates input (email uniqueness, password presence).
    *   Hashes the password (e.g., using `bcrypt`).
    *   Creates a new `User` record in the PostgreSQL database.
    *   Generates a JWT (JSON Web Token) or session token for the new user.
5.  **Backend:** Returns the token and user details (excluding sensitive info like password hash) or an error message.
6.  **Frontend:** Stores the token securely (e.g., AsyncStorage in React Native) and navigates the user to the app's main interface or dashboard.

**Login:**
1.  **Frontend (React Native):** User enters email and password.
2.  **Frontend:** Sends login request to backend API (`POST /api/v1/auth/login`).
3.  **Backend (Rails):**
    *   Finds the user by email.
    *   If user exists, compares the provided password with the stored hash using `bcrypt`.
    *   If credentials are valid, generates a new JWT or session token.
4.  **Backend:** Returns the token and user details or an error message.
5.  **Frontend:** Stores the token and navigates the user to the app.

**Logout:**
1.  **Frontend (React Native):** User initiates logout.
2.  **Frontend:** Removes the stored token.
3.  **Frontend:** (Optional) Sends a request to a backend API endpoint (`DELETE /api/v1/auth/logout`) to invalidate the token on the server-side if using a denylist or server-managed sessions.
4.  **Frontend:** Navigates the user to the login screen.

### 1.2. Social Login (Google/Facebook - OAuth 2.0)

This is a general outline. Specific implementation will depend on the chosen OAuth libraries (e.g., `omniauth` gem for Rails, Firebase Auth, or React Native specific SDKs).

**General Flow:**
1.  **Frontend (React Native):** User clicks "Login with Google" or "Login with Facebook".
2.  **Frontend:** Initiates OAuth flow using a relevant SDK or by opening a web view to the provider's authentication page.
3.  **Provider (Google/Facebook):** User authenticates with the provider and authorizes the app.
4.  **Provider:** Redirects back to the app (or a predefined redirect URI) with an authorization code or an access token.
5.  **Frontend:** Sends this code/token to the backend API (`POST /api/v1/auth/google` or `/api/v1/auth/facebook`).
6.  **Backend (Rails):**
    *   Verifies the received code/token with the OAuth provider.
    *   Retrieves user information (email, name, provider ID) from the provider.
    *   Finds or creates a user in the local database based on the provider ID or email.
        *   If user exists (matched by email or provider ID), link the social account if not already linked.
        *   If user does not exist, create a new user record.
    *   Generates a JWT or session token for the user.
7.  **Backend:** Returns the token and user details.
8.  **Frontend:** Stores the token and navigates the user to the app.

## 2. Backend API Endpoints (Rails Example)

These endpoints would typically be versioned (e.g., `/api/v1/...`).

*   **`POST /api/v1/users` (or `/api/v1/auth/register`) - Registration**
    *   **Request Body:**
        ```json
        {
          "user": {
            "email": "user@example.com",
            "password": "password123",
            "password_confirmation": "password123",
            "native_language": "English", // Optional
            "learning_level": "Beginner" // Optional
          }
        }
        ```
    *   **Success Response (201 Created):**
        ```json
        {
          "token": "your_jwt_or_session_token",
          "user": {
            "id": 1,
            "email": "user@example.com",
            "native_language": "English",
            "learning_level": "Beginner"
          }
        }
        ```
    *   **Error Response (422 Unprocessable Entity):**
        ```json
        {
          "errors": {
            "email": ["has already been taken"],
            "password": ["is too short (minimum is 8 characters)"]
          }
        }
        ```

*   **`POST /api/v1/auth/login` - Login**
    *   **Request Body:**
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    *   **Success Response (200 OK):** (Same as registration success)
    *   **Error Response (401 Unauthorized):**
        ```json
        {
          "error": "Invalid email or password"
        }
        ```

*   **`DELETE /api/v1/auth/logout` - Logout (Optional Server-Side Invalidation)**
    *   Requires authentication (sending the token).
    *   **Success Response (204 No Content or 200 OK):**
    *   **Error Response (401 Unauthorized):** If token is invalid or not provided.

*   **`POST /api/v1/auth/google` - Google OAuth Callback/Token Exchange**
    *   **Request Body:**
        ```json
        {
          "auth_token": "google_auth_code_or_id_token"
        }
        ```
    *   **Success Response (200 OK):** (Same as registration success)
    *   **Error Response (401 Unauthorized or 422 Unprocessable Entity):**

*   **`POST /api/v1/auth/facebook` - Facebook OAuth Callback/Token Exchange**
    *   **Request Body:**
        ```json
        {
          "auth_token": "facebook_access_token"
        }
        ```
    *   **Success Response (200 OK):** (Same as registration success)
    *   **Error Response (401 Unauthorized or 422 Unprocessable Entity):**

## 3. Frontend Boilerplate Considerations (React Native)

Screens needed:
*   Login Screen: Email input, password input, login button, link to registration, social login buttons.
*   Registration Screen: Email input, password input, password confirmation input, registration button, link to login.

**State Management:**
*   Use React Context API or a state management library (Redux, Zustand) to manage authentication state (e.g., `isLoading`, `isAuthenticated`, `userToken`, `userInfo`).

**Secure Token Storage:**
*   Use `expo-secure-store` or `react-native-keychain` for securely storing the authentication token on the device.

**Navigation:**
*   Use a navigation library like React Navigation. Protect routes based on authentication state. If not authenticated, redirect to login screen.

**API Service:**
*   Create a dedicated service/module for making API calls to the backend. This service should handle attaching the auth token to requests that require authentication.

**Example Login Form Snippet (Conceptual):**
```javascript
// LoginScreen.js (Simplified)
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
// import { useAuth } from './AuthContext'; // Assuming an AuthContext

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const { login, isLoading, error } = useAuth();

  const handleLogin = () => {
    // login(email, password);
    console.log('Login attempt with:', email, password);
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {/* {error && <Text style={{color: 'red'}}>{error}</Text>} */}
      <Button title={"Login"} onPress={handleLogin} /*disabled={isLoading}*/ />
      {/* Add social login buttons and link to register screen */}
    </View>
  );
};

export default LoginScreen;
```

## 4. Security Considerations

*   **Password Hashing:** Use a strong hashing algorithm like `bcrypt` on the backend.
*   **HTTPS:** All communication between frontend and backend must be over HTTPS.
*   **JWT Security:**
    *   Use a strong secret key for signing JWTs.
    *   Set appropriate expiration times for tokens.
    *   Consider token refresh mechanisms.
    *   Store tokens securely on the client-side.
*   **Input Validation:** Validate all user inputs on both client and server sides.
*   **Rate Limiting:** Implement rate limiting on authentication endpoints to prevent brute-force attacks.
*   **OAuth Security:**
    *   Use `state` parameter to prevent CSRF attacks in OAuth flows.
    *   Securely store client secrets for OAuth providers.
    *   Verify the authenticity of tokens received from providers.

This outline provides a comprehensive starting point for implementing authentication in convrSAYit. The specific implementation details will vary based on the chosen libraries and tools for both Rails and React Native.
