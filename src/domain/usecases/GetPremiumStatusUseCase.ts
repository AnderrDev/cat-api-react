import { SecureStorageRepository } from '@domain/repositories';
import { Either, map } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';
import { pipe } from 'fp-ts/function';

export class GetPremiumStatusUseCase {
    constructor(private secureStorageRepository: SecureStorageRepository) { }

    async execute(): Promise<Either<Failure, boolean>> {
        const result = await this.secureStorageRepository.getToken();
        return pipe(
            result,
            map(token => !!token)
        );
    }
}
