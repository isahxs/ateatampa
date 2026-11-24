export function formatPrice(value = 0, fallback = 'Preço Indisponível') {
    const numericValue = Number(value);
    
    if (Number.isNaN(numericValue)) {
        return fallback;
    }

    return numericValue.toLocaleString('pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    );
}
