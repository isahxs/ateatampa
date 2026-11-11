import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { theme } from '../../theme';

import Logo from '../../components/Logo';
import { LoginCliente } from '../../backend/authService';

export default function Login() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha o e-mail e a senha.");
      return;
    }
    
    setLoading(true);

    // Autenticação do Firebase
    const resultado = await LoginCliente({ email, senha });

    setLoading(false);

    if (resultado.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      Alert.alert("Erro ao entrar", resultado.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Logo width={160} height={160} />

        <Text style={styles.titulo}>Faça seu login</Text>

        <View style={styles.form}>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputIcon}
              placeholder="Insira seu e-mail"
              placeholderTextColor="#888888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputIcon}
              placeholder="Insira sua senha"
              placeholderTextColor="#888888"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Feather name={mostrarSenha ? "eye" : "eye-off"} size={20} color={"#8A436A"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.botao, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>{loading ? "Entrando..." : "Entrar"}</Text>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <View style={styles.linhaLink}>
              <Text style={styles.textoComum}>Não possui uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.textoDestaque}>Cadastre-se aqui!</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.linhaLink}>
              <Text style={styles.textoComum}>Esqueceu a senha? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Esqueceu Senha')}>
                <Text style={styles.textoDestaque}>Recupere a senha</Text>
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
    backgroundColor: '#F2F0E4'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 24,
    color: '#8b1414',
    marginBottom: 30,
        fontFamily: theme.typography.fonts.story,
  },
  form: {
    width: '100%'
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
    fontStyle: 'italic'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8A436A'
  },
  inputIcon: {
    flex: 1,
    height: '100%',
    fontStyle: 'italic'
  },
  botao: {
    backgroundColor: '#8A436A',
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic'
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 15,
  },
  linhaLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoComum: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic'
  },
  textoDestaque: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B1A1A',
    fontStyle: 'italic'
  },
});