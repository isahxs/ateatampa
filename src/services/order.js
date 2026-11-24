import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from './firebase';

export async function createOrder({ cartItems, deliveryAddress, userId }) {
    if (!userId) {
        throw new Error('Usuário não autenticado.');
    }

    if (!cartItems || cartItems.length === 0) {
        throw new Error('O carrinho está vazio.');
    }

    const items = cartItems.map((item) => ({
        produtoId: item.id,
        nome: item.name,
        precoUnitario: item.price,
        quantidade: item.quantity,
        subtotal: item.price * item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const orderData = {
        usuarioId: userId,
        itens: items,
        enderecoEntrega: deliveryAddress,
        total,
        status: 'aguardando_pagamento',
        canal: 'whatsapp',
        criadoEm: serverTimestamp(),
    };

    const orderReference = await addDoc(collection(db, 'pedidos'), orderData);

    return {
        id: orderReference.id,
        ...orderData,
    };
}
