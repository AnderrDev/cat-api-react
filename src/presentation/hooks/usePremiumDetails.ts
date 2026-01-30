import { useRepository } from '@core/di/DiContext';
import { StoredPaymentDetails } from '@domain/entities';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export const usePremiumDetails = () => {
    const { getPremiumDetailsUseCase, removePremiumUseCase } = useRepository();
    const [details, setDetails] = useState<StoredPaymentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const load = async () => {
                try {
                    const data = await getPremiumDetailsUseCase.execute();
                    if (isActive) {
                        setDetails(data);
                    }
                } catch (error) {
                    console.error("Error loading premium details:", error);
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            };
            load();

            return () => {
                isActive = false;
            };
        }, [getPremiumDetailsUseCase])
    );

    const removePremium = async () => {
        try {
            await removePremiumUseCase.execute();
            // Invalidate/Update local state if needed, or navigation will handle clean up
            setDetails(null);
        } catch (error) {
            console.error("Error removing premium:", error);
        }
    };

    return { details, isLoading, removePremium };
};
