import { fetchApi } from './fetch.js';

export default class CategoriesApi {
    getAllCategories = async () => {
        return await fetchApi('/resources/categories');
    }
}