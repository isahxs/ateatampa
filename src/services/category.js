import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from './firebase';

export async function getCategories() {
    const categoriesQuery = query(collection(db, 'categorias'), orderBy('ordem', 'asc'));

    const snapshot = await getDocs(categoriesQuery);

    return snapshot.docs.map((document) => {
        const data = document.data();

        return {
            id: document.id,
            name: data.nome,
            imageUrl: data.imagemUrl,
        };
    });
}
