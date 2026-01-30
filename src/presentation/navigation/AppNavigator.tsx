import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen, LinkCardScreen, FavoritesScreen } from '@presentation/screens';
import { RootStackParamList } from './types';

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
                <Stack.Screen
                    name="Favorites"
                    component={FavoritesScreen}
                    options={{
                        headerShown: true,
                        title: 'Favoritos',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};