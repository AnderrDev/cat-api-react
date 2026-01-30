import { RegisterOptions } from 'react-hook-form';
import { ValidationUtils } from '@core/utils/validation';

export interface CardFormData {
    name: string;
    cardNumber: string;
    cvv: string;
    expiration: string;
}

export const cardFormRules: Record<keyof CardFormData, RegisterOptions<CardFormData>> = {
    name: {
        required: 'El nombre es requerido',
        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
        maxLength: { value: 50, message: 'Máximo 50 caracteres' }
    },
    cardNumber: {
        required: 'El número de tarjeta es requerido',
        validate: (value: string) => {
            const cleaned = value.replace(/\s/g, '');
            return cleaned.length === 16 || 'Debe tener 16 dígitos';
        }
    },
    cvv: {
        required: 'El CVV es requerido',
        pattern: { value: /^\d{3}$/, message: 'Debe tener 3 dígitos' }
    },
    expiration: {
        required: 'La fecha de expiración es requerida',
        validate: (value: string) => {
            if (value.length !== 5) return 'Formato: MM/YY';
            return ValidationUtils.isValidExpiration(value) || 'Fecha inválida o expirada';
        }
    }
};
