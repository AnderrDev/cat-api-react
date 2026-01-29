import React, { createContext, useContext, ReactNode } from 'react';
import { DIContainer } from './DiContainer';
import { appContainer } from './AppContainer';

// 1. Creamos el Contexto
const DIContext = createContext<DIContainer | null>(null);

// 2. El Provider que irá en App.tsx
interface Props {
    children: ReactNode;
    // Permitimos inyectar un contenedor mockeado para Tests de UI
    container?: DIContainer;
}

export const DIProvider: React.FC<Props> = ({ children, container = appContainer }) => {
    return React.createElement(DIContext.Provider, { value: container }, children);
};

// 3. El Hook Mágico (Custom Hook)
export const useRepository = () => {
    const context = useContext(DIContext);
    if (!context) {
        throw new Error('useRepository debe ser usado dentro de un DIProvider');
    }
    return context;
};