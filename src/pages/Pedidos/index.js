import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../theme';

import Page from '../../components/Page';

export default function Pedidos() {
    const navigation = useNavigation();

    return (
        <Page>
            <View style={styles.boxTitle}>
                <Text style={styles.title}>Meus Pedidos</Text>
            </View>

            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Feather name='shopping-cart' style={styles.icon} />
                    <Text style={styles.text}>Nenhum pedido ainda</Text>
                    <Text style={styles.subText}>Que tal dar uma olhada nos nossos produtos?</Text>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Produtos')}>
                        <Text style={styles.buttonText}>Ver Produtos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Page>
    );
}

const styles = StyleSheet.create({
    boxTitle: {
        width: '100%',
        paddingHorizontal: 40,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontFamily: theme.typography.fonts.story,
    },
    containerBox: {
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    box: {
        width: '90%',
        paddingVertical: 40,
        paddingHorizontal: 16,
        backgroundColor: '#F2F0F1',
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#333333',
    },
    icon: {
        color: '#6D76A6',
        fontSize: 45,
        marginBottom: 12,
    },
    text: {
        fontFamily: theme.typography.fonts.story,
        fontSize: 30,
        textAlign: 'center',
    },
    subText: {
        fontSize: 16,
        fontFamily: theme.typography.fonts.story,
        color: '#505050',
        textAlign: 'center',
    },
    button: {
        marginTop: 25,
        borderWidth: 1,
        borderRadius: 10,
        width: 180,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#6D76A6',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: theme.typography.fonts.story,
        color: '#6D76A6',
    },
});
