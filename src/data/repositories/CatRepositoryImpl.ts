import { CatRepository } from '@domain/repositories/CatRepository';
import { Cat, Breed } from '@domain/entities';
import { CatDataSource } from '@data/datasources';
import { logger } from '@core/utils';
import { Either, left, right } from 'fp-ts/Either';
import { Failure, NetworkFailure } from '@core/errors/Failure';

export class CatRepositoryImpl implements CatRepository {
    constructor(private remoteDataSource: CatDataSource) { }

    async getCats(page: number, limit: number, breedId?: string): Promise<Either<Failure, Cat[]>> {
        try {
            const dtos = await this.remoteDataSource.getCats(page, limit, breedId);
            const cats = dtos.map(dto => ({
                id: dto.id,
                url: dto.url,
                width: dto.width,
                height: dto.height,
                breeds: dto.breeds
            }));
            return right(cats);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error in CatRepository.getCats', error instanceof Error ? error : new Error(message), 'CatRepository', { page, limit, breedId });
            return left(new NetworkFailure(message));
        }
    }

    async getBreeds(): Promise<Either<Failure, Breed[]>> {
        try {
            const dtos = await this.remoteDataSource.getBreeds();
            const breeds = dtos.map(dto => ({
                id: dto.id,
                name: dto.name,
                temperament: dto.temperament,
                origin: dto.origin,
                description: dto.description,
                life_span: dto.life_span
            }));
            return right(breeds);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error in CatRepository.getBreeds', error instanceof Error ? error : new Error(message), 'CatRepository');
            return left(new NetworkFailure(message));
        }
    }
}