export const ValidationUtils = {
    /**
     * Valida el número de tarjeta usando el Algoritmo de Luhn.
     */
    isValidLuhn: (cardNumber: string): boolean => {
        const cleaned = cardNumber.replace(/\D/g, '');
        if (!cleaned || cleaned.length < 13) return false;

        let sum = 0;
        let shouldDouble = false;

        // Iterar desde el final hacia el principio
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i), 10);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return (sum % 10) === 0;
    },

    /**
     * Valida la fecha de expiración (MM/YY).
     * Debe ser un mes válido y una fecha futura.
     */
    isValidExpiration: (expiration: string): boolean => {
        if (!expiration || expiration.length !== 5) return false; // MM/YY

        const [month, year] = expiration.split('/');

        const expMonth = parseInt(month, 10);
        const expYear = parseInt('20' + year, 10); // Asumimos siglo 21

        if (isNaN(expMonth) || isNaN(expYear)) return false;
        if (expMonth < 1 || expMonth > 12) return false;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    }
};
