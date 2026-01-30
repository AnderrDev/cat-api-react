import { PaymentRepositoryImpl } from '../PaymentRepositoryImpl';
import { PaymentService } from '@data/remote';
import { CreditCard, PaymentError } from '@domain/entities';

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

            mockPaymentService.processPayment.mockResolvedValue(mockToken);

            const result = await repository.tokenizeCard(card);

            expect(result).toEqual(mockToken);
            expect(mockPaymentService.processPayment).toHaveBeenCalledWith(card);
        });

        it('should throw PaymentError when service fails', async () => {
            const card: CreditCard = {
                cardNumber: '4242424242424242',
                cvv: '123',
                expirationDate: '12/25',
                cardHolder: 'John Doe'
            };

            const error = new Error('Card declined');
            mockPaymentService.processPayment.mockRejectedValue(error);

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

            mockPaymentService.processPayment.mockRejectedValue('Unknown error');

            await expect(repository.tokenizeCard(card)).rejects.toThrow(PaymentError);
        });
    });
});
