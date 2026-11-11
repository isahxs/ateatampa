import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainDrawer from '../drawers/MainDrawer';

import Header from '../../components/Header';

import Produto from '../../pages/Produto';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName='Main'
            screenOptions={{
                headerShown: false,
            }}
        > 

            <Stack.Screen
                name='Auth'
                component={AuthStack}
            />

            <Stack.Screen
                name='Main'
                component={MainDrawer}
            />

            <Stack.Screen
                name='Produto'
                component={Produto}
                options={{
                    headerShown: true,
                    header: (props) => (
                        <Header
                            {...props}
                            navigationMode='stack'
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    );
}