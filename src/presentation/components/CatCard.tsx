import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { FadeInImage } from './FadeInImage';
import Icon from 'react-native-vector-icons/Ionicons';
import { Cat } from '@domain/entities';

interface Props {
    cat: Cat;
    isFavorite: boolean;
    onToggleFavorite: (cat: Cat) => void;
    isLocked?: boolean;
    onPressLock?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 300;

// Use 'memo' to avoid unnecessary re-renders in long lists
export const CatCard = memo(({ cat, isFavorite, onToggleFavorite, isLocked, onPressLock }: Props) => {
    return (
        <View style={styles.container}>
            <FadeInImage
                containerStyle={styles.image}
                uri={cat.url}
            />

            {/* Locked Overlay */}
            {isLocked && (
                <TouchableOpacity
                    style={styles.lockedOverlay}
                    activeOpacity={0.9}
                    onPress={onPressLock}
                >
                    <Icon name="lock-closed" size={40} color="#FFF" />
                    <Text style={styles.lockedText}>Premium Feature</Text>
                    <Text style={styles.lockedSubText}>Tap to Unlock</Text>
                </TouchableOpacity>
            )}

            <View style={styles.footer}>
                <View>
                    <Text style={styles.catId}>Cat #{cat.id}</Text>
                    {cat.breeds && cat.breeds.length > 0 && (
                        <Text style={styles.breedText}>{cat.breeds[0].name}</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => !isLocked && onToggleFavorite(cat)}
                    activeOpacity={0.7}
                    disabled={isLocked}
                >
                    {/* If you haven't configured vector-icons, replace Icon with <Text>❤️</Text> */}
                    <Icon
                        name={isLocked ? 'lock-closed-outline' : (isFavorite ? 'heart' : 'heart-outline')}
                        size={28}
                        color={isLocked ? '#999' : (isFavorite ? '#E74C3C' : '#000')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT,
        width: width * 0.9, // 90% of screen width
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 16,
        // Subtle shadows (Elevation for Android, Shadow for iOS)
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
        backgroundColor: '#f0f0f0', // Visual placeholder
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
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: 16, // Match container border radius
    },
    lockedText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
    },
    lockedSubText: {
        color: '#DDD',
        fontSize: 14,
        marginTop: 4,
    },
});