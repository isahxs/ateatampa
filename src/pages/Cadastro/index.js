import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

import { Feather } from '@react-native-vector-icons/feather';
import Logo from '../../components/Logo';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

export default function Cadastro() {

  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [pressionandoLogin, setPressionandoLogin] = useState(false);

  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
      return alert("Preencha todos os campos.");
    }
    if (senha.length < 6) {
      return alert("A senha precisa ter menos de caracteres.");
    }
    if (senha !== confirmarSenha) {
      return alert("As senha não coicidem.");
    }

    setCarregando(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, emailLimpo, senha);

      await setDoc(doc(db, "clientes", cred.user.uid), {
        nome: nomeLimpo,
        email: emailLimpo,
        tipo: "cliente",
        enderecos: [],
        criadoEm: serverTimestamp(),
        alteradoEm: serverTimestamp(),
      });

      alert("Conta criada com sucesso!");
      navigation.navigate('Login');
    } catch (e) {
      console.log("Erro no cadastro:", e.code, e.message);
      if (e.code === "auth/email-already-in-use") alert("Este e-mail já está cadastrado.");
      else if (e.code === "auth/invalid-email") alert("E-mail inválido.");
      else if (e.code === "auth/weak-password") alert("Senha muito fraca.");
      else if (e.code === "permission-denied") alert("Sem premissão para salvar no banco. Verifique as regras do Firestore.");
      else alert("Erro ao criar a conta.")
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>


        <Logo width={160} height={160} />

        {/* Título atualizado com letras maiúsculas */}
        <Text style={styles.titulo}>Crie sua conta</Text>

        <View style={styles.form}>

          {/* Label e Placeholder de Nome */}
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira seu nome"
            placeholderTextColor="#888888"
            value={nome}
            onChangeText={setNome}
          />

          {/* Label e Placeholder de Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira seu e-mail"
            placeholderTextColor="#888888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
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
          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputIcon}
              placeholder="Confirme a senha"
              placeholderTextColor="#888888"
              secureTextEntry={!mostrarConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
              <Feather name={mostrarConfirmarSenha ? "eye" : "eye-off"} size={20} color={"#8A436A"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.botao, carregando && { opacity: 0.6 }]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#ffffff" />
              : <Text style={styles.textoBotao}>Cadastrar</Text>}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.textoLogin}>Já possui uma conta? </Text>

            <TouchableOpacity
              onPressIn={() => setPressionandoLogin(true)}
              onPressOut={() => setPressionandoLogin(false)}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.textoLoginDestaque, pressionandoLogin && styles.sublinhadoAtivo]}>
                Realize seu login aqui
              </Text>
            </TouchableOpacity>

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
    paddingTop: 60,
    alignItems: 'center'
  },
  logoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#722b54',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
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
    fontStyle: 'italic'
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8A436A',
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
    borderColor: '#8A436A',
  },
  inputIcon: {
    flex: 1,
    height: '100%',
    fontStyle: 'italic',
  },
  botao: {
    backgroundColor: '#8A436A',
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: "italic"
  },
  textoLogin: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic'
  },
  loginContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoLoginDestaque: {
    fontSize: 14,
    color: '#8B1A1A',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  sublinhadoAtivo: {
    textDecorationLine: 'underline',
  }
});
