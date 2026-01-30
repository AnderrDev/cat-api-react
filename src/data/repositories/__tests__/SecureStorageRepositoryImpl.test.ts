import { SecureStorageRepositoryImpl } from '../SecureStorageRepositoryImpl';
import { SecureStorageDataSource } from '@data/datasources';
import { StoredPaymentDetails } from '@domain/entities';

describe('SecureStorageRepositoryImpl', () => {
    let repository: SecureStorageRepositoryImpl;
    let mockDataSource: jest.Mocked<SecureStorageDataSource>;

    beforeEach(() => {
        mockDataSource = {
            savePaymentDetails: jest.fn(),
            getPaymentDetails: jest.fn(),
            clearToken: jest.fn(),
        } as jest.Mocked<SecureStorageDataSource>;

        repository = new SecureStorageRepositoryImpl(mockDataSource);
    });

    describe('savePaymentDetails', () => {
        it('should save payment details through data source', async () => {
            const details: StoredPaymentDetails = {
                token: { accessToken: 'token123', createdAt: Date.now() },
                cardInfo: {
                    last4: '4242',
                    cardHolder: 'John Doe',
                    brand: 'Visa',
                    expiration: '12/25'
                }
            };
            mockDataSource.savePaymentDetails.mockResolvedValue(undefined);

            await repository.savePaymentDetails(details);

            expect(mockDataSource.savePaymentDetails).toHaveBeenCalledWith(details);
            expect(mockDataSource.savePaymentDetails).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from data source', async () => {
            const details: StoredPaymentDetails = {
                token: { accessToken: 'token123', createdAt: Date.now() },
                cardInfo: {
                    last4: '4242',
                    cardHolder: 'John Doe',
                    brand: 'Visa',
                    expiration: '12/25'
                }
            };
            const error = new Error('Storage error');
            mockDataSource.savePaymentDetails.mockRejectedValue(error);

            await expect(repository.savePaymentDetails(details)).rejects.toThrow('Storage error');
        });
    });

    describe('getPaymentDetails', () => {
        it('should return payment details from data source', async () => {
            const details: StoredPaymentDetails = {
                token: { accessToken: 'token123', createdAt: Date.now() },
                cardInfo: {
                    last4: '4242',
                    cardHolder: 'John Doe',
                    brand: 'Visa',
                    expiration: '12/25'
                }
            };
            mockDataSource.getPaymentDetails.mockResolvedValue(details);

            const result = await repository.getPaymentDetails();

            expect(result).toEqual(details);
            expect(mockDataSource.getPaymentDetails).toHaveBeenCalledTimes(1);
        });

        it('should return null when no details exist', async () => {
            mockDataSource.getPaymentDetails.mockResolvedValue(null);

            const result = await repository.getPaymentDetails();

            expect(result).toBeNull();
        });

        it('should propagate errors from data source', async () => {
            const error = new Error('Storage error');
            mockDataSource.getPaymentDetails.mockRejectedValue(error);

            await expect(repository.getPaymentDetails()).rejects.toThrow('Storage error');
        });
    });

    describe('getToken', () => {
        it('should extract and return token when payment details exist', async () => {
            const details: StoredPaymentDetails = {
                token: { accessToken: 'token123', createdAt: Date.now() },
                cardInfo: {
                    last4: '4242',
                    cardHolder: 'John Doe',
                    brand: 'Visa',
                    expiration: '12/25'
                }
            };
            mockDataSource.getPaymentDetails.mockResolvedValue(details);

            const result = await repository.getToken();

            expect(result).toEqual(details.token);
        });

        it('should return null when no payment details exist', async () => {
            mockDataSource.getPaymentDetails.mockResolvedValue(null);

            const result = await repository.getToken();

            expect(result).toBeNull();
        });

        it('should propagate errors from data source', async () => {
            const error = new Error('Storage error');
            mockDataSource.getPaymentDetails.mockRejectedValue(error);

            await expect(repository.getToken()).rejects.toThrow('Storage error');
        });
    });

    describe('clearToken', () => {
        it('should clear token through data source', async () => {
            mockDataSource.clearToken.mockResolvedValue(undefined);

            await repository.clearToken();

            expect(mockDataSource.clearToken).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from data source', async () => {
            const error = new Error('Storage error');
            mockDataSource.clearToken.mockRejectedValue(error);

            await expect(repository.clearToken()).rejects.toThrow('Storage error');
        });
    });
});
