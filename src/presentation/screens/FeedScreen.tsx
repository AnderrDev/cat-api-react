import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCatFeed, useManageFavorites, usePremiumStatus } from '@presentation/hooks';
import { Cat, LimitReachedError } from '@domain/entities';
import { CatCard, BreedFilter } from '@presentation/components';

// Definimos los tipos de navegación aquí (o impórtalos de un archivo types.ts)
type RootStackParamList = {
  Feed: undefined;
  LinkCard: undefined;
  Favorites: undefined;
};

export const FeedScreen = () => {
  // 1. Hooks de Datos y Lógica
  const { cats, breeds, selectedBreedId, setSelectedBreedId, loadMore, isLoading, isFetchingNextPage } = useCatFeed();
  const { isFavorite, toggleFavorite } = useManageFavorites();
  const { isPremium } = usePremiumStatus();

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
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>CatWallet</Text>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Icon name="heart" size={28} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <BreedFilter
        breeds={breeds}
        selectedBreedId={selectedBreedId}
        onSelectBreed={setSelectedBreedId}
      />

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  favoritesButton: {
    padding: 8,
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
