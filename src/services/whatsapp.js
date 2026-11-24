import { Linking } from 'react-native';
import { formatPrice } from '../utilities/formatPrice';

const whatsappNumber = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER;

const normalizePhoneNumber = (phoneNumber = '') => {
    return phoneNumber.replace(/\D/g, '');
};

const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10,15}$/.test(phoneNumber);
};

const formatAddress = (address) => {
    const addressLines = [
        `CEP: ${address.cep}``${address.logradouro}, ${address.numero}`,
        `${address.bairro} - ${address.localidade}/${address.uf}`,
        address.complemento,
    ];

    return addressLines.filter(Boolean).join('\n');
};

export function buildOrderMessage(order) {
    if (!order?.id) {
        throw new Error('Pedido inválido para envio.');
    }

    const itemsMessage = order.itens
        .map((item) => {
            return [`${item.quantidade}x ${item.nome}`, formatPrice(item.subtotal)].join(' - ');
        })
        .join('\n');

    const addressMessage = formatAddress(order.enderecoEntrega);

    return [
        'Olá! Gostaria de finalizar meu pedido.',
        '',
        `Pedido: ${order.id}`,
        '',
        'Itens:',
        itemsMessage,
        '',
        `Total: ${formatPrice(order.total)}`,
        '',
        'Local de Entrega:',
        addressMessage,
        '',
        'Aguardo as instruções para pagamento.',
    ].join('\n');
}

export async function openOrderOnWhatsApp(order) {
    const phoneNumber = normalizePhoneNumber(whatsappNumber);

    if (!validatePhoneNumber(phoneNumber)) {
        throw new Error('O número de WhatsApp da loja não está configurado corretamente.');
    }

    const message = buildOrderMessage(order);

    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${phoneNumber}` + `?text=${encodedMessage}`;

    await Linking.openURL(url);
}
