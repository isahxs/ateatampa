import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import { Feather } from '@react-native-vector-icons/feather';

export default function MainDrawerContent(props) {
    const { navigation } = props;

    const navigateToAuth = (screen) => {
        navigation.closeDrawer();

        navigation.navigate('Auth', {
            screen,
        });
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />

            <DrawerItem
                label='Login'
                onPress={() => navigateToAuth('Login')}
                icon={({ color, size }) => <Feather name='log-in' size={size} color={color} />}
            />

            <DrawerItem
                label='Cadastrar'
                onPress={() => navigateToAuth('Cadastro')}
                icon={({ color, size }) => <Feather name='user-plus' size={size} color={color} />}
            />
        </DrawerContentScrollView>
    );
}