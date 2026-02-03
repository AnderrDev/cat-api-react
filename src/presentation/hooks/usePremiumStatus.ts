import { useRepository } from '@core/di/DiContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

export const usePremiumStatus = () => {
    const { getPremiumStatusUseCase } = useRepository();
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const checkStatus = async () => {
                const result = await getPremiumStatusUseCase.execute();

                pipe(
                    result,
                    fold(
                        (failure) => console.error("Error checking premium status:", failure.message),
                        (status) => {
                            if (isActive) {
                                setIsPremium(status);
                            }
                        }
                    )
                );

                if (isActive) {
                    setIsLoading(false);
                }
            };
            checkStatus();

            return () => {
                isActive = false;
            };
        }, [getPremiumStatusUseCase])
    );

    return {
        isPremium,
        isLoading,
    };
};
