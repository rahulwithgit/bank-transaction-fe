# Frontend Testing Guide

Your frontend is now fully configured for testing using **Vitest** and **React Testing Library**. The dependencies were already installed so I added a `test` script and set up `vite.config.ts` correctly. I also added tests for your `validators.ts` and `bank.ts` files! 

## How to Run Tests

You can run your tests straight from your terminal.

1. **Run Once**:
   ```bash
   npm test
   ```
   This will execute all test files once and report success or failure.

2. **Watch Mode (Development)**:
   ```bash
   npm test -- --watch
   ```
   This will keep the test runner open. Every time you save a `.ts` or `.tsx` file, it will automatically rerun the tests. It’s highly recommended to leave this running in a separate terminal while refactoring.

## Writing Your Own Tests

1. Create a new file beside the code you want to test, ending with `.test.ts` or `.test.tsx` (e.g., `src/utils/validators.test.ts`).
2. Use standard `describe`, `it`, and `expect` blocks!

### Example: Testing a Utility Function

```typescript
import { expect, it, describe } from 'vitest';
import { validateName } from './validators';

describe('validateName check', () => {
  it('should return error if name is empty', () => {
    expect(validateName('')).toBe('Name is mandatory');
  });

  it('should return null for valid names', () => {
    expect(validateName('HCLTech')).toBeNull();
  });
});
```

### Tips
- You have full access to `jest-dom` matchers natively.
- Use `@testing-library/react` for component rendering tests.
