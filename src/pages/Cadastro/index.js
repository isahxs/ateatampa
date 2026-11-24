import { useState } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@react-native-vector-icons/feather';

import { cadastrarCliente } from '../../services/authService';
import { showAlert, showError, showConfirmation } from '../../utilities/alerts';

import Logo from '../../components/Logo';

const initialData = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
};

export default function Cadastro() {
    const navigation = useNavigation();

    const [formData, setFormData] = useState(initialData);

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const [pressionandoLogin, setPressionandoLogin] = useState(false);

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const nomeLimpo = formData.nome.trim();
        const emailLimpo = formData.email.trim();

        if (!nomeLimpo || !emailLimpo || !formData.senha || !formData.confirmarSenha) {
            showAlert('Campos Obrigatórios', 'Preencha todos os campos.');
            return false;
        }

        if (formData.senha.length < 6) {
            showAlert('Senha Inválida', 'A senha deve ter pelo menos seis caracteres.');
            return false;
        }

        if (formData.senha !== formData.confirmarSenha) {
            showAlert('Senhas Diferentes', 'As senhas não coincidem.');
            return false;
        }

        return true;
    };

    const handleCadastro = async () => {
        if (loading || !validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const result = await cadastrarCliente({
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
            });

            console.log(result);

            if (!result.success) {
                showError(result.error);
                return;
            }

            showConfirmation('Cadastro Realizado', 'Conta criada com sucesso!', 'Continuar', () => {
                navigation.navigate('Login');
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
            >
                <Logo width={160} height={160} />

                <Text style={styles.title}>Crie Sua Conta</Text>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.label}>Nome</Text>

                        <TextInput
                            style={styles.input}
                            value={formData.nome}
                            onChangeText={(textInput) => handleChange('nome', textInput)}
                            autoCapitalize='words'
                            autoCorrect={false}
                            editable={!loading}
                            returnKeyType='next'
                            placeholder='Insira seu nome'
                            placeholderTextColor='#888888'
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Email</Text>

                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(textInput) => handleChange('email', textInput)}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            editable={!loading}
                            returnKeyType='next'
                            placeholder='Insira seu e-mail'
                            placeholderTextColor='#888888'
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Senha</Text>

                        <View style={styles.passwordSection}>
                            <TextInput
                                style={styles.inputIcon}
                                value={formData.senha}
                                onChangeText={(textInput) => handleChange('senha', textInput)}
                                secureTextEntry={!mostrarSenha}
                                autoCapitalize='none'
                                autoCorrect={false}
                                editable={!loading}
                                returnKeyType='next'
                                placeholder='Insira sua senha'
                                placeholderTextColor='#888888'
                            />

                            <TouchableOpacity
                                onPress={() => setMostrarSenha((currentValue) => !currentValue)}
                                disabled={loading}
                                accessibilityRole='button'
                            >
                                <Feather name={mostrarSenha ? 'eye' : 'eye-off'} size={20} color='#8A436A' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.label}>Confirmar Senha</Text>

                        <View style={styles.passwordSection}>
                            <TextInput
                                style={styles.inputIcon}
                                secureTextEntry={!mostrarConfirmarSenha}
                                value={formData.confirmarSenha}
                                onChangeText={(textInput) => handleChange('confirmarSenha', textInput)}
                                onSubmitEditing={handleCadastro}
                                autoCapitalize='none'
                                autoCorrect={false}
                                editable={!loading}
                                returnKeyType='done'
                                placeholder='Confirme a senha'
                                placeholderTextColor='#888888'
                            />
                            <TouchableOpacity
                                onPress={() => setMostrarConfirmarSenha((currentValue) => !currentValue)}
                                disabled={loading}
                                accessibilityRole='button'
                            >
                                <Feather name={mostrarConfirmarSenha ? 'eye' : 'eye-off'} size={20} color='#8A436A' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={[styles.btnRegister, loading && styles.botaoDesabilitado]}
                            onPress={handleCadastro}
                            disabled={loading}
                            accessibilityRole='button'
                            accessibilityState={{
                                disabled: loading,
                                busy: loading,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color='#FFFFFF' />
                            ) : (
                                <Text style={styles.btnRegisterText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.linkSection}>
                            <Text style={styles.loginLink}>Já possui uma conta? </Text>

                            <TouchableOpacity
                                onPressIn={() => setPressionandoLogin(true)}
                                onPressOut={() => setPressionandoLogin(false)}
                                onPress={() => navigation.navigate('Login')}
                                disabled={loading}
                                accessibilityRole='link'
                            >
                                <Text style={[styles.emphasisText, pressionandoLogin && styles.textUnderline]}>
                                    Realize seu login aqui
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

    scroll: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 60,
    },

    title: {
        fontSize: 24,
        color: '#8b1414',
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

    input: {
        backgroundColor: '#FFFFFF',
        height: 45,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#8A436A',
        fontStyle: 'italic',
    },

    passwordSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
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

    btnRegister: {
        backgroundColor: '#8A436A',
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    btnRegisterText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontStyle: 'italic',
    },

    loginLink: {
        fontSize: 14,
        color: '#666666',
        fontStyle: 'italic',
    },

    linkSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    emphasisText: {
        fontSize: 14,
        color: '#8B1A1A',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },

    textUnderline: {
        textDecorationLine: 'underline',
    },
});
