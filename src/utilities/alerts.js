import { Alert } from 'react-native';

export function showAlert(title, message) {
    Alert.alert(title, message);
}

export function showSuccess(message) {
    Alert.alert('Sucesso', message);
}

export function showWarn(message) {
    Alert.alert('Aviso', message);
}

export function showError(message) {
    Alert.alert('Erro', message);
}

export function showConfirmation(
    title,
    message,
    confirmText,
    onConfirm
) {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: confirmText,
                style: 'destructive',
                onPress: onConfirm,
            },
        ],
        {
            cancelable: true,
        }
    );
}