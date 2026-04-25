import { describe, it, expect } from 'vitest';
import { validateName, validateIBAN } from './validators';

describe('validateName', () => {
  it('accepts valid names', () => {
    expect(validateName("Ramón Curado-García")).toBe(null);
  });

  it('rejects empty name', () => {
    expect(validateName('   ')).toBe('Name is mandatory');
  });

  it('rejects invalid characters', () => {
    expect(validateName('John Doe @')).toBe("Name can only contain letters, numbers, spaces, ' and -");
  });
});

describe('validateIBAN', () => {
  it('accepts valid IBAN', () => {
    expect(validateIBAN('ES50 1234 4954')).toBe(null);
  });

  it('rejects too long IBAN', () => {
    expect(validateIBAN('ES50 1234 4954 1234 5678 9012')).toBe('IBAN maximum length is 20');
  });

  it('rejects special chars', () => {
    expect(validateIBAN('ES50 1234 *954')).toBe('IBAN can only contain letters and numbers');
  });
});
