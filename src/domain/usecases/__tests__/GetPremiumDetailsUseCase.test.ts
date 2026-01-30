import { GetPremiumDetailsUseCase } from '../GetPremiumDetailsUseCase';
import { SecureStorageRepository } from '@domain/repositories';
import { StoredPaymentDetails } from '@domain/entities';

describe('GetPremiumDetailsUseCase', () => {
    let getPremiumDetailsUseCase: GetPremiumDetailsUseCase;
    let mockSecureStorageRepo: jest.Mocked<SecureStorageRepository>;

    beforeEach(() => {
        mockSecureStorageRepo = {
            getToken: jest.fn(),
            savePaymentDetails: jest.fn(),
            getPaymentDetails: jest.fn(),
            clearToken: jest.fn(),
        } as jest.Mocked<SecureStorageRepository>;

        getPremiumDetailsUseCase = new GetPremiumDetailsUseCase(mockSecureStorageRepo);
    });

    it('should return payment details when available', async () => {
        const mockDetails: StoredPaymentDetails = {
            token: { accessToken: 'token123', createdAt: Date.now() },
            cardInfo: {
                last4: '4242',
                cardHolder: 'John Doe',
                brand: 'Visa',
                expiration: '12/25'
            }
        };
        mockSecureStorageRepo.getPaymentDetails.mockResolvedValue(mockDetails);

        const result = await getPremiumDetailsUseCase.execute();

        expect(result).toEqual(mockDetails);
        expect(mockSecureStorageRepo.getPaymentDetails).toHaveBeenCalledTimes(1);
    });

    it('should return null when no payment details exist', async () => {
        mockSecureStorageRepo.getPaymentDetails.mockResolvedValue(null);

        const result = await getPremiumDetailsUseCase.execute();

        expect(result).toBeNull();
        expect(mockSecureStorageRepo.getPaymentDetails).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from repository', async () => {
        const error = new Error('Storage error');
        mockSecureStorageRepo.getPaymentDetails.mockRejectedValue(error);

        await expect(getPremiumDetailsUseCase.execute()).rejects.toThrow('Storage error');
    });
});
