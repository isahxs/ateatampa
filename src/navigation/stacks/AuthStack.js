import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from '../../components/Header';

import Cadastro from '../../pages/Cadastro';
import Login from '../../pages/Login';
import EsqueceuSenha from '../../pages/EsqueceuSenha';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName='Login'
            screenOptions={{
                header: (props) => <Header {...props} navigationMode='stack' />,
            }}
        >
            <Stack.Screen
                name='Login'
                component={Login}
                options={{
                    title: 'Entrar',
                }}
            />

            <Stack.Screen
                name='Cadastro'
                component={Cadastro}
                options={{
                    title: 'Cadastrar',
                }}
            />

            <Stack.Screen
                name='Esqueceu Senha'
                component={EsqueceuSenha}
                options={{
                    title: 'Esqueci a Senha',
                }}
            />
        </Stack.Navigator>
    )
}