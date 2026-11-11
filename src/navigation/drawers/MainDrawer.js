import { createDrawerNavigator } from '@react-navigation/drawer';

import { Feather } from '@react-native-vector-icons/feather';

import MainDrawerContent from './MainDrawerContent';

import Header from '../../components/Header';

import Home from '../../pages/Home';
import Produtos from '../../pages/Produtos';

import Sobre from '../../pages/Sobre';

import Carrinho from '../../pages/Carrinho';
import Pedidos from '../../pages/Pedidos';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName='Home'
            drawerContent={(props) => <MainDrawerContent {...props} />}
            screenOptions={{
                header: (props) => <Header {...props} navigationMode='drawer' />,
            }}
        >
            <Drawer.Screen
                name='Home'
                component={Home}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='home' size={size} color={color} />,
                }}
            />

            <Drawer.Screen
                name='Produtos'
                component={Produtos}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='shopping-bag' size={size} color={color} />,
                }}
            />

            <Drawer.Screen
                name='Carrinho'
                component={Carrinho}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='shopping-cart' size={size} color={color} />,
                }}
            />

            <Drawer.Screen
                name='Pedidos'
                component={Pedidos}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='file-text' size={size} color={color} />,
                }}
            />

            <Drawer.Screen
                name='Sobre'
                component={Sobre}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='info' size={size} color={color} />,
                }}
            />
        </Drawer.Navigator>
    );
}