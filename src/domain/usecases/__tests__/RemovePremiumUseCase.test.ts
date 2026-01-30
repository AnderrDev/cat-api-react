import { RemovePremiumUseCase } from '../RemovePremiumUseCase';
import { SecureStorageRepository } from '@domain/repositories';

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
        mockSecureStorageRepo.clearToken.mockResolvedValue(undefined);

        await removePremiumUseCase.execute();

        expect(mockSecureStorageRepo.clearToken).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from repository', async () => {
        const error = new Error('Storage error');
        mockSecureStorageRepo.clearToken.mockRejectedValue(error);

        await expect(removePremiumUseCase.execute()).rejects.toThrow('Storage error');
    });
});
