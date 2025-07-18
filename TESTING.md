# Testing Documentation

This document provides an overview of the testing strategy and instructions for running tests for the ML Portfolio Website.

## Testing Strategy

The project uses a comprehensive testing approach that includes:

1. **Unit Tests**: Testing individual components, hooks, and utility functions in isolation
2. **Integration Tests**: Testing interactions between components and API endpoints
3. **End-to-End Tests**: Testing complete user journeys and critical paths
4. **Performance Tests**: Measuring and ensuring optimal website performance

## Test Tools

- **Jest**: JavaScript testing framework for unit and integration tests
- **React Testing Library**: Testing React components in a user-centric way
- **Playwright**: End-to-end testing framework for browser automation
- **Lighthouse CI**: Performance, accessibility, and SEO testing

## Running Tests

### Unit and Integration Tests

Run all unit and integration tests:

```bash
npm test
```

Run tests in watch mode (for development):

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests

Run all end-to-end tests:

```bash
npm run test:e2e
```

Run end-to-end tests with UI:

```bash
npm run test:e2e:ui
```

### Performance Tests

Run Lighthouse CI tests:

```bash
npm run test:lighthouse
```

### Run All Tests

Run all tests (unit, integration, end-to-end, and performance):

```bash
npm run test:all
```

## Test Coverage

The project aims to maintain high test coverage across all components and functionality. The coverage report can be viewed after running:

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory. Open `coverage/lcov-report/index.html` in a browser to view the detailed report.

## Continuous Integration

Tests are automatically run in the CI pipeline using GitHub Actions. The workflow is defined in `.github/workflows/test.yml` and includes:

1. Linting
2. Unit and integration tests with coverage
3. End-to-end tests
4. Performance tests with Lighthouse CI

## Writing Tests

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### End-to-End Test Example

```ts
import { test, expect } from '@playwright/test';

test('navigates to about page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL('/about');
});
```

## Test Directory Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── ui/
│   │   ├── blog/
│   │   └── ...
│   ├── hooks/
│   ├── lib/
│   └── api/
├── components/
├── hooks/
└── ...
e2e/
├── homepage.spec.ts
├── blog.spec.ts
└── ...
```

## Best Practices

1. Write tests that focus on user behavior rather than implementation details
2. Use meaningful test descriptions that explain what is being tested
3. Keep tests independent and avoid dependencies between tests
4. Mock external dependencies when appropriate
5. Test edge cases and error scenarios
6. Maintain high test coverage for critical functionality