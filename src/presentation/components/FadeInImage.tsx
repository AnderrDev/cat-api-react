import React, { useState } from 'react';
import { Animated, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

interface FadeInImageProps {
    uri: string;
    style?: StyleProp<ImageStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

export const FadeInImage = ({ uri, style, containerStyle }: FadeInImageProps) => {
    const [opacity] = useState(new Animated.Value(0));

    const onLoadEnd = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500, // 500ms fade duration
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
                <FastImage
                    style={[style, styles.image]}
                    source={{
                        uri,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable, // Aggressive caching
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadEnd={onLoadEnd}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0', // Placeholder color while loading
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
