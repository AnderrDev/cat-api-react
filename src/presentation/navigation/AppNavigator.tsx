import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen, LinkCardScreen, FavoritesScreen, PremiumScreen } from '@presentation/screens';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Feed"
                screenOptions={{
                    headerShown: false, // Hide header by default
                }}
            >
                <Stack.Screen name="Feed" component={FeedScreen} />
                <Stack.Screen
                    name="LinkCard"
                    component={LinkCardScreen}
                    options={{
                        headerShown: true, // Show header so it has "Back" button
                        title: '', // Empty title
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
                <Stack.Screen
                    name="Premium"
                    component={PremiumScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};