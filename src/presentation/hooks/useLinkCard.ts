import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRepository } from '@core/di/DiContext';
import { CardFormData, cardFormRules } from '@presentation/validation/cardFormRules';

export const useLinkCard = () => {
    const navigation = useNavigation();
    const { tokenizePaymentMethodUseCase } = useRepository();

    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<CardFormData>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            cardNumber: '',
            cvv: '',
            expiration: ''
        }
    });

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.slice(0, 19); // Max: "1234 5678 9012 3456"
    };

    const formatExpiration = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 3) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const onSubmit = async (data: CardFormData) => {
        const cleanNumber = data.cardNumber.replace(/\s/g, '');

        try {
            await tokenizePaymentMethodUseCase.execute({
                cardNumber: cleanNumber,
                cvv: data.cvv,
                cardHolder: data.name.toUpperCase(),
                expirationDate: data.expiration
            });

            Alert.alert(
                "¡Tarjeta Vinculada!",
                "Ahora tienes acceso ilimitado a favoritos.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            const msg = error instanceof Error ? error.message : "No se pudo procesar el pago";
            Alert.alert("Transacción Rechazada", msg);
        }
    };

    return {
        control,
        errors,
        isValid,
        isSubmitting,
        formatCardNumber,
        formatExpiration,
        onSubmit,
        submit: handleSubmit(onSubmit),
        rules: cardFormRules
    };
};