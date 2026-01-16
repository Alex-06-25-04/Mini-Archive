import { fetchApi } from './fetch.js';

export default class AuthApi {
    register = async (data) => {
        return await fetchApi('/register', {
            method: 'POST',
            body: data
        });
    }

    login = async (data) => {
        const response = await fetchApi('/login', {
            method: 'POST',
            body: data
        });

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response.user;
    }

    logout = async () => {
        try {
            await fetchApi('/logout', { method: 'POST' });

        } catch (error) {
            console.error('Errore durante il logout sul server:', error);

        } finally {
            // Questo viene SEMPRE eseguito, anche se c'è un errore
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}