# CatsApiApp 🐱

**CatsApiApp** is a React Native iOS/Android application that demonstrates advanced **Clean Architecture** patterns, bridging JavaScript with **Native Modules** (Kotlin/Swift) for banking-grade security.

## 🚀 Features

- **Browse Breeds**: View a list of cat breeds with infinite scrolling.
- **Search**: Filter breeds by name.
- **Favorites**: Persist favorite breeds locally using `AsyncStorage`.
- **Secure Wallet (Native)**:
    - **Tokenization**: Real-time credit card tokenization via Native Modules.
    - **Secure Storage**: Hardware-backed storage logic in Kotlin (`EncryptedSharedPreferences`) and Swift (`Keychain`).
    - **Zero-Knowledge UI**: Sensitive data is removed from JS memory immediately after tokenization.
- **Premium Access**: Unlock exclusive content using the natively stored secure token.

---

## 🏗 Architecture

This project follows **Clean Architecture** with a **Hybrid Native Bridge**:

### Layers

1.  **Domain Layer** (`src/domain`)
    -   **Entities**: Core business objects (`Cat`, `CreditCard`, `SecurityToken`).
    -   **Use Cases**: Encapsulate business logic (`GetCatListUseCase`, `TokenizePaymentMethodUseCase`).
    -   **Repository Interfaces**: Contracts defined in TS, implemented in Data layer.
    -   *Pure TypeScript, zero framework dependencies.*

2.  **Data Layer** (`src/data`)
    -   **Repositories**: Implementations that coordinate data fetching.
    -   **Data Sources**:
        -   `Remote`: API calls via Axios.
        -   `Local`: `FavoritesDataSource` (AsyncStorage).
        -   **Native Bridge**: `SecureVault` module connecting to Android/iOS native code.

3.  **Presentation Layer** (`src/presentation`)
    -   **Screens**: `FeedScreen`, `LinkCardScreen`, `WalletScreen` (Demo), `PremiumScreen`.
    -   **ViewModels/Hooks**: Logic controllers (e.g., `useLinkCard`, `useWalletViewModel`).

### 🔐 Native Modules Integration

Instead of relying on third-party libraries for critical security, this app implements its own Native Modules:

-   **Android (`SecureVaultModule.kt`)**: Uses `EncryptedSharedPreferences` (MasterKey implementation) to store tokens securely.
-   **iOS (`SecureVaultModule.swift`)**: Uses the iOS Keychain Services API for standard secure storage.
-   **Bridge**: A shared TypeScript interface (`SecureVault.ts`) unifies the native calls.

---

## 🛠 Tech Stack

-   **Core**: React Native (0.83.1), TypeScript
-   **Native Android**: Kotlin, Jetpack Security (EncryptedSharedPreferences)
-   **Native iOS**: Swift, Foundation (Keychain)
-   **Networking**: Axios
-   **Navigation**: React Navigation
-   **Testing**: Jest, React Native Testing Library
-   **Pattern**: Clean Architecture + MVVM

---

## 🏁 Getting Started

### Prerequisites

-   Node.js (>= 20)
-   Yarn or npm
-   Ruby (for iOS dependencies)
-   **iOS**: Xcode (Mac only)
-   **Android**: Android Studio & JDK

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/cats-api-app.git
    cd CatsApiApp
    ```

2.  **Install JS dependencies**
    ```bash
    npm install
    ```

3.  **Install iOS pods**
    ```bash
    cd ios
    pod install
    cd ..
    ```

### Running the App

-   **iOS**:
    ```bash
    npm run ios
    ```

-   **Android**:
    ```bash
    npm run android
    ```

---

## 🧪 Testing

The project maintains high code coverage, mocking the Native Modules to ensure standard JS tests run smoothly in CI/CD.

### Running Tests
```bash
npm test
```

**Status**: 100% Passing ✅ (Includes Native Bridge Mocks)

---

## 📂 Project Structure

```
src/
├── core/
│   ├── di/             # Dependency Injection Container
│   └── modules/        # Native Module Bridges (SecureVault)
├── data/               # Repositories & Data Sources
├── domain/             # Entities, Use Cases, Interfaces
├── presentation/       # UI Components, Screens, Hooks
└── App.tsx             # Entry Point
```
