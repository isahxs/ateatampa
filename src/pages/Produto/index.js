import { StyleSheet, ActivityIndicator, View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@react-native-vector-icons/feather';

import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../services/firebase';
import { theme } from '../../theme';

import ImagePlaceholder from '../../assets/default-image.png';

export default function Produto({ navigation, route }) {
    const insets = useSafeAreaInsets();

    const { productId } = route.params;

    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const increaseAmount = () => {
        if (amount < 10) {
            setAmount(amount + 1);
        }
    };

    const decreaseAmount = () => {
        if (amount > 1) {
            setAmount(amount - 1);
        }
    };

    useEffect(() => {
        const getProduct = async () => {
            if (!productId) {
                setError('ID do produto não fornecido.');
                setLoading(false);
                return;
            }
            try {
                const productRef = doc(db, 'produtos', productId);
                const productSnapshot = await getDoc(productRef);

                if (productSnapshot.exists()) {
                    setProduct({
                        id: productSnapshot.id,
                        ...productSnapshot.data(),
                    });
                }
            } catch (error) {
                console.error('An error occurred:', error);
                setError('Não foi possível carregar o produto.');
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [productId]);

    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    theme.utils.flexCenter,
                    {
                        gap: theme.spacing[4],
                    },
                ]}
            >
                <ActivityIndicator color={theme.colors.primary} />

                <Text>Carregando Produto...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, theme.utils.justifyCenter, theme.utils.wFull]}>
                <View
                    style={[
                        styles.card,
                        theme.utils.flexCenter,
                        {
                            gap: theme.spacing[2],
                        },
                    ]}
                >
                    <Text style={[theme.utils.textBase, theme.utils.fontMedium]}>Ocorreu Um Erro</Text>

                    <Text
                        style={[
                            theme.utils.textSm,
                            {
                                color: theme.colors.muted,
                            },
                        ]}
                    >
                        {error}
                    </Text>
                </View>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={[styles.container, theme.utils.justifyCenter, theme.utils.wFull]}>
                <View style={[styles.card, theme.utils.flexCenter]}>
                    <Text style={theme.utils.textMd}>Produto Não Encontrado</Text>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Main', {
                                screen: 'Produtos',
                            });
                        }}
                    >
                        <Text
                            style={[
                                { color: theme.colors.muted, marginVertical: theme.spacing[2] },
                                theme.utils.textSm,
                            ]}
                        >
                            Ver Produtos
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const formatPrice =
        typeof product.preco === 'number'
            ? product.preco.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
              })
            : 'Preço Indisponível';

    const imageSource = product.imagemUrl ? { uri: product.imagemUrl } : ImagePlaceholder;

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={{
                paddingBottom: insets.bottom + theme.spacing[4],
            }}
            showsVerticalScrollIndicator={false}
            horizontal={false}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image style={styles.productImage} source={imageSource} />
                </View>

                <View style={styles.main}>
                    <Text style={styles.productName}>{product.nome}</Text>

                    <Text style={styles.productPrice}>{formatPrice}</Text>

                    <Text style={styles.productDescription}>{product.descricao}</Text>

                    <View style={[theme.utils.flexRow, { gap: theme.spacing[4] }]}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeIcon}>
                                <Feather name='award' size={16} color={theme.colors.dark} />
                            </Text>

                            <Text style={styles.badgeTitle}>Ingredientes Frescos</Text>
                        </View>

                        <View style={styles.badge}>
                            <Text style={styles.badgeIcon}>
                                <Feather name='cloud-snow' size={16} color={theme.colors.dark} />
                            </Text>

                            <Text style={styles.badgeTitle}>Manter Refrigerado</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.amountBadge}>
                        <TouchableOpacity onPress={decreaseAmount}>
                            <Text>
                                <Feather name='minus-circle' size={16} color={theme.colors.dark} />
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ paddingHorizontal: theme.spacing[2] }}>{amount}</Text>

                        <TouchableOpacity onPress={increaseAmount}>
                            <Text>
                                <Feather name='plus-circle' size={16} color={theme.colors.dark} />
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnIcon}>
                                <Feather name='shopping-bag' size={16} color={theme.colors.light} />
                            </Text>

                            <Text style={styles.btnText}>Adicionar ao Carrinho</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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

    card: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing[4],
        borderRadius: theme.borders.radius.sm,
        marginVertical: theme.spacing[4],
    },

    header: {
        backgroundColor: theme.colors.brand.parchment,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borders.radius.sm,
        padding: theme.spacing[8],
    },

    productImage: {
        width: 256,
        height: 256,
        borderRadius: theme.borders.radius.sm,
        overflow: 'hidden',
    },

    main: {
        paddingVertical: theme.spacing[4],
    },

    productName: {
        color: theme.colors.dark,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.medium,
        marginBottom: theme.spacing[2],
    },

    productPrice: {
        color: theme.colors.dark,
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.regular,
        marginBottom: theme.spacing[5],
    },

    productDescription: {
        color: theme.colors.muted,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.regular,
        marginBottom: theme.spacing[8],
    },

    badge: {
        backgroundColor: theme.colors.badgeBackground,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing[2],
        minWidth: 160,
        height: 40,
        padding: theme.spacing[3],
        borderRadius: theme.borders.radius.md,
    },

    badgeTitle: {
        color: theme.colors.dark,
        fontSize: theme.typography.sizes.xs,
    },

    badgeIcon: {
        fontSize: theme.typography.sizes.xs,
    },

    footer: {
        alignItems: 'center',
        paddingVertical: theme.spacing[4],
    },

    amountBadge: {
        backgroundColor: theme.colors.system.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing[2],
        minWidth: 100,
        height: 40,
        paddingHorizontal: theme.spacing[4],
        marginBottom: theme.spacing[8],
        borderWidth: 1,
        borderColor: theme.colors.brand.alabaster,
        borderRadius: theme.borders.radius.xl,
    },

    btn: {
        backgroundColor: theme.colors.brand.maroon,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing[2],
        minWidth: '100%',
        minHeight: 48,
        padding: theme.spacing[2],
        borderRadius: theme.borders.radius.xl,
    },

    btnText: {
        color: theme.colors.light,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
});
