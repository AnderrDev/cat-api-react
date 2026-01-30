import { useRepository } from '@core/di/DiContext';
import { StoredPaymentDetails } from '@domain/entities';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export const usePremiumDetails = () => {
    const { getPremiumDetailsUseCase } = useRepository();
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

    return { details, isLoading };
};
