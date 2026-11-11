import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

export const CadastroCliente = async ({ nome, email, senha }) => {
    try {
        const userCredencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
        const user = userCredencial.user;

        await setDoc(doc(db, "clientes", user.uid), {
            nome: nome,
            email: email.trim(),
            tipo: "cliente",
            criadoEm: new Date().toISOString(),
            alteradoEm: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        let mensagemErro = 'Não foi possível realizar o cadastro';

        if (error.code === 'auth/email-already-in-use') {
            mensagemErro = 'Esse e-mail já está em uso';
        } else if (error.code === 'auth/invalid-email') {
            mensagemErro = 'E-mail inválido';
        } else if (error.code === 'auth/weak-password') {
            mensagemErro = 'A senha precisa ter pelo menos 6 caracteres';
        }

        return { success: false, error: mensagemErro };
    }
}

export const LoginCliente = async ({ email, senha }) => {
    try {
        const userCredencial = await signInWithEmailAndPassword(auth, email.trim(), senha);
        const user = userCredencial.user;

        return { success: true, user };
    } catch (error) {
        console.log("Código do erro Firebase:", error.code);

        let mensagemErro = "Não foi possível realizar o login";

        if (error.code === 'auth/invalid-email') {
            mensagemErro = 'E-mail inválido';
        } else if (
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/invalid-credential'
        ) {
            mensagemErro = 'E-mail ou senha incorretos';
        } else if (error.code === 'auth/too-many-requests') {
            mensagemErro = 'Muitas tentativas sem sucesso. Tente novamente mais tarde';
        }

        return { success: false, error: mensagemErro };
    }
};
