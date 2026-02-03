import { useRepository } from '@core/di/DiContext';
import { StoredPaymentDetails } from '@domain/entities';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

export const usePremiumDetails = () => {
    const { getPremiumDetailsUseCase, removePremiumUseCase } = useRepository();
    const [details, setDetails] = useState<StoredPaymentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const load = async () => {
                const result = await getPremiumDetailsUseCase.execute();

                pipe(
                    result,
                    fold(
                        (failure) => {
                            console.error("Error loading premium details:", failure.message);
                        },
                        (data) => {
                            if (isActive) {
                                setDetails(data);
                            }
                        }
                    )
                );

                if (isActive) {
                    setIsLoading(false);
                }
            };
            load();

            return () => {
                isActive = false;
            };
        }, [getPremiumDetailsUseCase])
    );

    const removePremium = async () => {
        const result = await removePremiumUseCase.execute();
        pipe(
            result,
            fold(
                (failure) => {
                    console.error("Error removing premium:", failure.message);
                },
                () => {
                    // Update local state
                    setDetails(null);
                }
            )
        );
    };

    return { details, isLoading, removePremium };
};
