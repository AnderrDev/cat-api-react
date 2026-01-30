import React, { createContext, useContext, ReactNode } from 'react';
import { DIContainer } from './DiContainer';
import { appContainer } from './AppContainer';

// 1. Create Context
const DIContext = createContext<DIContainer | null>(null);

// 2. Provider
interface Props {
    children: ReactNode;
    // Allow injecting a mock container for UI Tests
    container?: DIContainer;
}

export const DIProvider: React.FC<Props> = ({ children, container = appContainer }) => {
    return React.createElement(DIContext.Provider, { value: container }, children);
};

// 3. Custom Hook
export const useRepository = () => {
    const context = useContext(DIContext);
    if (!context) {
        throw new Error('useRepository must be used within a DIProvider');
    }
    return context;
};