# Mobile App Packaging Instructions for convrSAYit (Expo)

This guide provides instructions for building, running, and packaging the convrSAYit React Native mobile application using Expo.

## Prerequisites

1.  **Node.js and npm/yarn:** Ensure you have Node.js (LTS version recommended) and npm (or yarn) installed on your development machine. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Expo CLI:** Install the Expo CLI globally if you haven_t already:
    ```bash
    npm install -g expo-cli
    # or
    yarn global add expo-cli
    ```
3.  **Expo Go App:** For running the app on a physical device during development, install the "Expo Go" app from the Google Play Store (Android) or Apple App Store (iOS).
4.  **Project Setup:** You should have the `convrSAYitMobile` project directory (created with `create-expo-app`) available.

## 1. Running the Expo App Locally (Development)

This allows you to see your changes live on a simulator/emulator or a physical device using the Expo Go app.

1.  **Navigate to the project directory:**
    ```bash
    cd path/to/your/project/convrSAYit/convrSAYitMobile
    ```

2.  **Install dependencies (if not already done):**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    # or
    expo start
    ```
    This will open a new tab in your web browser with the Expo Developer Tools. You will see a QR code.

4.  **Run on a physical device:**
    *   Open the Expo Go app on your Android or iOS device.
    *   Scan the QR code displayed in the terminal or browser.
    *   Ensure your device and computer are on the same Wi-Fi network.

5.  **Run on an emulator/simulator:**
    *   **Android Emulator:** If you have Android Studio and an emulator set up, you can press `a` in the terminal where `expo start` is running.
    *   **iOS Simulator:** If you are on macOS and have Xcode installed, you can press `i` in the terminal.

## 2. Creating a Development Build

A development build includes the native runtime and allows you to test features that are not available in Expo Go (e.g., custom native modules if you add them later). It_s a standalone app that you can install directly on your device.

1.  **Install EAS CLI (Expo Application Services CLI):**
    EAS Build is Expo_s cloud build service. You_ll need an Expo account.
    ```bash
    npm install -g eas-cli
    # or
    yarn global add eas-cli
    ```

2.  **Login to your Expo account:**
    ```bash
    eas login
    ```

3.  **Configure your project for EAS Build (if not already done):**
    This command creates an `eas.json` file in your project root.
    ```bash
    eas build:configure
    ```
    You_ll be prompted to choose platforms (ios, android, all).

4.  **Create a development build profile (if needed):**
    The `eas.json` file usually includes a `development` profile. You can customize it. A typical profile might look like:
    ```json
    // eas.json
    {
      "build": {
        "development": {
          "developmentClient": true,
          "distribution": "internal"
        },
        "preview": {
          "distribution": "internal"
        },
        "production": {}
      },
      "cli": {
        "version": ">= 3.0.0"
      }
    }
    ```

5.  **Start a development build:**
    Specify the platform (android or ios) and the profile.
    ```bash
    # For Android
    eas build -p android --profile development

    # For iOS (requires Apple Developer account configuration for physical device installation)
    eas build -p ios --profile development
    ```
    EAS Build will build your app in the cloud. You_ll get a link to the build details page where you can monitor progress and download the build artifact (`.apk` for Android, `.app` or `.ipa` for iOS) once it_s done.

6.  **Install the development build:**
    *   **Android:** Download the `.apk` file and install it on your Android device (you might need to enable installation from unknown sources).
    *   **iOS:** Download the `.ipa` file. For physical devices, you_ll need to sign it with a development certificate and include the device_s UDID in the provisioning profile. TestFlight is often used for internal distribution on iOS.

## 3. Building for Production (App Store Submission)

Production builds are optimized and signed for release to the app stores.

1.  **Ensure your app is configured correctly:**
    *   **`app.json` / `app.config.js`:** Update `name`, `slug`, `version`, `orientation`, `icon`, `splash screen`, `ios.bundleIdentifier`, `android.package`, `adaptiveIcon`, etc.
    *   **Permissions:** Ensure all necessary permissions are declared in `app.json` (e.g., `android.permissions`).
    *   **Assets:** Provide all required icon and splash screen sizes.

2.  **Create a production build profile in `eas.json` (if not already present):**
    The default `production` profile is usually sufficient to start.
    ```json
    // eas.json (snippet)
    "production": {
      // Add any specific production configurations here
      // e.g., environment variables, build type (app-bundle for Android)
      "android": {
        "buildType": "app-bundle" // Recommended for Google Play
      }
    }
    ```

3.  **Start a production build using EAS Build:**
    ```bash
    # For Android (creates an .aab app bundle)
    eas build -p android --profile production

    # For iOS (creates an .ipa file)
    eas build -p ios --profile production
    ```
    EAS Build will handle the signing process. For iOS, it can integrate with your Apple Developer account to manage certificates and provisioning profiles. For Android, it can generate or use your existing keystore.

4.  **Submit to App Stores:**

    *   **Google Play Store (Android):**
        1.  Once the `.aab` (Android App Bundle) is built, download it from the EAS Build dashboard.
        2.  Go to your [Google Play Console](https://play.google.com/console).
        3.  Create a new app or select an existing one.
        4.  Navigate to the release section (e.g., Internal testing, Closed testing, Production).
        5.  Upload your `.aab` file.
        6.  Fill in all required store listing details (description, screenshots, privacy policy, etc.).
        7.  Set pricing and distribution.
        8.  Review and roll out the release.

    *   **Apple App Store (iOS):**
        1.  Once the `.ipa` file is built, EAS Build can often submit it directly to App Store Connect if configured, or you can download it.
        2.  Go to [App Store Connect](https://appstoreconnect.apple.com/).
        3.  Create a new app or select an existing one.
        4.  Use Transporter app (on macOS) or `eas submit -p ios` to upload your `.ipa` file.
        5.  Fill in all required metadata, screenshots, pricing, and version information in App Store Connect.
        6.  Submit for review. Apple_s review process can take a few days.

## 4. Important Considerations

*   **Expo Account:** You need an Expo account for EAS Build and Submit services.
*   **Apple Developer Account:** Required for iOS development, building for physical devices, and App Store submission. Costs an annual fee.
*   **Google Play Developer Account:** Required for Google Play Store submission. Involves a one-time registration fee.
*   **Build Credentials:** EAS Build helps manage your build credentials (signing certificates, keystores, provisioning profiles). Follow their documentation for setup.
*   **Environment Variables:** Use EAS Build secrets or build profiles in `eas.json` to manage environment variables (e.g., API keys) for different builds (development, production).
*   **Testing:** Thoroughly test your app on various devices and OS versions before submitting to stores.

This guide provides a general overview. Always refer to the latest official Expo documentation ([docs.expo.dev](https://docs.expo.dev/)) and the respective app store guidelines for the most up-to-date and detailed information.
