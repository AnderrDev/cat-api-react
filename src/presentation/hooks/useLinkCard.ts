import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRepository } from '@core/di/DiContext';

export const useLinkCard = () => {
    const navigation = useNavigation();
    const { tokenizePaymentMethodUseCase } = useRepository();

    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Formateador visual (1234 5678...)
    const handleCardNumberChange = (text: string) => {
        // Eliminar todo lo que no sea número
        const cleaned = text.replace(/\D/g, '');
        // Agregar espacios cada 4 dígitos
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;

        if (cleaned.length <= 16) {
            setCardNumber(formatted);
        }
    };

    const handleLinkCard = async () => {
        // 1. Validaciones básicas
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (cleanNumber.length < 16) {
            Alert.alert("Error", "El número de tarjeta debe tener 16 dígitos");
            return;
        }
        if (cvv.length < 3) {
            Alert.alert("Error", "CVV inválido");
            return;
        }

        // 2. Proceso de Pago
        try {
            setIsLoading(true);

            // A. Ejecutar el caso de uso (Tokenizar + Guardar)
            await tokenizePaymentMethodUseCase.execute({
                cardNumber: cleanNumber,
                cvv,
                cardHolder: name,
                expirationDate: '12/30' // Simulado
            });

            // B. Feedback y Navegación
            Alert.alert(
                "¡Tarjeta Vinculada!",
                "Ahora tienes acceso ilimitado a favoritos.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );

        } catch (error) {
            const msg = error instanceof Error ? error.message : "No se pudo procesar el pago";
            Alert.alert("Transacción Rechazada", msg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cardNumber,
        cvv,
        name,
        isLoading,
        handleCardNumberChange,
        setCvv,
        setName,
        submit: handleLinkCard
    };
};