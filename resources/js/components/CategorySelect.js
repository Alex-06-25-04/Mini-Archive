import CategoriesApi from '../api/CategoriesApi.js';

export default class CategorySelect {
    #categories = [];
    #selectId;
    #currentCategoryId;

    constructor(selectId, currentCategoryId = null) {
        this.categoriesApi = new CategoriesApi();
        this.#selectId = selectId;
        this.#currentCategoryId = currentCategoryId;
    }

    // Carico i dati tramite API
    async load() {
        this.#categories = await this.categoriesApi.getAllCategories();
    }

    // Popola il select nel DOM
    render() {
        const select = document.getElementById(this.#selectId);
        if (!select) return;

        const icons = {
            'documenti': '📄',
            'software': '💻',
            'hardware': '🖥️',
            'marketing': '📈',
            'formazione': '🎓',
            'hr': '👥'
        };

        select.innerHTML = '<option value="">Seleziona una categoria</option>';

        this.#categories.forEach(category => {
            const icon = icons[category.name] || '📁';
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${icon} ${category.name.charAt(0).toUpperCase() + category.name.slice(1)}`;

            // Seleziona la categoria corrente
            if (category.id === this.#currentCategoryId) option.selected = true;

            select.appendChild(option);
        });
    }
}