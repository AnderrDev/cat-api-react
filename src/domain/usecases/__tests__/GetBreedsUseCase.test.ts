import { GetBreedsUseCase } from '../GetBreedsUseCase';
import { CatRepository } from '@domain/repositories';
import { createMockBreeds } from '../../../../__tests__/utils/mockFactories';
import { right, left } from 'fp-ts/Either';
import { NetworkFailure } from '@core/errors/Failure';

describe('GetBreedsUseCase', () => {
    let getBreedsUseCase: GetBreedsUseCase;
    let mockCatRepository: jest.Mocked<CatRepository>;

    beforeEach(() => {
        mockCatRepository = {
            getCats: jest.fn(),
            getBreeds: jest.fn(),
        } as jest.Mocked<CatRepository>;

        getBreedsUseCase = new GetBreedsUseCase(mockCatRepository);
    });

    it('should return breeds from repository', async () => {
        const mockBreeds = createMockBreeds(3);
        mockCatRepository.getBreeds.mockResolvedValue(right(mockBreeds));

        const result = await getBreedsUseCase.execute();

        expect(result).toEqual(right(mockBreeds));
        expect(mockCatRepository.getBreeds).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from repository', async () => {
        const failure = new NetworkFailure('Network error');
        mockCatRepository.getBreeds.mockResolvedValue(left(failure));

        const result = await getBreedsUseCase.execute();

        expect(result).toEqual(left(failure));
    });
});
