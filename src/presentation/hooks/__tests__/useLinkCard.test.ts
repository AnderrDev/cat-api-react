import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useLinkCard } from '../useLinkCard';
import { useRepository } from '@core/di/DiContext';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.mock('@core/di/DiContext');
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn()
}));

describe('useLinkCard', () => {
    const mockTokenizePaymentMethodUseCase = {
        execute: jest.fn()
    };

    const mockNavigation = {
        goBack: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRepository as jest.Mock).mockReturnValue({
            tokenizePaymentMethodUseCase: mockTokenizePaymentMethodUseCase
        });
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

        jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
            if (buttons && buttons[0].onPress) {
                buttons[0].onPress();
            }
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize with form control and utilities', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.control).toBeDefined();
        expect(result.current.errors).toBeDefined();
        expect(result.current.isValid).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.formatCardNumber).toBeInstanceOf(Function);
        expect(result.current.formatExpiration).toBeInstanceOf(Function);
        expect(result.current.submit).toBeInstanceOf(Function);
        expect(result.current.rules).toBeDefined();
    });

    it('should format card number correctly', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456');
        expect(result.current.formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
        expect(result.current.formatCardNumber('123')).toBe('123');
    });

    it('should limit card number to 19 characters (16 digits + 3 spaces)', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.formatCardNumber('12345678901234567890')).toBe('1234 5678 9012 3456');
    });

    it('should remove non-digit characters from card number', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.formatCardNumber('1234-5678-9012-3456')).toBe('1234 5678 9012 3456');
        expect(result.current.formatCardNumber('1234 abcd 5678')).toBe('1234 5678');
    });

    it('should format expiration date correctly', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.formatExpiration('1225')).toBe('12/25');
        expect(result.current.formatExpiration('0126')).toBe('01/26');
        expect(result.current.formatExpiration('12')).toBe('12');
        expect(result.current.formatExpiration('1')).toBe('1');
    });

    it('should remove non-digit characters from expiration', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.formatExpiration('12/25')).toBe('12/25');
        expect(result.current.formatExpiration('ab12cd25')).toBe('12/25');
    });

    it('should limit expiration to MM/YY format', () => {
        const { result } = renderHook(() => useLinkCard());

        expect(result.current.formatExpiration('12252026')).toBe('12/25');
    });

    it('should submit card successfully and show success alert', async () => {
        mockTokenizePaymentMethodUseCase.execute.mockResolvedValue(undefined);

        const { result } = renderHook(() => useLinkCard());

        const formData = {
            name: 'John Doe',
            cardNumber: '4242 4242 4242 4242',
            cvv: '123',
            expiration: '12/25'
        };

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        expect(mockTokenizePaymentMethodUseCase.execute).toHaveBeenCalledWith({
            cardNumber: '4242424242424242',
            cvv: '123',
            cardHolder: 'JOHN DOE',
            expirationDate: '12/25'
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            '¡Tarjeta Vinculada!',
            'Ahora tienes acceso ilimitado a favoritos.',
            expect.any(Array)
        );

        expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should handle submission error with custom message', async () => {
        mockTokenizePaymentMethodUseCase.execute.mockRejectedValue(new Error('Invalid card'));

        const { result } = renderHook(() => useLinkCard());

        const formData = {
            name: 'John Doe',
            cardNumber: '4242 4242 4242 4242',
            cvv: '123',
            expiration: '12/25'
        };

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            'Transacción Rechazada',
            'Invalid card'
        );

        expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });

    it('should handle submission error with default message', async () => {
        mockTokenizePaymentMethodUseCase.execute.mockRejectedValue('Unknown error');

        const { result } = renderHook(() => useLinkCard());

        const formData = {
            name: 'John Doe',
            cardNumber: '4242 4242 4242 4242',
            cvv: '123',
            expiration: '12/25'
        };

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            'Transacción Rechazada',
            'No se pudo procesar el pago'
        );
    });

    it('should convert card holder name to uppercase', async () => {
        mockTokenizePaymentMethodUseCase.execute.mockResolvedValue(undefined);

        const { result } = renderHook(() => useLinkCard());

        const formData = {
            name: 'john doe',
            cardNumber: '4242 4242 4242 4242',
            cvv: '123',
            expiration: '12/25'
        };

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        expect(mockTokenizePaymentMethodUseCase.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                cardHolder: 'JOHN DOE'
            })
        );
    });

    it('should remove spaces from card number before submission', async () => {
        mockTokenizePaymentMethodUseCase.execute.mockResolvedValue(undefined);

        const { result } = renderHook(() => useLinkCard());

        const formData = {
            name: 'John Doe',
            cardNumber: '4242 4242 4242 4242',
            cvv: '123',
            expiration: '12/25'
        };

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        expect(mockTokenizePaymentMethodUseCase.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                cardNumber: '4242424242424242'
            })
        );
    });
});
