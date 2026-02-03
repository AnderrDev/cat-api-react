import { SecureStorageRepository } from '@domain/repositories';
import { StoredPaymentDetails } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';

export class GetPremiumDetailsUseCase {
    constructor(private secureStorageRepository: SecureStorageRepository) { }

    async execute(): Promise<Either<Failure, StoredPaymentDetails | null>> {
        return await this.secureStorageRepository.getPaymentDetails();
    }
}
