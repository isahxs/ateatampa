import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

import {
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

import {
    auth,
    db,
} from './firebase';

const getRegisterErrorMessage = (
    errorCode
) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Este e-mail já está cadastrado.';

        case 'auth/invalid-email':
            return 'E-mail inválido.';

        case 'auth/weak-password':
            return 'A senha precisa ter pelo menos 6 caracteres.';

        case 'permission-denied':
            return 'Não foi possível salvar os dados do cliente.';

        default:
            return 'Não foi possível realizar o cadastro.';
    }
};

export async function cadastrarCliente({
    nome,
    email,
    senha,
}) {
    try {
        const nomeLimpo = nome.trim();
        const emailLimpo = email
            .trim()
            .toLowerCase();

        const credential =
            await createUserWithEmailAndPassword(
                auth,
                emailLimpo,
                senha
            );

        const user = credential.user;

        await setDoc(
            doc(db, 'usuarios', user.uid),
            {
                nome: nomeLimpo,
                email: emailLimpo,
                cargo: 'cliente',
                endereco: [],
                criadoEm:
                    serverTimestamp(),
                alteradoEm:
                    serverTimestamp(),
            }
        );

        return {
            success: true,
            user,
        };
    } catch (error) {
        console.error(
            'Erro ao cadastrar cliente:',
            error.code,
            error.message
        );

        return {
            success: false,
            error:
                getRegisterErrorMessage(
                    error.code
                ),
        };
    }
}

export async function loginCliente({
    email,
    senha
}) {
    try {
        const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), senha);

        return {
            success: true,
            user: credential.user,
        };
    } catch (error) {
        let errorMessage = 'Não foi possível realizar o login.';

        if (error.code === 'auth/invalid-email') {
            errorMessage = 'E-mail inválido.';
        } else if (
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/invalid-credential'
        ) {
            errorMessage = 'E-mail ou senha incorretos.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}

export async function recuperarSenha(
    email
) {
    try {
        await sendPasswordResetEmail(
            auth,
            email.trim().toLowerCase()
        );

        return {
            success: true,
        };
    } catch {
        return {
            success: false,
            error:
                'Não foi possível enviar o e-mail de recuperação.',
        };
    }
}

export async function logoutCliente() {
    await signOut(auth);
}