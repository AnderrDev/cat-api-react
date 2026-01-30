import { GetPremiumStatusUseCase } from '../GetPremiumStatusUseCase';
import { SecureStorageRepository } from '@domain/repositories';

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
        mockSecureStorageRepo.getToken.mockResolvedValue({
            accessToken: 'premium-token',
            createdAt: Date.now(),
        });

        const result = await getPremiumStatusUseCase.execute();

        expect(result).toBe(true);
    });

    it('should return false when token is null', async () => {
        mockSecureStorageRepo.getToken.mockResolvedValue(null);

        const result = await getPremiumStatusUseCase.execute();

        expect(result).toBe(false);
    });

    it('should return false when token is undefined', async () => {
        mockSecureStorageRepo.getToken.mockResolvedValue(undefined as any);

        const result = await getPremiumStatusUseCase.execute();

        expect(result).toBe(false);
    });

    it('should handle repository errors gracefully', async () => {
        mockSecureStorageRepo.getToken.mockRejectedValue(new Error('Keychain error'));

        await expect(getPremiumStatusUseCase.execute()).rejects.toThrow('Keychain error');
    });
});
