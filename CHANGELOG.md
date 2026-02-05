# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-02-05

### Added
- **List Screen** — Searchable, filterable list with grid/list view toggle
- **Detail Screen** — Rich detail view with hero image, animated header, and related items
- **Filter Chips** — Animated horizontal filter component with selection state
- **EAS Build workflow** — Automated builds for iOS/Android via GitHub Actions
- **Release workflow** — Auto-generate changelog and GitHub Releases on version tags
- **Auth store tests** — Comprehensive unit tests for Zustand auth slice
- **CI improvements** — Separated lint, type-check, and test jobs with concurrency control

### Changed
- Replaced placeholder Detail/Explore screens with full implementations
- Updated README to accurately reflect actual technology stack and project structure
- Improved CI workflow with build validation step

## [1.0.0] - 2025-02-03

### Added
- Initial project setup with Expo 51 + React Native 0.74
- React Navigation v6 (Native Stack + Bottom Tabs)
- Zustand state management with persist middleware
- TanStack React Query for data fetching
- Complete auth flow (login, register, biometrics, social login)
- Home screen with animated header, stats, feed
- Profile screen with parallax effect and menu
- Settings screen with theme, notifications, security
- Custom UI components (Button, Input, Card, Avatar, Loading)
- Layout components (Container, Header, TabBar)
- Form validation with Zod schemas
- Dark/Light/System theme support
- Push notification service
- Secure token storage
- Deep linking configuration
- TypeScript strict mode with path aliases
- ESLint + Prettier configuration
- Unit tests for components, hooks, and utilities
- GitHub Actions CI pipeline
