import { StyleSheet, View, Text, Image, Pressable, TouchableOpacity } from 'react-native';

import { theme } from '../../theme';

import ImagePlaceholder from '../../assets/default-image.png';

export default function Card({ style = 'Standard', title, price, image, onPress, showFooter }) {
    const formatPrice =
        price !== undefined
            ? price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
              })
            : 'Preço';

    /**
     * Normalizes a local or remote image source.
     */

    const getImageSource = (image) => {
        if (typeof image === 'string' && image.trim().length > 0) {
            return { uri: image };
        }

        if (typeof image === 'number') {
            return image;
        }

        if (
            image !== null &&
            typeof image === 'object' &&
            typeof image.uri === 'string' &&
            image.uri.trim().length > 0
        ) {
            return image;
        }

        return ImagePlaceholder;
    };

    const imageSource = getImageSource(image);

    const Content = style === 'Standard' && (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image style={styles.image} source={imageSource} />
            </View>

            <View style={[styles.main, !showFooter && { paddingBottom: theme.spacing[4] }]}>
                <Text style={styles.title}>{title || 'Título'}</Text>

                {price && <Text style={styles.price}>{formatPrice}</Text>}
            </View>

            {showFooter && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.btn} onPress={onPress}>
                        <Text style={styles.btnText}>Comprar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (onPress) {
        return <Pressable onPress={onPress}>{Content}</Pressable>;
    }

    return Content;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.brand.snow,
        width: 180,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.primary,
        borderRadius: theme.borders.radius.lg,
    },

    image: {
        objectFit: 'cover',
        width: 120,
        height: 120,
        borderRadius: theme.borders.radius.md,
    },

    header: {
        backgroundColor: theme.colors.brand.parchment,
        alignItems: 'center',
        padding: theme.spacing[4],
        borderTopLeftRadius: theme.borders.radius.lg,
        borderTopRightRadius: theme.borders.radius.lg,
    },

    main: {
        alignItems: 'center',
        paddingTop: theme.spacing[4],
    },

    footer: {
        padding: theme.spacing[4],
    },

    title: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
    },

    price: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
    },

    btn: {
        backgroundColor: theme.colors.brand.maroon,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing[2],
        minWidth: '100%',
        minHeight: 40,
        padding: theme.spacing[2],
        borderRadius: theme.borders.radius.sm,
    },

    btnText: {
        color: theme.colors.light,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
});
