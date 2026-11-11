import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import Logo from '../../components/Logo';
import { Feather } from '@react-native-vector-icons/feather';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
 
export default function Login() {
 
  const navigation = useNavigation();
 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
 
  const [pressionandoCadastro, setPressionandoCadastro] = useState('');
 
  const [pressionandoEsqueceuSenha, setPressionandoEsqueceuSenha] = useState(false);
 
  const [carregando, setCarregando] = useState(false);
 
 
  const handleLogin = async () => {
    const emailLimpo = email.trim().toLowerCase();
 
    if(!emailLimpo || !senha){
      return alert("Preencha e-mail e senha.");
    }
 
    setCarregando(true);
 
    try{
      const cred = await signInWithEmailAndPassword(auth, emailLimpo, senha);
 
      const clienteSanp = await getDoc(doc(db, "clientes", cred.user.uid));
 
      if(!clienteSanp.exists()){
        await signOut(auth);
        alert("Conta de cliente não encontrada.")
        return;
      }
 
      navigation.navigate('Main', { screen: 'Home' });
    } catch (e){
      console.log("Erro no Login:", e.code, e.message);
 
    if (e.code === "permission-denied") {
      alert("Sem permissão para ler o banco. Verifique as regras do Firebase.");
    } else if (e.code === "auth/too-many-requests") {
      alert("Muitas tentativas. Aguarde um pouco e tente novamente.");
    } else {
      alert("E-mail ou senha incorretos.");
    }
    } finally{
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
           onPressIn={() => setPressionandoEsqueceuSenha(true)}
           onPressOut={() => setPressionandoEsqueceuSenha(false)}
           onPress={() => navigation.navigate('Esqueceu Senha')}
          >
            <Text style={[styles.textoEsqueceuSenha, pressionandoEsqueceuSenha && styles.sublinhadoAtivo]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
 
          <TouchableOpacity
           style={styles.botao}
           onPress={handleLogin}
           disabled={carregando}
          >
            { carregando
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={styles.textoBotao}>Entrar</Text>}
          </TouchableOpacity>
 
          <View style={styles.linksContainer}>
            <View style={styles.linhaLink}>
              <Text style={styles.textoComum}>Não possui uma conta? </Text>
 
              <TouchableOpacity
               onPressIn={() => setPressionandoCadastro(true)}
               onPressOut={() => setPressionandoCadastro(false)}
               onPress={() => navigation.navigate('Cadastro')}
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
    backgroundColor: '#F2F0E4'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    marginTop: 70,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 24,
    color: '#8b1414',
    marginBottom: 30,
    fontFamily: 'StoryScript'
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
  input: {
    backgroundColor: '#ffffff',
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
  sublinhadoAtivo:{
    textDecorationLine: 'underline',
  },
});
 
 