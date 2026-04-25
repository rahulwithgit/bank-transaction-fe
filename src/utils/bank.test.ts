import { describe, it, expect } from 'vitest';
import { calculateBankFromIBAN } from './bank';

describe('calculateBankFromIBAN', () => {
  it('identifies Nairobi Bank', () => {
    expect(calculateBankFromIBAN('ES50 1234 0000 0000 0000')).toBe('Nairobi Bank');
  });

  it('identifies Denver Bank handling spaces', () => {
    expect(calculateBankFromIBAN('ES50  1235  0000')).toBe('Denver Bank');
  });

  it('throws error for invalid bank', () => {
    expect(() => calculateBankFromIBAN('ES50 9999 0000')).toThrowError('Bank does not exist');
  });

  it('throws error for short IBAN', () => {
    expect(() => calculateBankFromIBAN('ES50 12')).toThrowError('IBAN is too short to determine the bank');
  });
});
