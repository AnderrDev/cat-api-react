import { useQuery } from '@tanstack/react-query';
import { useRepository } from '@core/di/DiContext';

export const usePremiumStatus = () => {
    const { getPremiumStatusUseCase } = useRepository();

    const { data: isPremium = false, isLoading } = useQuery({
        queryKey: ['premiumStatus'],
        queryFn: async () => await getPremiumStatusUseCase.execute(),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    return {
        isPremium,
        isLoading,
    };
};
