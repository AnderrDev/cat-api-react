import { TokenizePaymentMethodUseCase } from '../TokenizePaymentMethodUseCase';
import { PaymentRepository, SecureStorageRepository } from '@domain/repositories';
import { CreditCard, SecurityToken } from '@domain/entities';

describe('TokenizePaymentMethodUseCase', () => {
    let tokenizePaymentUseCase: TokenizePaymentMethodUseCase;
    let mockPaymentRepo: jest.Mocked<PaymentRepository>;
    let mockSecureStorageRepo: jest.Mocked<SecureStorageRepository>;

    beforeEach(() => {
        mockPaymentRepo = {
            tokenizeCard: jest.fn(),
        } as jest.Mocked<PaymentRepository>;

        mockSecureStorageRepo = {
            getToken: jest.fn(),
            savePaymentDetails: jest.fn(),
            getPaymentDetails: jest.fn(),
            clearToken: jest.fn(),
        } as jest.Mocked<SecureStorageRepository>;

        tokenizePaymentUseCase = new TokenizePaymentMethodUseCase(
            mockPaymentRepo,
            mockSecureStorageRepo
        );
    });

    it('should tokenize card and save payment details', async () => {
        const card: CreditCard = {
            cardNumber: '4242424242424242',
            cvv: '123',
            expirationDate: '12/25',
            cardHolder: 'John Doe'
        };

        const mockToken: SecurityToken = {
            accessToken: 'token_123',
            createdAt: Date.now()
        };

        mockPaymentRepo.tokenizeCard.mockResolvedValue(mockToken);
        mockSecureStorageRepo.savePaymentDetails.mockResolvedValue(undefined);

        const result = await tokenizePaymentUseCase.execute(card);

        expect(result).toEqual(mockToken);
        expect(mockPaymentRepo.tokenizeCard).toHaveBeenCalledWith(card);
        expect(mockSecureStorageRepo.savePaymentDetails).toHaveBeenCalledWith({
            token: mockToken,
            cardInfo: {
                last4: '4242',
                cardHolder: 'John Doe',
                brand: 'Visa (Simulado)',
                expiration: '12/25'
            }
        });
    });

    it('should extract last 4 digits correctly', async () => {
        const card: CreditCard = {
            cardNumber: '5555555555554444',
            cvv: '999',
            expirationDate: '06/26',
            cardHolder: 'Jane Smith'
        };

        const mockToken: SecurityToken = {
            accessToken: 'token_456',
            createdAt: Date.now()
        };

        mockPaymentRepo.tokenizeCard.mockResolvedValue(mockToken);
        mockSecureStorageRepo.savePaymentDetails.mockResolvedValue(undefined);

        await tokenizePaymentUseCase.execute(card);

        expect(mockSecureStorageRepo.savePaymentDetails).toHaveBeenCalledWith(
            expect.objectContaining({
                cardInfo: expect.objectContaining({
                    last4: '4444'
                })
            })
        );
    });

    it('should propagate payment errors', async () => {
        const card: CreditCard = {
            cardNumber: '4242424242424242',
            cvv: '123',
            expirationDate: '12/25',
            cardHolder: 'John Doe'
        };

        const error = new Error('Payment declined');
        mockPaymentRepo.tokenizeCard.mockRejectedValue(error);

        await expect(tokenizePaymentUseCase.execute(card)).rejects.toThrow('Payment declined');
        expect(mockSecureStorageRepo.savePaymentDetails).not.toHaveBeenCalled();
    });

    it('should propagate storage errors', async () => {
        const card: CreditCard = {
            cardNumber: '4242424242424242',
            cvv: '123',
            expirationDate: '12/25',
            cardHolder: 'John Doe'
        };

        const mockToken: SecurityToken = {
            accessToken: 'token_123',
            createdAt: Date.now()
        };

        mockPaymentRepo.tokenizeCard.mockResolvedValue(mockToken);
        mockSecureStorageRepo.savePaymentDetails.mockRejectedValue(new Error('Storage failed'));

        await expect(tokenizePaymentUseCase.execute(card)).rejects.toThrow('Storage failed');
    });
});
