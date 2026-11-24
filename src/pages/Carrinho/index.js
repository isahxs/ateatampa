import { useState } from 'react';

import {
    StyleSheet,
    ActivityIndicator,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Feather } from '@react-native-vector-icons/feather';

import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

import { searchAddress, normalizeCep, validateCep } from '../../services/cep';
import { createOrder } from '../../services/order';
import { openOrderOnWhatsApp } from '../../services/whatsapp';

import { showError, showConfirmation } from '../../utilities/alerts';
import { formatPrice } from '../../utilities/formatPrice';

import { theme } from '../../theme';

const initialAddress = {
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    complemento: '',
};

export default function Carrinho() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const { cartItems, removeItem, increaseItem, decreaseItem, clearCart } = useCart();
    const { user } = useAuth();

    const [address, setAddress] = useState(initialAddress);
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);
    const [isFinishingOrder, setIsFinishingOrder] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const subtotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const totalItemsCart = cartItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    const normalizedCep = normalizeCep(address.cep);

    const isCepValid = validateCep(normalizedCep);

    const handleAddressChange = (field, value) => {
        setAddress((currentAddress) => ({
            ...currentAddress,
            [field]: value,
        }));
    };

    const handleFetchCep = async () => {
        const currentCep = normalizeCep(address.cep);

        if (!validateCep(currentCep)) {
            setErrorMessage('Por favor, digite um CEP válido.');

            return;
        }

        try {
            setIsSearchingAddress(true);
            setErrorMessage('');

            const response = await searchAddress(currentCep);

            setAddress((currentAddress) => ({
                ...currentAddress,
                cep: response.cep || currentAddress.cep,
                logradouro: response.logradouro || '',
                bairro: response.bairro || '',
                localidade: response.localidade || '',
                uf: response.uf || '',
            }));

            Keyboard.dismiss();
        } catch (error) {
            setErrorMessage(error.message || 'Não foi possível consultar o CEP.');
        } finally {
            setIsSearchingAddress(false);
        }
    };

    const handleClear = () => {
        showConfirmation('Limpar Carrinho', 'Tem certeza de que deseja limpar o carrinho e o endereço?', 'Sim', () => {
            clearCart();

            setAddress(initialAddress);
            setErrorMessage('');
            setIsSearchingAddress(false);

            Keyboard.dismiss();
        });
    };

    const handleFinishOrder = async () => {
        if (isFinishingOrder) {
            return;
        }

        if (!validateOrder()) {
            return;
        }

        const deliveryAddress = {
            ...address,
            numero: address.numero.trim(),
            complemento: address.complemento.trim(),
        };

        let order = createdOrder;

        try {
            setIsFinishingOrder(true);

            if (!order) {
                order = await createOrder({
                    cartItems,
                    deliveryAddress,
                    userId: user.uid,
                });

                setCreatedOrder(order);
            }

            await openOrderOnWhatsApp(order);

            clearCart();
            setAddress(initialAddress);
            setErrorMessage('');
            setCreatedOrder(null);

            navigation.navigate('Pedidos');
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);

            if (order) {
                showError(
                    'O pedido foi registrado, mas não foi possível abrir o WhatsApp. Pressione novamente para tentar abrir a conversa.',
                );

                return;
            }

            showError(error.message || 'Não foi possível registrar o pedido.');
        } finally {
            setIsFinishingOrder(false);
        }
    };

    const handleNavigateToProducts = () => {
        navigation.navigate('Produtos', {
            categoryId: null,
        });
    };

    const validateOrder = () => {
        if (cartItems.length === 0) {
            showError('Adicione pelo menos um produto antes de continuar.');

            return false;
        }

        if (!address.logradouro) {
            showError('Consulte um CEP válido antes de continuar.');

            return false;
        }

        if (!address.numero.trim()) {
            showError('Informe o número do endereço antes de continuar.');

            return false;
        }

        if (!user?.uid) {
            showError('Faça login para finalizar o pedido.');

            return false;
        }

        return true;
    };

    const formatCepInput = (value) => {
        const normalizedCep = normalizeCep(value).slice(0, 8);

        if (normalizedCep.length <= 5) {
            return normalizedCep;
        }

        return `${normalizedCep.slice(0, 5)}-${normalizedCep.slice(5)}`;
    };

    const renderCartHeader = () => {
        return (
            <>
                <View style={styles.section}>
                    <Text style={styles.title}>Meu Carrinho</Text>
                </View>

                {cartItems.length > 0 && (
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <View style={[styles.tableCell, styles.productColumn]}>
                                <Text style={styles.headerText}>Produto</Text>
                            </View>

                            <View style={[styles.tableCell, styles.priceColumn]}>
                                <Text style={styles.headerText}>Preço</Text>
                            </View>

                            <View style={[styles.tableCell, styles.amountColumn]}>
                                <Text style={styles.headerText}>Quantidade</Text>
                            </View>
                        </View>
                    </View>
                )}
            </>
        );
    };

    const renderCartItem = ({ item }) => {
        return (
            <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.productColumn]}>
                    <Text style={[styles.itemText, styles.productName]}>{item.name}</Text>

                    <TouchableOpacity onPress={() => removeItem(item.id)} accessibilityRole='button'>
                        <Text style={styles.removeText}>Remover</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.tableCell, styles.priceColumn]}>
                    <Text style={styles.itemText}>{formatPrice(item.price)}</Text>
                </View>

                <View style={[styles.tableCell, styles.amountColumn]}>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity onPress={() => decreaseItem(item.id)} accessibilityRole='button' hitSlop={6}>
                            <Feather
                                name={item.quantity <= 1 ? 'trash' : 'minus-circle'}
                                size={20}
                                color={theme.colors.dark}
                            />
                        </TouchableOpacity>

                        <Text style={styles.itemText}>{item.quantity}</Text>

                        <TouchableOpacity onPress={() => increaseItem(item.id)} accessibilityRole='button' hitSlop={6}>
                            <Feather name='plus-circle' size={20} color={theme.colors.dark} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderCartFooter = () => {
        if (cartItems.length === 0) {
            return null;
        }

        return (
            <View style={styles.footer}>
                <View style={[theme.utils.flexRow, theme.utils.justifyBetween, styles.cartSummaryHeader]}>
                    <Text style={styles.footerTitle}>Total no Carrinho</Text>

                    <Text style={styles.totalItemsCart}>{totalItemsCart}</Text>
                </View>

                <Text style={styles.subTotal}>Subtotal: {formatPrice(subtotal)}</Text>

                <View>
                    <View style={[theme.utils.flexRow, theme.utils.alignCenter, styles.addressHeader]}>
                        <Feather name='map-pin' size={20} color={theme.colors.dark} />

                        <Text style={styles.addressTitle}>Endereço de Entrega</Text>
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>CEP *</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='00000-000'
                            value={address.cep}
                            onChangeText={(text) => {
                                handleAddressChange('cep', formatCepInput(text));
                                setErrorMessage('');
                            }}
                            keyboardType='number-pad'
                            maxLength={9}
                        />

                        {isSearchingAddress && <ActivityIndicator color={theme.colors.dark} />}

                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Número *</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='Ex.: 125'
                            value={address.numero}
                            onChangeText={(text) => {
                                handleAddressChange('numero', text);

                                setErrorMessage('');
                            }}
                            keyboardType='number-pad'
                            maxLength={10}
                        />
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.label}>Complemento</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='Ex.: Apto. 12, bloco B'
                            value={address.complemento}
                            onChangeText={(text) => {
                                handleAddressChange('complemento', text);

                                setErrorMessage('');
                            }}
                            maxLength={60}
                        />
                    </View>

                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                styles.btnSearch,
                                (!isCepValid || isSearchingAddress) && styles.btnDisabled,
                            ]}
                            onPress={handleFetchCep}
                            disabled={!isCepValid || isSearchingAddress}
                            accessibilityRole='button'
                        >
                            <Text style={styles.btnText}>{isSearchingAddress ? 'Buscando...' : 'Buscar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {address.logradouro ? (
                    <View style={styles.address}>
                        <View style={styles.result}>
                            <Text style={styles.textResult}>CEP: {address.cep}</Text>

                            <Text style={styles.textResult}>
                                {address.logradouro}
                                {address.numero ? `, ${address.numero}` : ''}
                            </Text>

                            <Text style={styles.textResult}>{address.bairro}</Text>

                            <Text style={styles.textResult}>
                                {address.localidade} - {address.uf}
                            </Text>

                            {address.complemento ? <Text style={styles.textResult}>{address.complemento}</Text> : null}
                        </View>
                    </View>
                ) : null}

                <View>
                    <View style={[theme.utils.flexRow, theme.utils.justifyBetween, styles.totalContainer]}>
                        <Text style={styles.totalTitle}>Total</Text>

                        <Text style={styles.finalValue}>{formatPrice(subtotal)}</Text>
                    </View>

                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnClear, isFinishingOrder && styles.btnDisabled]}
                            onPress={handleClear}
                            disabled={isFinishingOrder}
                        >
                            <Text style={styles.btnText}>Limpar Carrinho</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnPayment, isFinishingOrder && styles.btnDisabled]}
                            onPress={handleFinishOrder}
                            disabled={isFinishingOrder}
                            accessibilityRole='button'
                            accessibilityState={{
                                disabled: isFinishingOrder,
                                busy: isFinishingOrder,
                            }}
                        >
                            {isFinishingOrder ? (
                                <ActivityIndicator size='small' color={theme.colors.light} />
                            ) : (
                                <FontAwesome name='whatsapp' size={20} color={theme.colors.light} />
                            )}

                            <Text style={styles.btnText}>
                                {isFinishingOrder
                                    ? 'Finalizando...'
                                    : createdOrder
                                      ? 'Tentar Abrir WhatsApp'
                                      : 'Finalizar Pedido'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderEmptyCart = () => {
        return (
            <View style={[theme.utils.flexGrow1, theme.utils.justifyCenter]}>
                <View style={styles.emptyContainer}>
                    <Feather name='shopping-cart' size={48} color={theme.colors.primaryHover} />

                    <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>

                    <TouchableOpacity onPress={handleNavigateToProducts} accessibilityRole='button'>
                        <Text style={styles.emptyText}>Adicione produtos para continuar com o pedido.</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={cartItems}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCartItem}
                ListHeaderComponent={renderCartHeader()}
                ListFooterComponent={renderCartFooter()}
                ListEmptyComponent={renderEmptyCart()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, cartItems.length === 0 && styles.emptyContent]}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='on-drag'
                removeClippedSubviews={false}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },

    content: {
        paddingHorizontal: theme.spacing[4],
        paddingBottom: theme.spacing[6],
    },

    section: {
        marginVertical: theme.spacing[4],
        marginHorizontal: theme.spacing[2],
    },

    title: {
        color: theme.colors.title,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.xl,
        marginBottom: theme.spacing[2],
    },

    label: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.sm,
        marginBottom: theme.spacing[1],
    },

    input: {
        backgroundColor: theme.colors.brand.snow,
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        paddingHorizontal: theme.spacing[3],
        minHeight: 48,
        borderWidth: 1,
        borderColor: theme.colors.muted,
        borderRadius: theme.borders.radius.md,
        marginBottom: theme.spacing[2],
    },

    errorText: {
        color: theme.colors.brand.maroon,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.xs,
        marginHorizontal: theme.spacing[1],
        marginBottom: theme.spacing[4],
    },

    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing[2],
        minHeight: 40,
        padding: theme.spacing[2],
        borderRadius: theme.borders.radius.sm,
    },

    btnText: {
        color: theme.colors.light,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },

    btnDisabled: {
        opacity: 0.6,
    },

    table: {
        width: '100%',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.colors.dark,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },

    tableHeader: {
        backgroundColor: theme.colors.light,
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 56,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.dark,
    },

    headerText: {
        color: theme.colors.dark,
        textAlign: 'center',
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.md,
    },

    tableRow: {
        backgroundColor: theme.colors.light,
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%',
        minHeight: 72,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: theme.colors.dark,
    },

    productColumn: {
        width: '45%',
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'flex-start',
    },

    priceColumn: {
        width: '25%',
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
    },

    amountColumn: {
        width: '30%',
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
    },

    tableCell: {
        justifyContent: 'center',
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[2],
    },

    itemText: {
        color: theme.colors.dark,
        textAlign: 'center',
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.sm,
    },

    productName: {
        textAlign: 'left',
        flexShrink: 1,
    },

    removeText: {
        color: theme.colors.brand.maroon,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.sm,
        marginTop: theme.spacing[1],
    },

    quantityControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: theme.spacing[3],
    },

    footer: {
        backgroundColor: theme.colors.light,
        borderWidth: 1,
        borderColor: theme.colors.dark,
        borderRadius: theme.borders.radius.md,
        padding: theme.spacing[3],
        marginVertical: theme.spacing[4],
    },

    cartSummaryHeader: {
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.muted,
        paddingBottom: theme.spacing[2],
        marginVertical: theme.spacing[4],
        marginHorizontal: theme.spacing[2],
    },

    footerTitle: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.lg,
    },

    totalItemsCart: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.base,
        marginVertical: theme.spacing[1],
    },

    subTotal: {
        color: theme.colors.mutedMedium,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.sm,
        marginHorizontal: theme.spacing[2],
    },

    addressHeader: {
        gap: theme.spacing[2],
        marginVertical: theme.spacing[4],
    },

    addressTitle: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.md,
    },

    btnSearch: {
        backgroundColor: theme.colors.primary,
        minWidth: 120,
        alignSelf: 'flex-end',
    },

    result: {
        backgroundColor: '#fcfcfc',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 5,
        borderWidth: 0.5,
        margin: 10,
    },

    textResult: {
        color: '#202020',
        fontFamily: theme.typography.fonts.story,
        fontSize: 14,
        textAlign: 'center',
    },

    totalContainer: {
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.muted,
        paddingTop: theme.spacing[2],
        marginHorizontal: theme.spacing[2],
    },

    totalTitle: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.lg,
    },

    finalValue: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.sm,
        marginVertical: theme.spacing[1],
    },

    btnClear: {
        backgroundColor: theme.colors.mutedMedium,
        minWidth: 120,
        alignSelf: 'flex-end',
    },

    btnPayment: {
        backgroundColor: theme.colors.brand.maroon,
        minHeight: 48,
        padding: theme.spacing[2],
        borderRadius: theme.borders.radius.xl,
    },

    emptyContent: {
        flexGrow: 1,
    },

    emptyContainer: {
        backgroundColor: theme.colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        padding: theme.spacing[8],
        borderWidth: 0.5,
        borderColor: theme.colors.muted,
        borderRadius: theme.borders.radius.md,
    },

    emptyTitle: {
        color: theme.colors.dark,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.lg,
        marginTop: theme.spacing[3],
        textAlign: 'center',
    },

    emptyText: {
        color: theme.colors.mutedMedium,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.base,
        marginTop: theme.spacing[2],
        textAlign: 'center',
    },
});
