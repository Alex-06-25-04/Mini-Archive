import LoadingSpinner from '../components/loadingSpinner.js';

const API = import.meta.env.VITE_API_URL;

export const fetchApi = async (endpoint, options = {}) => {

    const url = `${API}${endpoint}`;

    const token = localStorage.getItem('token');

    // Mostra spinner
    LoadingSpinner.show();

    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        // credentials: 'include' // per CORS
    }

    if (options.body && !['GET', 'HEAD'].includes(config.method)) {
        config.body = options.body ? JSON.stringify(options.body) : null;
    }

    try {
        const response = await fetch(url, config);

        // 204 No Content (per DELETE) - CONTROLLA PRIMA!
        if (response.status === 204) return null;

        // Per vedere cosa arriva
        const contentType = response.headers.get('content-type');

        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            throw new Error('Server ha risposto con HTML invece di JSON');
        }

        const data = await response.json();

        LoadingSpinner.hide();

        return data;

    } catch (e) {
        LoadingSpinner.hide();
        if (e instanceof Error) console.error('API ERROR: ', e.message);
        throw e;
    }
};