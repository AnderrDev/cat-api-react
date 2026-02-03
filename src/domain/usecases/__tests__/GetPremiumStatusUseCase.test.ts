import { GetPremiumStatusUseCase } from '../GetPremiumStatusUseCase';
import { SecureStorageRepository } from '@domain/repositories';
import { right, left } from 'fp-ts/Either';
import { StorageFailure } from '@core/errors/Failure';

describe('GetPremiumStatusUseCase', () => {
    let getPremiumStatusUseCase: GetPremiumStatusUseCase;
    let mockSecureStorageRepo: jest.Mocked<SecureStorageRepository>;

    beforeEach(() => {
        mockSecureStorageRepo = {
            savePaymentDetails: jest.fn(),
            getPaymentDetails: jest.fn(),
            getToken: jest.fn(),
            clearToken: jest.fn(),
        } as jest.Mocked<SecureStorageRepository>;

        getPremiumStatusUseCase = new GetPremiumStatusUseCase(mockSecureStorageRepo);
    });

    it('should return true when token exists', async () => {
        mockSecureStorageRepo.getToken.mockResolvedValue(right({
            accessToken: 'premium-token',
            createdAt: Date.now(),
        }));

        const result = await getPremiumStatusUseCase.execute();

        expect(result).toEqual(right(true));
    });

    it('should return false when token is null', async () => {
        mockSecureStorageRepo.getToken.mockResolvedValue(right(null));

        const result = await getPremiumStatusUseCase.execute();

        expect(result).toEqual(right(false));
    });

    it('should handle repository errors gracefully', async () => {
        const failure = new StorageFailure('Keychain error');
        mockSecureStorageRepo.getToken.mockResolvedValue(left(failure));

        const result = await getPremiumStatusUseCase.execute();

        expect(result).toEqual(left(failure));
    });
});
