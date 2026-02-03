import { PaymentRepositoryImpl } from '../PaymentRepositoryImpl';
import { PaymentService } from '@data/remote';
import { CreditCard } from '@domain/entities';
import SecureVault from '@core/modules/SecureVault';
import { left, isRight } from 'fp-ts/Either';
import { PaymentFailure } from '@core/errors/Failure';

// Mock the Native Module wrapper
jest.mock('@core/modules/SecureVault', () => ({
    tokenizeCard: jest.fn(),
    setSecureValue: jest.fn(),
    getSecureValue: jest.fn(),
    clearSecureValue: jest.fn(),
}));

describe('PaymentRepositoryImpl', () => {
    let repository: PaymentRepositoryImpl;
    let mockPaymentService: jest.Mocked<PaymentService>;

    beforeEach(() => {
        mockPaymentService = {
            processPayment: jest.fn()
        };
        repository = new PaymentRepositoryImpl(mockPaymentService);
        jest.clearAllMocks();
    });

    describe('tokenizeCard', () => {
        it('should tokenize card successfully using Native SecureVault', async () => {
            const card: CreditCard = {
                cardNumber: '4242424242424242',
                cvv: '123',
                expirationDate: '12/25',
                cardHolder: 'John Doe'
            };

            const mockNativeToken = 'token_native_123';
            (SecureVault.tokenizeCard as jest.Mock).mockResolvedValue(mockNativeToken);

            const result = await repository.tokenizeCard(card);

            expect(isRight(result)).toBe(true);
            if (isRight(result)) {
                expect(result.right.accessToken).toEqual(mockNativeToken);
                expect(result.right.createdAt).toBeDefined();
            }
            expect(SecureVault.tokenizeCard).toHaveBeenCalledWith(card.cardNumber);
            // Verify we are NOT calling the old service
            expect(mockPaymentService.processPayment).not.toHaveBeenCalled();
        });

        it('should return PaymentFailure when SecureVault fails', async () => {
            const card: CreditCard = {
                cardNumber: '4242424242424242',
                cvv: '123',
                expirationDate: '12/25',
                cardHolder: 'John Doe'
            };

            const error = new Error('SecureVault Error');
            (SecureVault.tokenizeCard as jest.Mock).mockRejectedValue(error);

            const result = await repository.tokenizeCard(card);

            expect(result).toEqual(left(new PaymentFailure('SecureVault Error')));
        });
    });
});
