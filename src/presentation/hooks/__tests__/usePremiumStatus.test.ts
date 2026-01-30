import { renderHook, waitFor } from '@testing-library/react-native';
import { usePremiumStatus } from '../usePremiumStatus';
import { useRepository } from '@core/di/DiContext';
import { useFocusEffect } from '@react-navigation/native';

jest.mock('@core/di/DiContext');
jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn()
}));

describe('usePremiumStatus', () => {
    const mockGetPremiumStatusUseCase = {
        execute: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRepository as jest.Mock).mockReturnValue({
            getPremiumStatusUseCase: mockGetPremiumStatusUseCase
        });

        // Mock useFocusEffect to immediately call the callback
        (useFocusEffect as jest.Mock).mockImplementation((callback) => {
            callback();
        });
    });

    it('should initialize with loading state', () => {
        mockGetPremiumStatusUseCase.execute.mockResolvedValue(false);

        const { result } = renderHook(() => usePremiumStatus());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isPremium).toBe(false);
    });

    it('should load premium status successfully', async () => {
        mockGetPremiumStatusUseCase.execute.mockResolvedValue(true);

        const { result } = renderHook(() => usePremiumStatus());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isPremium).toBe(true);
        expect(mockGetPremiumStatusUseCase.execute).toHaveBeenCalled();
    });

    it('should handle non-premium status', async () => {
        mockGetPremiumStatusUseCase.execute.mockResolvedValue(false);

        const { result } = renderHook(() => usePremiumStatus());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isPremium).toBe(false);
    });

    it('should handle errors gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockGetPremiumStatusUseCase.execute.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => usePremiumStatus());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error checking premium status:',
            expect.any(Error)
        );
        expect(result.current.isPremium).toBe(false);

        consoleErrorSpy.mockRestore();
    });

    it('should cleanup properly when unmounted', async () => {
        let cleanup: (() => void) | undefined;

        (useFocusEffect as jest.Mock).mockImplementation((callback) => {
            cleanup = callback();
        });

        mockGetPremiumStatusUseCase.execute.mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(true), 100))
        );

        const { unmount } = renderHook(() => usePremiumStatus());

        unmount();

        if (cleanup) {
            cleanup();
        }

        expect(mockGetPremiumStatusUseCase.execute).toHaveBeenCalled();
    });
});
