import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Feather from '@react-native-vector-icons/feather';

import { theme } from '../../theme';

import Logo from '../Logo';

export default function Header({
    navigation,
    route,
    options,
    navigationMode = 'drawer'
}) {

    const insets = useSafeAreaInsets();

    const isDrawerMode = navigationMode === 'drawer';

    const handleLogoPress = () => {
        if (isDrawerMode) {
            navigation.jumpTo('Home');
            return;
        }

        navigation.navigate('Main', {
            screen: 'Home',
        });
    };

    const handleNavigationPress = () => {
        switch (navigationMode) {
            case 'stack':
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
                break;

            case 'drawer':
                navigation.openDrawer();
                break;

            default:
                console.warn(`The navigationMode is invalid: ${navigationMode}`)
                break;
        }
    };

    const handleUserPress = () => {
        if (isDrawerMode) {
            navigation.navigate('Auth', {
                screen: 'Login',
            });

            return;
        }

        navigation.navigate('Login');
    };

    return (
        <View
            style={[
                styles.header,
                {
                    paddingTop: insets.top
                }
            ]}>
            <View style={styles.navbar}>
                <View style={styles.logo}>
                    <TouchableOpacity onPress={handleLogoPress}>
                        <Logo width={100} height={100} />
                    </TouchableOpacity>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity
                        accessibilityRole='button'
                        accessibilityLabel='Pesquisar'
                    >
                        <Feather
                            name='search'
                            size={30}
                            color={theme.colors.dark}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleUserPress}
                        accessibilityRole='button'
                        accessibilityLabel='Acessar Conta'
                    >
                        <Feather
                            name='user'
                            size={30}
                            color={theme.colors.dark}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNavigationPress}
                        accessibilityRole='button'
                        accessibilityLabel={
                            isDrawerMode ? 'Abrir Menu' : 'Voltar'
                        }
                    >
                        <Feather
                            name={isDrawerMode ? 'menu' : 'arrow-left'}
                            size={30}
                            color={theme.colors.dark}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: theme.colors.brand.cream,
        minHeight: 100
    },

    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[8]

    },

    menu: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing[6]
    },
});