import axios from 'axios';

const viaCepUrl = 'https://viacep.com.br/ws';

export function normalizeCep(cep = '') {
    return cep.replace(/\D/g, '');
}

export function validateCep(cep) {
    return normalizeCep(cep).length === 8;
}

export async function searchAddress(cep) {
    const normalizedCep = normalizeCep(cep);

    if (!validateCep(normalizedCep)) {
        throw new Error('O CEP deve conter 8 números.');
    }

    try {
        const response = await axios.get(`${viaCepUrl}/${normalizedCep}/json/`, {
            timeout: 8000,
        });

        if (response.data.erro) {
            throw new Error('CEP não encontrado.');
        }

        return {
            cep: response.data.cep || '',
            logradouro: response.data.logradouro || '',
            bairro: response.data.bairro || '',
            localidade: response.data.localidade || '',
            uf: response.data.uf || '',
        };
    } catch (error) {
        if (error.message === 'O CEP deve conter 8 números.' || error.message === 'CEP não encontrado.') {
            throw error;
        }

        throw new Error('Não foi possível consultar o CEP. Verifique sua conexão.');
    }
}
