import { useState } from 'react';

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@react-native-vector-icons/feather';

import { loginCliente } from '../../services/authService';

import { showAlert, showError } from '../../utilities/alerts';

import Logo from '../../components/Logo';

export default function Login() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');

    const [senha, setSenha] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [pressionandoCadastro, setPressionandoCadastro] = useState(false);

    const [pressionandoEsqueceuSenha, setPressionandoEsqueceuSenha] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const emailLimpo = email.trim();

        if (!emailLimpo || !senha) {
            showAlert('Campos obrigatórios', 'Preencha o e-mail e a senha.');

            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        if (isLoading || !validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            const result = await loginCliente({
                email,
                senha,
            });

            if (!result.success) {
                showError(result.error);

                return;
            }

            navigation.getParent()?.reset({
                index: 0,
                routes: [
                    {
                        name: 'Main',
                        params: {
                            screen: 'Home',
                        },
                    },
                ],
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
            >
                <Logo width={160} height={160} />

                <Text style={styles.titulo}>Faça seu login</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>E-mail</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputIcon}
                            placeholder='Insira seu e-mail'
                            placeholderTextColor='#888888'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='email'
                            textContentType='emailAddress'
                            value={email}
                            onChangeText={setEmail}
                            editable={!isLoading}
                            returnKeyType='next'
                        />
                    </View>

                    <Text style={styles.label}>Senha</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputIcon}
                            placeholder='Insira sua senha'
                            placeholderTextColor='#888888'
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='password'
                            textContentType='password'
                            value={senha}
                            onChangeText={setSenha}
                            editable={!isLoading}
                            returnKeyType='done'
                            onSubmitEditing={handleLogin}
                        />

                        <TouchableOpacity
                            onPress={() => setMostrarSenha((currentValue) => !currentValue)}
                            disabled={isLoading}
                            accessibilityRole='button'
                            accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            <Feather name={mostrarSenha ? 'eye' : 'eye-off'} size={20} color='#8A436A' />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPressIn={() => setPressionandoEsqueceuSenha(true)}
                        onPressOut={() => setPressionandoEsqueceuSenha(false)}
                        onPress={() => navigation.navigate('Esqueceu Senha')}
                        disabled={isLoading}
                        accessibilityRole='link'
                    >
                        <Text style={[styles.textoEsqueceuSenha, pressionandoEsqueceuSenha && styles.sublinhadoAtivo]}>
                            Esqueceu a senha?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botao, isLoading && styles.botaoDesabilitado]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        accessibilityRole='button'
                        accessibilityState={{
                            disabled: isLoading,
                            busy: isLoading,
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator color='#FFFFFF' />
                        ) : (
                            <Text style={styles.textoBotao}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <View style={styles.linhaLink}>
                            <Text style={styles.textoComum}>Não possui uma conta? </Text>

                            <TouchableOpacity
                                onPressIn={() => setPressionandoCadastro(true)}
                                onPressOut={() => setPressionandoCadastro(false)}
                                onPress={() => navigation.navigate('Cadastro')}
                                disabled={isLoading}
                                accessibilityRole='link'
                            >
                                <Text style={[styles.textoDestaque, pressionandoCadastro && styles.sublinhadoAtivo]}>
                                    Cadastre-se aqui
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F0E4',
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 30,
        alignItems: 'center',
    },

    titulo: {
        fontSize: 24,
        color: '#8B1414',
        marginBottom: 30,
        fontFamily: 'StoryScript',
    },

    form: {
        width: '100%',
    },

    label: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 5,
        fontStyle: 'italic',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: 45,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#8A436A',
    },

    inputIcon: {
        flex: 1,
        height: '100%',
        fontStyle: 'italic',
    },

    textoEsqueceuSenha: {
        alignSelf: 'flex-end',
        color: '#8B1A1A',
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 10,
    },

    botao: {
        backgroundColor: '#8A436A',
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    botaoDesabilitado: {
        opacity: 0.6,
    },

    textoBotao: {
        color: '#FFFFFF',
        fontSize: 16,
        fontStyle: 'italic',
    },

    linksContainer: {
        marginTop: 20,
        alignItems: 'center',
        gap: 15,
    },

    linhaLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    textoComum: {
        fontSize: 14,
        color: '#666666',
        fontStyle: 'italic',
    },

    textoDestaque: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8B1A1A',
        fontStyle: 'italic',
    },

    sublinhadoAtivo: {
        textDecorationLine: 'underline',
    },
});
