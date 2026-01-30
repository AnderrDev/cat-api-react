import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DIProvider } from '@core/di/DiContext';
import { AppNavigator } from '@presentation/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <DIProvider>
        {/* <Navigation /> */}
        <AppNavigator />
      </DIProvider>
    </SafeAreaProvider>
  );
};

export default App;