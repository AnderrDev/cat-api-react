import { TokenizePaymentMethodUseCase } from '../TokenizePaymentMethodUseCase';
import { PaymentRepository, SecureStorageRepository } from '@domain/repositories';
import { CreditCard, SecurityToken } from '@domain/entities';
import { right, left } from 'fp-ts/Either';
import { PaymentFailure, StorageFailure } from '@core/errors/Failure';

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

        mockPaymentRepo.tokenizeCard.mockResolvedValue(right(mockToken));
        mockSecureStorageRepo.savePaymentDetails.mockResolvedValue(right(undefined));

        const result = await tokenizePaymentUseCase.execute(card);

        expect(result).toEqual(right(mockToken));
        expect(mockPaymentRepo.tokenizeCard).toHaveBeenCalledWith(card);
        expect(mockSecureStorageRepo.savePaymentDetails).toHaveBeenCalledWith({
            token: mockToken,
            cardInfo: {
                last4: '4242',
                cardHolder: 'John Doe',
                brand: 'Visa (Simulated)',
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

        mockPaymentRepo.tokenizeCard.mockResolvedValue(right(mockToken));
        mockSecureStorageRepo.savePaymentDetails.mockResolvedValue(right(undefined));

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

        const failure = new PaymentFailure('Payment declined');
        mockPaymentRepo.tokenizeCard.mockResolvedValue(left(failure));

        const result = await tokenizePaymentUseCase.execute(card);

        expect(result).toEqual(left(failure));
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

        const failure = new StorageFailure('Storage failed');
        mockPaymentRepo.tokenizeCard.mockResolvedValue(right(mockToken));
        mockSecureStorageRepo.savePaymentDetails.mockResolvedValue(left(failure));

        const result = await tokenizePaymentUseCase.execute(card);

        expect(result).toEqual(left(failure));
    });
});
