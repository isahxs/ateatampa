import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Logo from '../../components/Logo';

import { auth } from "../../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function EsqueceuSenhaCliente() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleRecuperar = async () => {
    const emailLimpo = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      alert('Digite um e-mail válido.');
      return;
    }

    try {
      setCarregando(true);

      await sendPasswordResetEmail(auth, emailLimpo);
      alert('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Erro ao enviar e-mail:', error.code, error.message);

      if (error.code === 'auth/invalid-email') {
        alert('O endereço de e-mail é inválido.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Muitas tentativas. Aguarde um pouco e tente novamente.');
      } else {
        alert('Não foi possível enviar o e-mail. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Logo width={160} height={160} />

        <Text style={styles.titulo}>Recuperar sua senha</Text>

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

          <TouchableOpacity
            style={[styles.botao, carregando && { opacity: 0.6 }]}
            onPress={handleRecuperar}
            disabled={carregando}
          >
            <Text style={styles.textoBotao}>
              {carregando ? 'Enviando...' : 'Enviar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginContainerRight}
            onPress={() => navigation.navigate('LoginCliente')}
          >
            <Text style={styles.textoLoginDestaque}>Realizar login</Text>
          </TouchableOpacity>

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
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    color: '#8b1414',
    marginBottom: 30,
    fontFamily: 'StoryScript',
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
    marginBottom: 25,
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
    alignItems: 'center'
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontStyle: 'italic'
  },
  loginContainerRight: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  textoLoginDestaque: {
    fontSize: 14,
    color: '#000',
    fontStyle: 'italic',
  }
});
