import { CatRepository } from '@domain/repositories';
import { Breed } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';

export class GetBreedsUseCase {
    constructor(private catRepository: CatRepository) { }

    async execute(): Promise<Either<Failure, Breed[]>> {
        return await this.catRepository.getBreeds();
    }
}
