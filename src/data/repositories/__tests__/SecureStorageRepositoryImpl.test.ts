import { SecureStorageRepositoryImpl } from '../SecureStorageRepositoryImpl';
import { SecureStorageDataSource } from '@data/datasources';
import { StoredPaymentDetails } from '@domain/entities';
import { right, left } from 'fp-ts/Either';
import { StorageFailure } from '@core/errors/Failure';

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

            const result = await repository.savePaymentDetails(details);

            expect(result).toEqual(right(undefined));
            expect(mockDataSource.savePaymentDetails).toHaveBeenCalledWith(details);
            expect(mockDataSource.savePaymentDetails).toHaveBeenCalledTimes(1);
        });

        it('should return StorageFailure when data source fails', async () => {
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

            const result = await repository.savePaymentDetails(details);

            expect(result).toEqual(left(new StorageFailure('Storage error')));
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

            expect(result).toEqual(right(details));
            expect(mockDataSource.getPaymentDetails).toHaveBeenCalledTimes(1);
        });

        it('should return null when no details exist', async () => {
            mockDataSource.getPaymentDetails.mockResolvedValue(null);

            const result = await repository.getPaymentDetails();

            expect(result).toEqual(right(null));
        });

        it('should return StorageFailure when data source fails', async () => {
            const error = new Error('Storage error');
            mockDataSource.getPaymentDetails.mockRejectedValue(error);

            const result = await repository.getPaymentDetails();

            expect(result).toEqual(left(new StorageFailure('Storage error')));
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

            expect(result).toEqual(right(details.token));
        });

        it('should return null when no payment details exist', async () => {
            mockDataSource.getPaymentDetails.mockResolvedValue(null);

            const result = await repository.getToken();

            expect(result).toEqual(right(null));
        });

        it('should return StorageFailure when data source fails', async () => {
            const error = new Error('Storage error');
            mockDataSource.getPaymentDetails.mockRejectedValue(error);

            const result = await repository.getToken();

            expect(result).toEqual(left(new StorageFailure('Storage error')));
        });
    });

    describe('clearToken', () => {
        it('should clear token through data source', async () => {
            mockDataSource.clearToken.mockResolvedValue(undefined);

            const result = await repository.clearToken();

            expect(result).toEqual(right(undefined));
            expect(mockDataSource.clearToken).toHaveBeenCalledTimes(1);
        });

        it('should return StorageFailure when data source fails', async () => {
            const error = new Error('Storage error');
            mockDataSource.clearToken.mockRejectedValue(error);

            const result = await repository.clearToken();

            expect(result).toEqual(left(new StorageFailure('Storage error')));
        });
    });
});
