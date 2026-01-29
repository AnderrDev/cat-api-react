import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen, LinkCardScreen } from '@presentation/screens';

// Tipado de rutas
export type RootStackParamList = {
    Feed: undefined;
    LinkCard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Feed"
                screenOptions={{
                    headerShown: false, // Ocultamos header por defecto
                }}
            >
                <Stack.Screen name="Feed" component={FeedScreen} />
                <Stack.Screen
                    name="LinkCard"
                    component={LinkCardScreen}
                    options={{
                        headerShown: true, // Mostramos header para que tenga botón "Atrás"
                        title: '', // Título vacío
                        headerTransparent: true,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};