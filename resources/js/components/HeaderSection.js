import ResourcesApi from '../api/ResourcesApi.js';

export default class HeaderSection {
    constructor(user, onSearch) {
        this.user = user;
        this.resourcesApi = new ResourcesApi();
        this.onSearch = onSearch;
    }

    render() {
        return `
            <!-- Header Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 class="display-5 fw-bold mb-1">
                                <i class="bi bi-collection text-primary me-2"></i>
                                Archivio Risorse
                            </h1>
                            <p class="text-muted mb-0">Gestisci e organizza le tue risorse digitali</p>
                        </div>
                        
                        ${this.user?.is_admin ? `
                            <button class="btn btn-success btn-lg shadow-sm" id="addResource">
                                <i class="bi bi-plus-circle me-2"></i>
                                Aggiungi Risorsa
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="row mb-4">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <div class="input-group input-group-lg shadow-sm">
                        <span class="input-group-text bg-white border-end-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                        <input 
                            type="search" 
                            id="search" 
                            class="form-control border-start-0 ps-0" 
                            placeholder="Cerca per nome o categoria..."
                        />
                    </div>
                </div>
            </div>
        `;
    }

    attachEventsSearchBar() {
        const input = document.getElementById('search');
        let timeout; // Per debounce

        input?.addEventListener('input', () => {
            clearTimeout(timeout);

            timeout = setTimeout(async () => {
                const value = input.value.trim();

                if (!value) {
                    const all = await this.resourcesApi.get();
                    this.onSearch(all);
                    return;
                }

                const results = await this.resourcesApi.search({
                    name: value,
                });

                this.onSearch(results);
            }, 400)
        });
    }
}