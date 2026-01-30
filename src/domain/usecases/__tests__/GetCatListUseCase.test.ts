import { GetCatListUseCase } from '../GetCatListUseCase';
import { CatRepository } from '@domain/repositories';
import { createMockCats } from '../../../../__tests__/utils/mockFactories';

describe('GetCatListUseCase', () => {
    let getCatListUseCase: GetCatListUseCase;
    let mockCatRepository: jest.Mocked<CatRepository>;

    beforeEach(() => {
        mockCatRepository = {
            getCats: jest.fn(),
            getBreeds: jest.fn(),
        } as jest.Mocked<CatRepository>;

        getCatListUseCase = new GetCatListUseCase(mockCatRepository);
    });

    it('should return cats with default limit', async () => {
        const mockCats = createMockCats(10);
        mockCatRepository.getCats.mockResolvedValue(mockCats);

        const result = await getCatListUseCase.execute(0);

        expect(result).toEqual(mockCats);
        expect(mockCatRepository.getCats).toHaveBeenCalledWith(0, 10, undefined);
    });

    it('should return cats with custom limit', async () => {
        const mockCats = createMockCats(20);
        mockCatRepository.getCats.mockResolvedValue(mockCats);

        const result = await getCatListUseCase.execute(1, 20);

        expect(result).toEqual(mockCats);
        expect(mockCatRepository.getCats).toHaveBeenCalledWith(1, 20, undefined);
    });

    it('should filter by breed when provided', async () => {
        const mockCats = createMockCats(5);
        mockCatRepository.getCats.mockResolvedValue(mockCats);

        const result = await getCatListUseCase.execute(0, 10, 'siamese');

        expect(result).toEqual(mockCats);
        expect(mockCatRepository.getCats).toHaveBeenCalledWith(0, 10, 'siamese');
    });

    it('should handle pagination correctly', async () => {
        const mockCats = createMockCats(10);
        mockCatRepository.getCats.mockResolvedValue(mockCats);

        await getCatListUseCase.execute(2, 15, 'persian');

        expect(mockCatRepository.getCats).toHaveBeenCalledWith(2, 15, 'persian');
    });

    it('should propagate errors from repository', async () => {
        const error = new Error('Network error');
        mockCatRepository.getCats.mockRejectedValue(error);

        await expect(getCatListUseCase.execute(0, 10)).rejects.toThrow('Network error');
    });
});
