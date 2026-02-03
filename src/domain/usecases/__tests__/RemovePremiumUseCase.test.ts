import { RemovePremiumUseCase } from '../RemovePremiumUseCase';
import { SecureStorageRepository } from '@domain/repositories';
import { right, left } from 'fp-ts/Either';
import { StorageFailure } from '@core/errors/Failure';

describe('RemovePremiumUseCase', () => {
    let removePremiumUseCase: RemovePremiumUseCase;
    let mockSecureStorageRepo: jest.Mocked<SecureStorageRepository>;

    beforeEach(() => {
        mockSecureStorageRepo = {
            getToken: jest.fn(),
            savePaymentDetails: jest.fn(),
            getPaymentDetails: jest.fn(),
            clearToken: jest.fn(),
        } as jest.Mocked<SecureStorageRepository>;

        removePremiumUseCase = new RemovePremiumUseCase(mockSecureStorageRepo);
    });

    it('should clear token from secure storage', async () => {
        mockSecureStorageRepo.clearToken.mockResolvedValue(right(undefined));

        const result = await removePremiumUseCase.execute();

        expect(mockSecureStorageRepo.clearToken).toHaveBeenCalledTimes(1);
        expect(result).toEqual(right(undefined));
    });

    it('should propagate errors from repository', async () => {
        const failure = new StorageFailure('Storage error');
        mockSecureStorageRepo.clearToken.mockResolvedValue(left(failure));

        const result = await removePremiumUseCase.execute();

        expect(result).toEqual(left(failure));
    });
});
