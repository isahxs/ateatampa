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

import { theme } from '../../theme';
import { showSuccess } from '../../utilities/alerts';

import Logo from '../../components/Logo';

export default function EsqueceuSenha() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');

  const handleRecuperar = () => {
    showSuccess('Um link de recuperação foi enviado ao seu e-mail!');
    navigation.navigate('Login');
  }

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
              placeholder='Insira seu e-mail'
              placeholderTextColor='#888888'
              keyboardType='email-address'
              autoCapitalize='none'
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.botao}
            onPress={() => navigation.navigate('Alterar Senha')}
          >
            <Text style={styles.textoBotao}>Enviar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginContainerRight}
          >
            <Text
              onPress={() => navigation.navigate('Login')}
              style={styles.textoLoginDestaque}>Realizar Login</Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  )

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
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#84436a'
  },
  inputIcon: {
    flex: 1,
    height: '100%',
    fontStyle: 'italic'
  },
  botao: {
    backgroundColor: '#844364',
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
    color: '#8B1A1A',
    fontStyle: 'italic',
    fontWeight: 'bold'
  }
})
