import { useRepository } from '@core/di/DiContext';
import { useEffect, useState } from 'react';

export const usePremiumStatus = () => {
    const { getPremiumStatusUseCase } = useRepository();
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await getPremiumStatusUseCase.execute();
                setIsPremium(status);
            } catch (error) {
                console.error("Error checking premium status:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, []);

    return {
        isPremium,
        isLoading,
    };
};
