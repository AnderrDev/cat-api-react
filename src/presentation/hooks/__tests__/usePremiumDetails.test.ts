import { renderHook, waitFor, act } from '@testing-library/react-native';
import { usePremiumDetails } from '../usePremiumDetails';
import { useRepository } from '@core/di/DiContext';
import { useFocusEffect } from '@react-navigation/native';
import { StoredPaymentDetails } from '@domain/entities';

jest.mock('@core/di/DiContext');
jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn()
}));

describe('usePremiumDetails', () => {
    const mockGetPremiumDetailsUseCase = {
        execute: jest.fn()
    };

    const mockRemovePremiumUseCase = {
        execute: jest.fn()
    };

    const mockPaymentDetails: StoredPaymentDetails = {
        token: {
            accessToken: 'test-token',
            createdAt: Date.now()
        },
        cardInfo: {
            last4: '4242',
            cardHolder: 'JOHN DOE',
            brand: 'Visa',
            expiration: '12/25'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRepository as jest.Mock).mockReturnValue({
            getPremiumDetailsUseCase: mockGetPremiumDetailsUseCase,
            removePremiumUseCase: mockRemovePremiumUseCase
        });

        (useFocusEffect as jest.Mock).mockImplementation((callback) => {
            callback();
        });
    });

    it('should initialize with loading state and null details', () => {
        mockGetPremiumDetailsUseCase.execute.mockResolvedValue(null);

        const { result } = renderHook(() => usePremiumDetails());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.details).toBeNull();
    });

    it('should load premium details successfully', async () => {
        mockGetPremiumDetailsUseCase.execute.mockResolvedValue(mockPaymentDetails);

        const { result } = renderHook(() => usePremiumDetails());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.details).toEqual(mockPaymentDetails);
        expect(mockGetPremiumDetailsUseCase.execute).toHaveBeenCalled();
    });

    it('should handle null details when user is not premium', async () => {
        mockGetPremiumDetailsUseCase.execute.mockResolvedValue(null);

        const { result } = renderHook(() => usePremiumDetails());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.details).toBeNull();
    });

    it('should handle errors when loading details', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockGetPremiumDetailsUseCase.execute.mockRejectedValue(new Error('Storage error'));

        const { result } = renderHook(() => usePremiumDetails());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error loading premium details:',
            expect.any(Error)
        );
        expect(result.current.details).toBeNull();

        consoleErrorSpy.mockRestore();
    });

    it('should remove premium successfully', async () => {
        mockGetPremiumDetailsUseCase.execute.mockResolvedValue(mockPaymentDetails);
        mockRemovePremiumUseCase.execute.mockResolvedValue(undefined);

        const { result } = renderHook(() => usePremiumDetails());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.details).toEqual(mockPaymentDetails);

        // After removal, subsequent loads should return null
        mockGetPremiumDetailsUseCase.execute.mockResolvedValue(null);

        await act(async () => {
            await result.current.removePremium();
        });

        expect(mockRemovePremiumUseCase.execute).toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.details).toBeNull();
        });
    });

    it('should handle errors when removing premium', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockGetPremiumDetailsUseCase.execute.mockResolvedValue(mockPaymentDetails);
        mockRemovePremiumUseCase.execute.mockRejectedValue(new Error('Removal failed'));

        const { result } = renderHook(() => usePremiumDetails());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
            await result.current.removePremium();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error removing premium:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should cleanup properly when unmounted', async () => {
        let cleanup: (() => void) | undefined;

        (useFocusEffect as jest.Mock).mockImplementation((callback) => {
            cleanup = callback();
        });

        mockGetPremiumDetailsUseCase.execute.mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(mockPaymentDetails), 100))
        );

        const { unmount } = renderHook(() => usePremiumDetails());

        unmount();

        if (cleanup) {
            cleanup();
        }

        expect(mockGetPremiumDetailsUseCase.execute).toHaveBeenCalled();
    });
});
