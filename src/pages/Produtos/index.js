import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';

import { useEffect, useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getProducts } from '../../services/product';

import { theme } from '../../theme';

import Card from '../../components/Card';

export default function Produtos({ navigation, route }) {
    const insets = useSafeAreaInsets();

    const categoryId = route.params?.categoryId;

    const [products, setProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');

    const handleProductPress = (productId) => {
        navigation.navigate('Produto', {
            productId,
        });
    };

    useEffect(() => {
        async function loadProducts() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const productsData = await getProducts(categoryId);

                setProducts(productsData);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);

                setProducts([]);

                setErrorMessage('Não foi possível carregar os produtos.');
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, [categoryId]);

    const renderProduct = ({ item }) => (
        <Card
            title={item.name}
            price={item.price}
            image={item.imageUrl}
            onPress={() => handleProductPress(item.id)}
            onButtonPress={() => handleProductPress(item.id)}
            showFooter={true}
        />
    );

    const ListHeader = () => (
        <View style={styles.hero}>
            <Text style={styles.title}>Nossos Produtos</Text>

            <Text style={styles.subtitle}>
                {categoryId ? 'Produtos da categoria selecionada.' : 'Aproveite nossa variedade de sabores!'}
            </Text>
        </View>
    );

    const ListEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.feedback}>
                    <ActivityIndicator size='large' color={theme.colors.primary} />

                    <Text style={styles.feedbackText}>Carregando Produtos...</Text>
                </View>
            );
        }

        if (errorMessage) {
            return (
                <View style={styles.feedback}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            );
        }

        return (
            <View style={styles.feedback}>
                <Text style={styles.feedbackText}>
                    {categoryId
                        ? 'Nenhum produto encontrado nesta categoria.'
                        : 'Nenhum produto disponível no momento.'}
                </Text>
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderProduct}
                numColumns={2}
                columnWrapperStyle={products.length > 1 ? styles.grid : undefined}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={ListEmpty}
                contentContainerStyle={[styles.content, products.length === 0 && styles.emptyContent]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },

    content: {
        paddingHorizontal: theme.spacing[3],
        paddingBottom: theme.spacing[6],
    },

    emptyContent: {
        flexGrow: 1,
    },

    hero: {
        marginTop: theme.spacing[4],
        marginBottom: theme.spacing[8],
    },

    grid: {
        flex: 1,
        justifyContent: 'space-between',
        gap: theme.spacing[4],
        marginBottom: theme.spacing[5],
    },

    feedback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing[3],
        paddingVertical: theme.spacing[8],
    },

    feedbackText: {
        color: theme.colors.muted,
        fontSize: theme.typography.sizes.sm,
        textAlign: 'center',
    },

    errorText: {
        color: theme.colors.danger ?? theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
        textAlign: 'center',
    },

    title: {
        color: theme.colors.title,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.medium,
        marginBottom: theme.spacing[2],
    },

    subtitle: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.light,
    },
});
