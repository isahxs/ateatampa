import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

import { formatPrice } from '../../utilities/formatPrice';
import { theme } from '../../theme';

import ImagePlaceholder from '../../assets/default-image.png';

export default function Card({
    style = 'Standard',
    title,
    price,
    image,
    onPress,
    onButtonPress,
    showFooter = false,
}) {
    const hasPrice = price !== undefined && price !== null;
    const formattedPrice = formatPrice(price, 'Preço');

    const getImageSource = (imageValue) => {
        if (
            typeof imageValue === 'string' &&
            imageValue.trim().length > 0
        ) {
            return {
                uri: imageValue,
            };
        }

        if (typeof imageValue === 'number') {
            return imageValue;
        }

        if (
            imageValue !== null &&
            typeof imageValue === 'object' &&
            typeof imageValue.uri === 'string' &&
            imageValue.uri.trim().length > 0
        ) {
            return imageValue;
        }

        return ImagePlaceholder;
    };

    const imageSource = getImageSource(image);

    if (style !== 'Standard') {
        return null;
    }

    const MainContent = (
        <>
            <View style={styles.header}>
                <Image
                    style={styles.image}
                    source={imageSource}
                    resizeMode="cover"
                />
            </View>

            <View
                style={[
                    styles.main,
                    !showFooter && styles.mainWithoutFooter,
                ]}
            >
                <Text style={styles.title}>
                    {title || 'Título'}
                </Text>

                {hasPrice && (
                    <Text style={styles.price}>
                        {formattedPrice}
                    </Text>
                )}
            </View>
        </>
    );

    if (showFooter) {
        return (
            <View style={styles.card}>
                {onPress ? (
                    <Pressable
                        onPress={onPress}
                        accessibilityRole="button"
                    >
                        {MainContent}
                    </Pressable>
                ) : (
                    MainContent
                )}

                <View style={styles.footer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={onButtonPress}
                        disabled={!onButtonPress}
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>
                            Ver Produto
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (onPress) {
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                ]}
                onPress={onPress}
                accessibilityRole="button"
            >
                {MainContent}
            </Pressable>
        );
    }

    return (
        <View style={styles.card}>
            {MainContent}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.brand.snow,
        width: 180,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.borders.radius.lg,
        overflow: 'hidden',
    },

    cardPressed: {
        opacity: 0.8,
    },

    header: {
        backgroundColor: theme.colors.brand.parchment,
        alignItems: 'center',
        padding: theme.spacing[4],
    },

    image: {
        width: 120,
        height: 120,
        borderRadius: theme.borders.radius.md,
    },

    main: {
        alignItems: 'center',
        paddingTop: theme.spacing[4],
        paddingHorizontal: theme.spacing[2],
    },

    mainWithoutFooter: {
        paddingBottom: theme.spacing[4],
    },

    footer: {
        padding: theme.spacing[4],
    },

    title: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
        textAlign: 'center',
    },

    price: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
        marginTop: theme.spacing[2],
    },

    button: {
        backgroundColor: theme.colors.brand.maroon,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '100%',
        minHeight: 40,
        padding: theme.spacing[2],
        borderRadius: theme.borders.radius.sm,
    },

    buttonPressed: {
        opacity: 0.8,
    },

    buttonText: {
        color: theme.colors.light,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
});