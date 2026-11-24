import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

import { db } from './firebase';

function mapProduct(document) {
    const data = document.data();

    return {
        id: document.id,
        name: data.nome,
        description: data.descricao,
        price: data.preco,
        imageUrl: data.imagemUrl,
        status: data.status,
        categoryId: data.categoriaId,
        featured: data.destaque,
        createdAt: data.criadoEm,
    };
}

export async function getFeaturedProducts() {
    const productsQuery = query(collection(db, 'produtos'), where('destaque', '==', true), limit(6));

    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map(mapProduct);
}

export async function getProducts(categoryId) {
    const productsRef = collection(db, 'produtos');

    const productsQuery = categoryId ? query(productsRef, where('categoriaId', '==', categoryId)) : productsRef;

    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map(mapProduct);
}

export async function getProductById(productId) {
    const productRef = doc(db, 'produtos', productId);

    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
        return null;
    }

    return mapProduct(snapshot);
}
