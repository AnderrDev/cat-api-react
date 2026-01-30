import { ValidationUtils } from '../validation';

describe('ValidationUtils', () => {
    describe('isValidLuhn', () => {
        it('should validate correct card numbers', () => {
            // Valid test card numbers
            expect(ValidationUtils.isValidLuhn('4242424242424242')).toBe(true); // Visa
            expect(ValidationUtils.isValidLuhn('5555555555554444')).toBe(true); // Mastercard
            expect(ValidationUtils.isValidLuhn('378282246310005')).toBe(true); // Amex
        });

        it('should accept card numbers with spaces or dashes', () => {
            expect(ValidationUtils.isValidLuhn('4242-4242-4242-4242')).toBe(true);
            expect(ValidationUtils.isValidLuhn('4242 4242 4242 4242')).toBe(true);
        });

        it('should reject invalid card numbers', () => {
            expect(ValidationUtils.isValidLuhn('1234567890123456')).toBe(false);
            expect(ValidationUtils.isValidLuhn('4242424242424243')).toBe(false); // Off by one digit
            expect(ValidationUtils.isValidLuhn('9999999999999999')).toBe(false);
        });

        it('should reject card numbers that are too short', () => {
            expect(ValidationUtils.isValidLuhn('123456789012')).toBe(false); // 12 digits
            expect(ValidationUtils.isValidLuhn('12345')).toBe(false);
        });

        it('should reject empty or invalid input', () => {
            expect(ValidationUtils.isValidLuhn('')).toBe(false);
            expect(ValidationUtils.isValidLuhn('abc')).toBe(false);
            expect(ValidationUtils.isValidLuhn('xxxx-xxxx-xxxx-xxxx')).toBe(false);
        });
    });

    describe('isValidExpiration', () => {
        beforeEach(() => {
            // Mock current date to ensure consistent testing
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2025-06-15')); // June 2025
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should accept future dates', () => {
            expect(ValidationUtils.isValidExpiration('12/25')).toBe(true); // December 2025
            expect(ValidationUtils.isValidExpiration('01/26')).toBe(true); // January 2026
            expect(ValidationUtils.isValidExpiration('12/30')).toBe(true); // December 2030
        });

        it('should accept current month and year', () => {
            expect(ValidationUtils.isValidExpiration('06/25')).toBe(true); // Same month
        });

        it('should reject past dates', () => {
            expect(ValidationUtils.isValidExpiration('05/25')).toBe(false); // May 2025 (past)
            expect(ValidationUtils.isValidExpiration('12/24')).toBe(false); // December 2024
            expect(ValidationUtils.isValidExpiration('01/20')).toBe(false); // January 2020
        });

        it('should reject invalid formats', () => {
            expect(ValidationUtils.isValidExpiration('1225')).toBe(false); // No slash
            expect(ValidationUtils.isValidExpiration('12-25')).toBe(false); // Wrong separator
            expect(ValidationUtils.isValidExpiration('12/2025')).toBe(false); // 4-digit year
            expect(ValidationUtils.isValidExpiration('122')).toBe(false); // Too short
        });

        it('should reject invalid months', () => {
            expect(ValidationUtils.isValidExpiration('00/25')).toBe(false); // Month 0
            expect(ValidationUtils.isValidExpiration('13/25')).toBe(false); // Month 13
            expect(ValidationUtils.isValidExpiration('99/25')).toBe(false); // Month 99
        });

        it('should reject empty or invalid input', () => {
            expect(ValidationUtils.isValidExpiration('')).toBe(false);
            expect(ValidationUtils.isValidExpiration('abc')).toBe(false);
            expect(ValidationUtils.isValidExpiration('XX/YY')).toBe(false);
        });

        it('should handle edge cases for month boundaries', () => {
            // Current month should be valid
            expect(ValidationUtils.isValidExpiration('06/25')).toBe(true);

            // Previous month should be invalid
            expect(ValidationUtils.isValidExpiration('05/25')).toBe(false);

            // Next month should be valid
            expect(ValidationUtils.isValidExpiration('07/25')).toBe(true);
        });

        it('should handle year transitions correctly', () => {
            jest.setSystemTime(new Date('2025-12-31')); // December 31, 2025

            expect(ValidationUtils.isValidExpiration('12/25')).toBe(true); // Current month
            expect(ValidationUtils.isValidExpiration('01/26')).toBe(true); // Next year
            expect(ValidationUtils.isValidExpiration('11/25')).toBe(false); // Previous month
        });
    });
});
