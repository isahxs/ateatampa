import axios from 'axios';

const viaCepUrl = 'https://viacep.com.br/ws';

function throwError(message) {
    throw new Error(message);
}

export function normalizeCep(cep) {
    return cep.replace(/\D/g, '');
}

export function validateCep(cep) {
    const normalizedCep = normalizeCep(cep);
    return normalizedCep.length === 8;
}

export async function searchAddress(cep) {
    const normalizedCep = normalizeCep(cep);

    if (!validateCep(normalizedCep)) {
        throwError('O CEP deve conter 8 números.');
    }

    try {
        const response = await axios.get(`${viaCepUrl}/${normalizedCep}/json/`, {
            timeout: 8000,
        });

        if (response.data.error) {
            throwError('CEP não encontrado.');
        }

        return {
            cep: response.data.cep,
            logradouro: response.data.logradouro || '',
            bairro: response.data.bairro || '',
            localidade: response.data.bairro || '',
            uf: response.data.uf || '',
            estado: response.data.estado || '',
        };
    } catch (error) {
        if (error.message === 'O CEP deve conter 8 números.' || error.message === 'CEP não encontrado.') {
            throw error;
        }

        throwError('Não foi possível consultar o CEP. Verifique sua conexão.');
    }
}

const api = axios.create({
    baseURL: 'https://viacep.com.br/ws',
});

export default api;
