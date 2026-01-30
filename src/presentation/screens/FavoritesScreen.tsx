import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useManageFavorites } from '@presentation/hooks';
import { Cat, LimitReachedError } from '@domain/entities';
import { CatCard } from '@presentation/components';
import { RootStackParamList } from '@presentation/navigation/types';

export const FavoritesScreen = () => {
    const { favorites, isFavorite, toggleFavorite } = useManageFavorites();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleToggleFavorite = useCallback(async (cat: Cat) => {
        try {
            await toggleFavorite(cat);
        } catch (error) {
            if (error instanceof LimitReachedError) {
                Alert.alert(
                    "Límite Gratuito Alcanzado",
                    "Para agregar más de 3 gatos a favoritos, necesitas validar tu cuenta.",
                    [
                        { text: "Cancelar", style: "cancel" },
                        {
                            text: "Vincular Tarjeta",
                            onPress: () => navigation.navigate('LinkCard'),
                            style: "default"
                        }
                    ]
                );
            } else {
                Alert.alert("Error", "No pudimos actualizar tus favoritos.");
            }
        }
    }, [toggleFavorite, navigation]);

    const renderItem = useCallback(({ item }: { item: Cat }) => (
        <CatCard
            cat={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={handleToggleFavorite}
        />
    ), [isFavorite, handleToggleFavorite]);

    return (
        <View style={styles.container}>
            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tienes favoritos aún 😿</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    listContent: {
        paddingVertical: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
});
