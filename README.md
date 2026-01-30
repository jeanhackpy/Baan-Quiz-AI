# Properly: Thai Property Guide

Properly is a modern React application designed to help European clients find their perfect property in Thailand using AI-driven matching and assistance.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd properly-thai-property-guide
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy the `.env.example` file to `.env.local` and add your Google Gemini API key:
    ```bash
    cp .env.example .env.local
    # Edit .env.local and add your VITE_GEMINI_API_KEY
    ```

4.  **Run in development mode**:
    ```bash
    npm run dev
    ```

## 🏗️ Architecture & Refactoring

This project has been refactored from a monolithic AI-generated prototype to a production-ready modular architecture.

### Key Improvements:
- **Modular Component Structure**: UI components are isolated in `src/components/`.
- **Custom Hooks**: Business logic for matching, quiz flow, and chat is extracted into `src/hooks/`.
- **Service Layer**: External API interactions (Gemini) are handled in `src/services/`.
- **Type Safety**: Comprehensive TypeScript interfaces define the domain model in `src/types.ts`.
- **Decoupled Configuration**: Constants and sample data are centralized in `src/config/` and `src/data/`.
- **Testing**: Unit tests for core logic using `Vitest`.

### Project Structure:
- `components/`: React UI components.
- `hooks/`: Custom React hooks for state and logic.
- `services/`: Service layer for API calls.
- `utils/`: Pure utility functions (e.g., matching algorithm).
- `config/`: Application constants and configuration.
- `data/`: Sample property data for the simulation.
- `tests/`: Unit tests.
- `AUDIT.md`: Detailed architectural audit and refactoring report.

## 🧪 Testing
Run unit tests with Vitest:
```bash
npm test
```

## 📄 License
MIT
