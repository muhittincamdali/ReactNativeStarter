# Contributing to ReactNativeStarter

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to ReactNativeStarter. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues. When you create a bug report, include as many details as possible:

- **Device/Simulator info** — iOS version, Android API level, device model
- **Expo SDK version** — check with `npx expo --version`
- **Steps to reproduce** — detailed steps to reproduce the behavior
- **Expected behavior** — what you expected to happen
- **Actual behavior** — what actually happened
- **Screenshots/Videos** — if applicable
- **Error logs** — Metro bundler output, device logs

### Suggesting Features

Feature suggestions are tracked as GitHub issues. When creating a feature request:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this feature would be useful
- List any alternative solutions you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code lints (`npm run lint`)
5. Run type checking (`npm run type-check`)
6. Update documentation if needed

## Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/ReactNativeStarter.git
cd ReactNativeStarter

# Install dependencies
npm install

# Start development
npx expo start

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run type-check
```

## Style Guidelines

### TypeScript

- Use functional components with hooks
- Prefer `const` over `let`, never use `var`
- Use TypeScript strict mode — no `any` unless absolutely necessary
- Use meaningful variable and function names
- Keep functions small and focused
- Use early returns to reduce nesting

### File Naming

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Stores: `camelCase.store.ts` (e.g., `auth.store.ts`)
- Utils: `camelCase.ts` (e.g., `validators.ts`)
- Types: `camelCase.types.ts` (e.g., `api.types.ts`)
- Tests: `*.test.ts` or `*.test.tsx`

### Component Structure

```typescript
// 1. Imports
import { View, Text, StyleSheet } from 'react-native';

// 2. Types/Interfaces
interface Props {
  title: string;
  onPress: () => void;
}

// 3. Component
export function MyComponent({ title, onPress }: Props) {
  // hooks first
  // handlers next
  // render last
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

// 4. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

### Examples

```
feat(auth): add biometric login support
fix(api): handle token refresh race condition
docs(readme): update installation instructions
test(validators): add email validation edge cases
```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md under "Unreleased"
3. The PR title should follow conventional commit format
4. Link any related issues in the PR description
5. Request review from at least one maintainer

### PR Template

When you open a PR, you'll see a template. Please fill it out completely.

## Questions?

Feel free to [open an issue](https://github.com/muhittincamdali/ReactNativeStarter/issues) or reach out if you have any questions.

Thank you for contributing! 🙌
