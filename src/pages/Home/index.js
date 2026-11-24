import { StyleSheet, View, ScrollView, Text, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../../theme';

import { getCategories } from '../../services/category';
import { getFeaturedProducts } from '../../services/product';

import Carousel from '../../components/Carousel';

import screenBackground from '../../assets/background.png';

export default function Home({ navigation }) {
    const insets = useSafeAreaInsets();

    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleProductCategory = (categoryId) => {
        navigation.navigate('Produtos', {
            categoryId,
        });
    };

    const handleProductPress = (productId) => {
        navigation.navigate('Produto', {
            productId,
        });
    };

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const [categoriesData, productsData] = await Promise.all([getCategories(), getFeaturedProducts()]);

                setCategories(categoriesData);
                setFeaturedProducts(productsData);
            } catch (error) {
                console.error('Erro ao carregar Home:', error);

                setErrorMessage('Não foi possível carregar os produtos.');
            } finally {
                setIsLoading(false);
            }
        };
        loadHomeData();
    }, []);

    if (isLoading) {
        return (
            <View
                style={[
                    styles.container,
                    styles.centered,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >
                <ActivityIndicator size='large' color={theme.colors.primary} />
            </View>
        );
    }

    if (errorMessage) {
        return (
            <View
                style={[
                    styles.container,
                    styles.centered,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                },
            ]}
            contentContainerStyle={{
                paddingBottom: insets.bottom + theme.spacing[4],
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.section}>
                <View style={[theme.utils.flexRow, theme.utils.flexCenter]}>
                    <Text style={styles.symbol}>—</Text>

                    <Text style={styles.title}>Explore Nosso Menu</Text>

                    <Text style={styles.symbol}>—</Text>
                </View>

                <Text style={styles.subtitle}>E Nossa Variedade de Sabores!</Text>
            </View>

            <View style={styles.section}>
                <Image style={styles.image} source={screenBackground} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nosso Menu</Text>

                {categories.length > 0 ? (
                    <Carousel data={categories} onCardPress={handleProductCategory} />
                ) : (
                    <Text>Nenhuma Categoria Disponível.</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Destaques</Text>

                {featuredProducts.length > 0 ? (
                    <Carousel cardStyle='Standard' data={featuredProducts} onCardPress={handleProductPress} />
                ) : (
                    <Text>Nenhum Produto em Destaque.</Text>
                )}
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

    centered: {
        justifyContent: 'center',
        alignItems: 'center',
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
    },

    image: {
        width: '100%',
        height: 160,
    },

    errorText: {
        color: theme.colors.danger || theme.colors.primary,
        textAlign: 'center',
        fontSize: theme.typography.sizes.base,
    },
});
