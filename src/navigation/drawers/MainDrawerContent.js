import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Feather from '@react-native-vector-icons/feather';

import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';

export default function MainDrawerContent(props) {
    const { navigation } = props;
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUsuarioLogado(user);
        });
        return unsubscribe;
    }, []);

    const navigateToAuth = (screen) => {
        navigation.closeDrawer();
        navigation.navigate('Auth', {
            screen,
        });
    };

    const handleLogout = () => {
        navigation.closeDrawer();
        
        Alert.alert(
            "Atenção",
            "Tem certeza que deseja sair da sua conta?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            
                            navigation.navigate('Auth', {
                                screen: 'Login',
                            });
                        } catch (error) {
                            console.log("Erro ao sair:", error);
                            Alert.alert("Erro", "Não foi possível realizar o logout.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />

            {!usuarioLogado ? (
                <>
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
                </>
            ) : (
                <DrawerItem
                    label='Sair'
                    onPress={handleLogout}
                    icon={({ color, size }) => <Feather name='log-out' size={size} color={color} />}
                />
            )}
        </DrawerContentScrollView>
    );
}