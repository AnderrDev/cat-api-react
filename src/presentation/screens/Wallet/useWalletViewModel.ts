import { useState } from 'react';
import SecureVault from '@core/modules/SecureVault';

export const useWalletViewModel = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Direct access for Demo/Debug purposes
    // In production features (like LinkCard), use TokenizePaymentMethodUseCase via PaymentRepository


    const handleTokenize = async () => {
        setLoading(true);
        setError(null);
        setToken(null);
        try {
            const generatedToken = await SecureVault.tokenizeCard(cardNumber);
            setToken(generatedToken);
            setCardNumber(''); // Clear sensitive data from UI state immediately
        } catch (err: any) {
            setError(err.message || "Tokenization Failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        cardNumber,
        setCardNumber,
        token,
        loading,
        error,
        handleTokenize
    };
};
