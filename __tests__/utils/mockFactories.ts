import { Cat, Breed } from '@domain/entities';

/**
 * Mock cat factory for testing
 */
export const createMockCat = (overrides?: Partial<Cat>): Cat => ({
    id: 'test-cat-1',
    url: 'https://example.com/cat.jpg',
    breeds: [],
    ...overrides,
});

/**
 * Mock breed factory for testing
 */
export const createMockBreed = (overrides?: Partial<Breed>): Breed => ({
    id: 'test-breed-1',
    name: 'Persian',
    temperament: 'Calm',
    origin: 'Iran',
    description: 'Test breed',
    life_span: '10-15 years',
    ...overrides,
});

/**
 * Mock payment input for testing
 */
export const createMockPaymentInput = () => ({
    cardNumber: '1234567812345678',
    cvv: '123',
    cardHolder: 'JOHN DOE',
    expirationDate: '12/25',
});

/**
 * Creates multiple mock cats for testing lists
 */
export const createMockCats = (count: number): Cat[] =>
    Array.from({ length: count }, (_, i) => createMockCat({ id: `test-cat-${i + 1}` }));

/**
 * Creates multiple mock breeds for testing lists
 */
export const createMockBreeds = (count: number): Breed[] =>
    Array.from({ length: count }, (_, i) => createMockBreed({ id: `breed-${i + 1}`, name: `Breed ${i + 1}` }));
