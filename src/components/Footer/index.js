import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

import { theme } from '../../theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../Logo';

export default function Footer() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Logo width={100} height={100} />
            </TouchableOpacity>

            <View style={styles.contatoBox}>
                <Text style={styles.contact}>Contato</Text>

                <TouchableOpacity
                    style={styles.whatsapp}
                    onPress={() => Linking.openURL('https://wa.me/5511977178338')}
                >
                    <FontAwesome name='whatsapp' brand size={26} color='white' />
                    <Text style={styles.text}>(11) 97717-8338</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#732257',
        padding: 16,
    },
    contatoBox: {
        alignItems: 'center',
        gap: 4,
    },
    contact: {
        fontFamily: theme.typography.fonts.story,
        fontSize: 24,
        color: 'white',
    },
    whatsapp: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontFamily: theme.typography.fonts.story,
        fontSize: 15,
        color: 'white',
    },
});
