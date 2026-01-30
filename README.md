# CatsApiApp 🐱

**CatsApiApp** is a React Native application that allows users to browse cat breeds, view details, manage favorites, and simulate premium features using a Clean Architecture approach.

## 🚀 Features

- **Browse Breeds**: View a list of cat breeds with infinite scrolling.
- **Search**: Filter breeds by name.
- **Favorites**: Mark breeds as favorites (persisted locally).
- **Premium Access**: Unlock exclusive content by simulating a payment (Tokenization + Secure Storage).
- **Responsive UI**: Built with React Native components and custom styling.

---

## 🏗 Architecture

This project follows **Clean Architecture** principles to ensure separation of concerns, scalability, and testability.

### Layers

1.  **Domain Layer** (`src/domain`)
    -   **Entities**: Core business objects (e.g., `Cat`, `CreditCard`, `SecurityToken`).
    -   **Use Cases**: Encapsulate business logic (e.g., `GetCatListUseCase`, `ToggleFavoriteUseCase`).
    -   **Repository Interfaces**: Contracts for data access (e.g., `CatRepository`, `PaymentRepository`).
    -   *Pure TypeScript, no external framework dependencies.*

2.  **Data Layer** (`src/data`)
    -   **Repository Implementations**: Concrete classes that implement domain interfaces.
    -   **Data Sources**:
        -   `Remote`: API calls (Axios) and Mock Services (`PaymentMockService`).
        -   `Local`: Persistence using `AsyncStorage` (Favorites) and `Keychain` (Tokens).
    -   **Models**: DTOs (Data Transfer Objects) for API responses.

3.  **Presentation Layer** (`src/presentation`)
    -   **Screens**: UI views (e.g., `FeedScreen`, `LinkCardScreen`).
    -   **Components**: Reusable UI elements (`CatCard`, `CreditCardDisplay`).
    -   **Hooks**: Custom React hooks connecting UI with Use Cases (e.g., `useCatFeed`, `useLinkCard`).
    -   **State Management**: Local state and Context API.

### Dependency Injection

We use a custom DI container (`src/core/di/AppContainer.ts`) to manage dependencies. This allows easy swapping of implementations and simplifies testing by enabling mock injection.

---

## 🛠 Tech Stack

-   **Framework**: React Native (0.83.1)
-   **Language**: TypeScript
-   **Networking**: Axios
-   **Local Storage**:
    -   `@react-native-async-storage/async-storage` (General data)
    -   `react-native-keychain` (Sensitive data)
-   **Navigation**: React Navigation (Native Stack)
-   **Forms**: React Hook Form
-   **Testing**: Jest, React Native Testing Library

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

3.  **Install iOS pods (Mac only)**
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

The project maintains high code coverage using **Jest**.

### Running Tests
To run all unit tests:
```bash
npm test
```

### Testing Strategy
-   **Unit Tests**: Focus on Use Cases, Repositories (with mocks), and Hooks.
-   **Mocking**: External services (API, Storage, Payment) are abstracted and mocked.

**Current Status**: 140/140 tests passing ✅

---

## 📂 Project Structure

```
src/
├── core/           # Core utilities, constants, DI container
├── data/           # Data sources, repositories impl, models
├── domain/         # Entities, use cases, repository interfaces
└── presentation/   # UI components, screens, hooks, navigation
```
