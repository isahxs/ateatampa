import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../theme';

import { categories, favorites } from '../../mocks/products';

import Carousel from '../../components/Carousel';

import screenBackground from '../../assets/background.png';

export default function Home({ navigation }) {
    const insets = useSafeAreaInsets();

    const handleProductCategory = () => {
        navigation.navigate('Produtos');
    };

    const handleProductPress = (productId) => {
        navigation.navigate('Produto', {
            productId,
        });
    };

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={{
                paddingBottom: insets.bottom + theme.spacing[4],
            }}
            showsVerticalScrollIndicator={false}
            horizontal={false}
        >
            <View style={styles.section}>
                <View style={[theme.utils.flexRow, theme.utils.flexCenter]}>
                    <Text style={styles.symbol}>&mdash;</Text>

                    <Text style={styles.title}>Explore Nosso Menu</Text>

                    <Text style={styles.symbol}>&mdash;</Text>
                </View>

                <Text style={styles.subtitle}>E Nossa Variedade de Sabores!</Text>
            </View>

            <View style={styles.section}>
                <Image style={styles.image} source={screenBackground} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nosso Menu</Text>

                <Carousel cardStyle='Standard' data={categories} onCardPress={handleProductCategory} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mais Vendidos</Text>

                <Carousel cardStyle='Standard' data={favorites} onCardPress={handleProductPress} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: theme.spacing[3],
    },

    section: {
        marginVertical: theme.spacing[4],
    },

    sectionTitle: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.base,
    },

    title: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.medium,
        textAlign: 'center',
        marginTop: theme.spacing[8],
        marginBottom: theme.spacing[2],
    },

    subtitle: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.light,
        textAlign: 'center',
    },

    symbol: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.light,
        paddingHorizontal: theme.spacing[2],
        marginTop: theme.spacing[8],
        marginBottom: theme.spacing[0],
    },

    image: {
        width: '100%',
        height: 160,
    },

    grid: {
        flexDirection: 'row',
        gap: theme.spacing[4],
        marginVertical: theme.spacing[4],
    },
});
