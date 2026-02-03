import { useState } from 'react';
import { TokenizeCardUseCase } from '../../../domain/usecases/TokenizeCardUseCase';
import { WalletRepositoryImpl } from '../../../data/repositories/WalletRepositoryImpl';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

export const useWalletViewModel = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = new WalletRepositoryImpl();
    const tokenizeCardUseCase = new TokenizeCardUseCase(repository);

    const handleTokenize = async () => {
        setLoading(true);
        setError(null);
        setToken(null);

        try {
            const result = await tokenizeCardUseCase.execute(cardNumber);
            pipe(
                result,
                fold(
                    (failure) => {
                        setError(failure.message);
                    },
                    (generatedToken) => {
                        setToken(generatedToken);
                        setCardNumber(''); // Clear sensitive data from UI state immediately
                    }
                )
            );
        } catch (err: any) {
            // Should not happen as we catch in repository, but safety net
            setError(err.message || "Unexpected Error");
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
