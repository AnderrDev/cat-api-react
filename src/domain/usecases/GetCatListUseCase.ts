import { CatRepository } from '@domain/repositories';
import { Cat } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';

export class GetCatListUseCase {
    constructor(private catRepository: CatRepository) { }

    async execute(page: number, limit: number = 10, breedId?: string): Promise<Either<Failure, Cat[]>> {
        return await this.catRepository.getCats(page, limit, breedId);
    }
}