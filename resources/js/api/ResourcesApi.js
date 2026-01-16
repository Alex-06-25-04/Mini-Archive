import { fetchApi } from './fetch.js';

export default class ResourcesApi {
    get = async () => {
        return await fetchApi('/resources');
    }

    getById = async (id) => {
        return await fetchApi(`/resources/${id}`);
    }

    create = async (data) => {
        return await fetchApi('/resources', {
            method: 'POST',
            body: data
        });
    }

    update = async (id, data) => {
        return await fetchApi(`/resources/${id}`, {
            method: 'PUT',
            body: data
        });
    }

    delete = async (id) => {
        return await fetchApi(`/resources/${id}`, {
            method: 'DELETE'
        });
    }

    search = async (params) => {
        const query = new URLSearchParams(params).toString();
        return await fetchApi(`/resources/search?${query}`);
    }
}