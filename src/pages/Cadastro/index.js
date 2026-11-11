import { useState } from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Feather } from '@react-native-vector-icons/feather';

import { CadastroCliente } from '../../backend/authService'; 
import { theme } from '../../theme';
import { showSuccess, showError } from '../../utilities/alerts';

import Logo from '../../components/Logo';

export default function CadastroClienteScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [pressionadoLogin, setPressionadoLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      showError('Por gentileza, preencha todos os campos requeridos.');
      return;
    }

    if (senha !== confirmarSenha) {
      showError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    //Autenticação do firebase
    const resultado = await CadastroCliente({ nome, email, senha });

    setLoading(false);

    if (resultado.success) {
      showSuccess('Cadastro realizado com sucesso!');
      navigation.navigate('Login'); 
    } else {
      showError(resultado.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>


        <Logo width={160} height={160} />

        
        <Text style={styles.titulo}>Crie sua conta</Text>

        <View style={styles.form}>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder='Insira seu nome'
            placeholderTextColor='#888888'
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder='Insira seu e-mail'
            placeholderTextColor='#888888'
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputIcon}
              placeholder='Insira sua senha'
              placeholderTextColor='#888888'
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Feather name={mostrarSenha ? 'eye' : 'eye-off'} size={20} color={'#8A436A'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputIcon}
              placeholder='Confirme a senha'
              placeholderTextColor='#888888'
              secureTextEntry={!mostrarConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
              <Feather name={mostrarConfirmarSenha ? 'eye' : 'eye-off'} size={20} color={'#8A436A'} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.botao} 
            onPress={handleCadastro}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.textoLogin}>Já possui uma conta? </Text>

            <TouchableOpacity 
              onPressIn={() => setPressionadoLogin(true)}
              onPressOut={() => setPressionadoLogin(false)}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.textoLoginDestaque, pressionadoLogin && styles.sublinhadoAtivo]}>Realize seu login aqui!</Text>
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
    fontFamily: theme.typography.fonts.story,
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
    fontStyle: 'italic'
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