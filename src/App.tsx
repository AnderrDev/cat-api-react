import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importar
import { DIProvider } from '@core/di/DiContext';
import { AppNavigator } from '@presentation/navigation';
// Instancia del cliente (puedes configurar tiempos de caché aquí)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reintenta 2 veces si falla la red
      staleTime: 1000 * 60 * 5, // Los gatos se consideran "frescos" por 5 minutos
    },
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      {/* El orden importa: DI dentro, o fuera, pero QueryClient debe envolver la UI */}
      <QueryClientProvider client={queryClient}>
        <DIProvider>
          {/* <Navigation /> */}
          <AppNavigator />
        </DIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;