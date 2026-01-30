import { PaymentRepositoryImpl } from '../PaymentRepositoryImpl';
import { PaymentMockService } from '@data/remote';
import { CreditCard, PaymentError } from '@domain/entities';

// Mock the PaymentMockService
jest.mock('@data/remote', () => ({
    PaymentMockService: {
        processPayment: jest.fn()
    }
}));

describe('PaymentRepositoryImpl', () => {
    let repository: PaymentRepositoryImpl;

    beforeEach(() => {
        repository = new PaymentRepositoryImpl();
        jest.clearAllMocks();
    });

    describe('tokenizeCard', () => {
        it('should tokenize card successfully', async () => {
            const card: CreditCard = {
                cardNumber: '4242424242424242',
                cvv: '123',
                expirationDate: '12/25',
                cardHolder: 'John Doe'
            };

            const mockToken = {
                accessToken: 'token_123',
                createdAt: Date.now()
            };

            (PaymentMockService.processPayment as jest.Mock).mockResolvedValue(mockToken);

            const result = await repository.tokenizeCard(card);

            expect(result).toEqual(mockToken);
            expect(PaymentMockService.processPayment).toHaveBeenCalledWith(card);
        });

        it('should throw PaymentError when service fails', async () => {
            const card: CreditCard = {
                cardNumber: '4242424242424242',
                cvv: '123',
                expirationDate: '12/25',
                cardHolder: 'John Doe'
            };

            const error = new Error('Card declined');
            (PaymentMockService.processPayment as jest.Mock).mockRejectedValue(error);

            await expect(repository.tokenizeCard(card)).rejects.toThrow(PaymentError);
            await expect(repository.tokenizeCard(card)).rejects.toThrow('Card declined');
        });

        it('should throw PaymentError with generic message for unknown errors', async () => {
            const card: CreditCard = {
                cardNumber: '4242424242424242',
                cvv: '123',
                expirationDate: '12/25',
                cardHolder: 'John Doe'
            };

            (PaymentMockService.processPayment as jest.Mock).mockRejectedValue('Unknown error');

            await expect(repository.tokenizeCard(card)).rejects.toThrow(PaymentError);
        });
    });
});
