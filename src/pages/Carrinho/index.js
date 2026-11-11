import { useState } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Feather } from '@react-native-vector-icons/feather';

import { searchAddress, normalizeCep } from '../../services/cep';
import { theme } from '../../theme';
import { showError, showConfirmation } from '../../utilities/alerts';

const initialData = {
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

    const [address, setAddress] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFetchCep = async () => {
        if (normalizeCep(address.cep).length !== 8) {
            setErrorMessage('Por favor, digite um CEP válido.');
            return;
        }

        setLoading(true);
        setErrorMessage(false);

        try {
            const result = await searchAddress(address.cep);

            setAddress((currentAddress) => ({
                ...currentAddress,
                cep: result.cep || currentAddress.cep,
                logradouro: result.logradouro || '',
                bairro: result.bairro || '',
                localidade: result.localidade || '',
                uf: result.uf || '',
            }));

            Keyboard.dismiss();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (field, value) => {
        setAddress((currentAddress) => ({
            ...currentAddress,
            [field]: value,
        }));
    };

    const handleClear = () => {
        showConfirmation('Limpar Carrinho', 'Tem certeza de que deseja limpar o carrinho e o endereço?', 'Sim', () => {
            setAddress(initialData);
            setErrorMessage('');
            setLoading(false);
            Keyboard.dismiss();
        });
    };

    const handlePayment = () => {
        if (!address.logradouro) {
            showError('Endereço incompleto. Consulte um CEP válido antes de continuar.');
            return;
        }

        if (!address.numero.trim()) {
            showError('Número obrigatório. Informe o número da casa antes de continuar.');
            return;
        }

        const deliveryAddress = {
            ...address,
            complemento: address.complemento.trim(),
        };

        console.log('Endereço da entrega:', deliveryAddress);
    };

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={{
                paddingBottom: insets.bottom + theme.spacing[4],
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            horizontal={false}
        >
            <View>
                <View style={styles.section}>
                    <Text style={styles.title}>Meu Carrinho</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.box}>
                        <View style={styles.header}>
                            <View style={[styles.quadadro1, styles.quadadro2]}>
                                <Text style={styles.text}>Produto</Text>
                            </View>
                            <View style={styles.quadadro1}>
                                <Text style={styles.text}>Preço</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.box2}>
                        <Text style={styles.titleCart}>Total no Carrinho</Text>
                        <Text style={styles.subTotal}>Subtotal</Text>

                        <Text style={styles.textCep}>
                            <Feather name='map-pin' size={20} color={theme.colors.dark} /> Endereço de entrega
                        </Text>

                        <Text style={styles.label}>CEP *</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='00000-000'
                            value={address.cep}
                            onChangeText={(text) => {
                                handleAddressChange('cep', text);
                                setErrorMessage('');
                            }}
                            onBlur={handleFetchCep}
                            keyboardType='number-pad'
                            maxLength={9}
                        />

                        {loading && <ActivityIndicator color={theme.colors.dark} />}

                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <Text style={styles.label}>Número *</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='Ex.: 125'
                            value={address.numero}
                            onChangeText={(text) => handleAddressChange('numero', text)}
                            maxLength={10}
                        />

                        <Text style={styles.label}>Complemento</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='Ex.: Apto. 12, bloco B'
                            value={address.complemento}
                            onChangeText={(text) => handleAddressChange('complemento', text)}
                            maxLength={60}
                        />

                        <View style={styles.boxButton}>
                            <TouchableOpacity style={styles.button} onPress={handleFetchCep} disabled={loading}>
                                <Text style={styles.bntBuscar}>{loading ? 'Buscando...' : 'Buscar'}</Text>
                            </TouchableOpacity>
                        </View>

                        {address.logradouro ? (
                            <View style={styles.result}>
                                <Text style={styles.textResult}>
                                    {address.logradouro}
                                    {address.numero ? `, ${address.numero}` : ''}
                                </Text>

                                {address.complemento ? (
                                    <Text style={styles.textResult}>{address.complemento}</Text>
                                ) : null}

                                <Text style={styles.textResult}>{address.bairro}</Text>

                                <Text style={styles.textResult}>
                                    {address.localidade} - {address.uf}
                                </Text>

                                <Text style={styles.textResult}>CEP: {address.cep}</Text>
                            </View>
                        ) : null}

                        <Text style={styles.subTitle}>Total</Text>

                        <View style={styles.boxButtonLimpar}>
                            <TouchableOpacity style={styles.button} onPress={handleClear}>
                                <Text style={styles.limpar}>Limpar Carrinho</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.boxZap}>
                            <TouchableOpacity style={styles.bntZap} onPress={handlePayment}>
                                <Text style={styles.textZap}>
                                    Fazer Pagamento <FontAwesome name='whatsapp' size={20} color={theme.colors.light} />
                                </Text>
                            </TouchableOpacity>
                        </View>
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

    title: {
        color: theme.colors.title,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.medium,
        marginBottom: theme.spacing[2],
    },

    section: {
        marginVertical: theme.spacing[4],
    },

    form: {
        backgroundColor: '#ffffff',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 10,
    },

    input: {
        minHeight: 45,
        borderWidth: 0.5,
        borderColor: '#808080',
        marginHorizontal: 10,
        marginVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontFamily: theme.typography.fonts.story,
        color: '#202020',
        backgroundColor: '#FFFFFF',
    },

    label: {
        marginHorizontal: 10,
        marginTop: 8,
        fontFamily: theme.typography.fonts.story,
        fontSize: 14,
        color: '#202020',
    },

    errorText: {
        marginHorizontal: 10,
        marginBottom: 6,
        color: '#B00020',
        fontFamily: theme.typography.fonts.story,
        fontSize: 13,
    },

    loading: {
        marginVertical: 5,
    },

    box: {
        backgroundColor: '#F2F0F1',
        width: '90%',
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#202020',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },

    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#333333',
    },

    quadadro1: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quadadro2: {
        borderRightWidth: 1,
        borderColor: '#333333',
    },

    text: {
        fontFamily: theme.typography.fonts.story,
        fontSize: 14,
    },

    box2: {
        backgroundColor: '#F2F0F1',
        width: '90%',
        borderWidth: 1,
        borderColor: '#202020',
        borderRadius: 10,
        overflow: 'hidden',
        padding: 8,
    },

    titleCart: {
        fontSize: 18,
        fontFamily: theme.typography.fonts.story,
        paddingBottom: 2,
        paddingLeft: 10,
        marginTop: 10,
    },

    subTotal: {
        borderTopWidth: 0.5,
        margin: 10,
        fontFamily: theme.typography.fonts.story,
        paddingBottom: 10,
        paddingTop: 10,
        fontSize: 16,
    },

    subTitle: {
        borderTopWidth: 0.5,
        margin: 10,
        fontFamily: theme.typography.fonts.story,
        paddingTop: 10,
        marginTop: 10,
        fontSize: 16,
        paddingBottom: 2,
    },

    icon: {
        fontSize: 20,
        paddingLeft: 10,
        fontWeight: 'bold',
    },

    textCep: {
        fontFamily: theme.typography.fonts.story,
        fontSize: 20,
    },

    boxButton: {
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 15,
    },

    boxButtonLimpar: {
        paddingRight: 10,
        paddingTop: 5,
    },

    button: {
        width: 110,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        backgroundColor: '#732257',
    },

    limpar: {
        fontSize: 14,
        fontFamily: theme.typography.fonts.story,
        color: '#ffffff',
    },

    bntBuscar: {
        fontSize: 14,
        fontFamily: theme.typography.fonts.story,
        color: '#ffffff',
    },

    boxZap: {
        alignSelf: 'center',
        paddingTop: 30,
    },

    bntZap: {
        width: 230,
        height: 40,
        backgroundColor: '#199145',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textZap: {
        color: '#ffffff',
        fontFamily: theme.typography.fonts.story,
        fontSize: 16,
    },

    iconZap: {
        fontSize: 18,
    },

    result: {
        paddingHorizontal: 10,
        paddingTop: 5,
        borderWidth: 0.5,
        margin: 10,
        alignItems: 'center',
        backgroundColor: '#fcfcfcff',
    },

    textResult: {
        fontFamily: theme.typography.fonts.story,
        fontSize: 14,
        color: '#202020',
        justifyContent: 'center',
    },
});