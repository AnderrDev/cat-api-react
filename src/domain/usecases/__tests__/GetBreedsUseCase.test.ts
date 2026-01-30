import { GetBreedsUseCase } from '../GetBreedsUseCase';
import { CatRepository } from '@domain/repositories';
import { createMockBreeds } from '../../../../__tests__/utils/mockFactories';

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
        mockCatRepository.getBreeds.mockResolvedValue(mockBreeds);

        const result = await getBreedsUseCase.execute();

        expect(result).toEqual(mockBreeds);
        expect(mockCatRepository.getBreeds).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from repository', async () => {
        const error = new Error('Network error');
        mockCatRepository.getBreeds.mockRejectedValue(error);

        await expect(getBreedsUseCase.execute()).rejects.toThrow('Network error');
    });
});
