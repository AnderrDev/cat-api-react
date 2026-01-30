import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { Cat } from '@domain/entities';

interface Props {
    cat: Cat;
    isFavorite: boolean;
    onToggleFavorite: (cat: Cat) => void;
}

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 300;

// Usamos 'memo' para evitar re-renderizados innecesarios en listas largas
export const CatCard = memo(({ cat, isFavorite, onToggleFavorite }: Props) => {
    return (
        <View style={styles.container}>
            <FastImage
                style={styles.image}
                source={{
                    uri: cat.url,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />

            <View style={styles.footer}>
                <View>
                    <Text style={styles.catId}>Cat #{cat.id}</Text>
                    {cat.breeds && cat.breeds.length > 0 && (
                        <Text style={styles.breedText}>{cat.breeds[0].name}</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => onToggleFavorite(cat)}
                    activeOpacity={0.7}
                >
                    {/* Si no has configurado vector-icons, cambia Icon por un <Text>❤️</Text> */}
                    <Icon
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={28}
                        color={isFavorite ? '#E74C3C' : '#000'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT,
        width: width * 0.9, // 90% del ancho
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 16,
        // Sombras sutiles (Elevation para Android, Shadow para iOS)
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '85%',
        backgroundColor: '#f0f0f0', // Placeholder visual
    },
    footer: {
        height: '15%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    catId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    breedText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    heartButton: {
        padding: 5,
    },
});