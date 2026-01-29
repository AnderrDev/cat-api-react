import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCatFeed, useManageFavorites } from '@presentation/hooks';
import { Cat, LimitReachedError } from '@domain/entities';
import { CatCard } from '@presentation/components';

// Definimos los tipos de navegación aquí (o impórtalos de un archivo types.ts)
type RootStackParamList = {
  Feed: undefined;
  LinkCard: undefined;
};

export const FeedScreen = () => {
  // 1. Hooks de Datos y Lógica
  const { cats, loadMore, isLoading, isFetchingNextPage } = useCatFeed();
  const { isFavorite, toggleFavorite } = useManageFavorites();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // 2. Manejador de Likes (El Core de la Prueba)
  const handleToggleFavorite = useCallback(async (cat: Cat) => {
    try {
      await toggleFavorite(cat);
    } catch (error) {
      // AQUÍ OCURRE LA MAGIA DEL REQUISITO
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

  // 3. Renderizado de cada item (Optimizado)
  const renderItem = useCallback(({ item }: { item: Cat }) => (
    <CatCard
      cat={item}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={handleToggleFavorite}
    />
  ), [isFavorite, handleToggleFavorite]);

  // 4. Renderizado del Footer (Loading al hacer scroll)
  const renderFooter = () => {
    if (!isFetchingNextPage) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>CatWallet 🐱</Text>

      {isLoading && cats.length === 0 ? (
        <ActivityIndicator size="large" style={styles.centerLoader} />
      ) : (
        <FlatList
          data={cats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          // Optimizaciones de Rendimiento
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.5} // Cargar más cuando falte la mitad de la pantalla
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#333',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});   