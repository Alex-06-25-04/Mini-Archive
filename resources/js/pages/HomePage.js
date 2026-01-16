import { Modal } from 'bootstrap';
import ResourcesApi from '../api/ResourcesApi.js';
import NavbarSection from '../components/NavbarSection.js';
import HeaderSection from '../components/HeaderSection.js';
import ResourceCard from '../components/ResourceCard.js';
import AddResourceModal from '../components/AddResourceModal.js';

export default class HomePage {
    #resources = [];

    constructor() {
        this.app = document.getElementById('app');
        this.resourcesApi = new ResourcesApi();
        this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.navbar = new NavbarSection(this.user);
        this.header = new HeaderSection(this.user, (resources) => {
            if (resources.length === 0) {
                document.getElementById('resources-container').innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h2 class="mt-3">Nessun risultato trovato!</h2>
                    <p class="text-muted">Prova con un altro termine di ricerca</p>
                </div>
                `;
                return;
            }
            const grouped = this.groupByCategory(resources);
            this.renderGroupedResources(grouped);
        });
    }

    async init() {
        this.render();
        this.navbar.attachEventsLogout();
        this.header.attachEventsSearchBar();
        await this.loadResources();
        if (this.user?.is_admin) this.attachAddResourceEvent();
    }

    render() {
        this.app.innerHTML = `
        <!-- NAVBAR -->
       ${this.navbar.render()}

       <!-- Main Content -->
       <div class="container-fluid py-4">
            <!-- Header Section -->
           ${this.header.render()}

            <!-- Resources Container -->
            <main id="resources">
                <div id="resources-container">
                    <!-- Loading Spinner -->
                </div>
            </main>
       </div>

        <!-- Modale per la creazione di una risorsa -->
        ${this.user?.is_admin ? this.renderAddModal() : ''}
        `;
    }

    async loadResources() {
        try {
            this.#resources = await this.resourcesApi.get();

            const grouped = this.groupByCategory(this.#resources);

            this.renderGroupedResources(grouped);

        } catch (e) {
            console.error('Errore nel caricamento dati: ', e);
            document.getElementById('resources-container').innerHTML = `
        <div class="error">
            <h2 class="error-title">Errore nel caricare i dati!</h2>
        </div>
        `;
        }
    }

    groupByCategory(resources) {
        return resources.reduce((acc, resource) => {
            const categoryName = resource?.category?.name;

            if (!acc[categoryName]) acc[categoryName] = [];

            acc[categoryName].push(resource);

            return acc;
        }, {});
    }

    renderGroupedResources(grouped) {
        const resourcesContainer = document.getElementById('resources-container');
        resourcesContainer.innerHTML = '';

        let html = "";

        if (!grouped || Object.keys(grouped).length === 0) {
            resourcesContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox display-1 text-muted"></i>
                <h2 class="mt-3">Nessuna risorsa ancora caricata!</h2>
                <p class="text-muted">Le risorse caricate appariranno qui</p>
            </div>
            `;
            return;
        }

        for (const [nameCategory, resources] of Object.entries(grouped)) {
            const charCategoryName = nameCategory.charAt(0).toUpperCase() + nameCategory.slice(1);

            html += `
                <div class="category-section mb-5">
                    <!-- Category Header -->
                    <div class="d-flex align-items-center mb-3">
                         <div class="flex-grow-1">
                            <h3 class="mb-0 fw-bold text-primary">
                                <i class="bi bi-folder-fill me-2"></i>
                                ${charCategoryName}
                            </h3>
                        </div>
                        <span class="badge bg-primary rounded-pill">${resources.length} risorse</span>
                    </div>

                    <!-- Resources Grid -->
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                       ${resources.map(resource => {
                const card = new ResourceCard(resource, () => this.loadResources(), () => this.deleteFromHome(), this.user);
                return card.init();
            }).join('')
                }
                    </div>
                </div>
            `;
        }

        resourcesContainer.innerHTML = html;

        this.#resources.forEach(resource => {
            const card = new ResourceCard(resource, () => this.loadResources(), () => this.deleteFromHome(), this.user);
            card.attachEventCard();
        });
    }

    deleteFromHome() {
        this.loadResources();
    }

    renderAddModal() {
        const modal = new AddResourceModal(() => this.loadResources());
        return modal.render();
    }

    attachAddResourceEvent() {
        const addBtn = document.getElementById('addResource');
        const modal = new AddResourceModal(() => this.loadResources());

        addBtn?.addEventListener('click', () => {
            const modalElement = new Modal(document.getElementById('addResourceModal'));
            modalElement.show();
        });

        modal.attachEvents();
    }
}