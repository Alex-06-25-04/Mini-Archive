import { Modal } from 'bootstrap';
import Validator from '../utils/Validator.js';
import CategorySelect from './CategorySelect.js';
import ToastNotification from './ToastNotification.js';
import ResourcesApi from '../api/ResourcesApi.js';

export default class CreateResourceCard {
    #resource;

    #onUpdateCallback;
    #onDeleteCallback;

    constructor(resource, onUpdateCallback, onDeleteCallback, user) {
        this.resourcesApi = new ResourcesApi();
        this.#resource = resource;
        this.categorySelect = new CategorySelect(`categorySelectEdit-${this.#resource.id}`, this.#resource.category?.id);
        this.#onUpdateCallback = onUpdateCallback;
        this.#onDeleteCallback = onDeleteCallback;
        this.user = user;
    }

    init() {
        return `
        <div class="col">
            <article class="card h-100 shadow-sm border-0 resource-card" id="${this.#resource.id}">
                <!-- Immagine -->
                <a href="${this.#resource.link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
                    <div class="position-relative overflow-hidden" style="height: 200px;">
                        <img 
                            class="card-img-top w-100 h-100 object-fit-cover" 
                            src="${this.#resource.image}" 
                            alt="${this.#resource.name}" 
                            loading="lazy"
                        />
                        <!-- Badge categoria overlay -->
                        <span class="position-absolute top-0 end-0 m-2 badge bg-primary">
                            ${this.#resource.category?.name}
                        </span>
                    </div>
                </a>

                <!-- Card Body -->
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold text-dark mb-2">${this.#resource.name}</h5>
                    
                    ${this.#resource.description
                ? `<p class="card-text text-muted small mb-3 flex-grow-1">${this.#resource.description}</p>`
                : '<div class="flex-grow-1"></div>'}

                    <!-- Bottoni Admin -->
                    ${this.user?.is_admin ? `
                        <div class="d-flex gap-2 mt-auto">
                            <button class="btn btn-sm btn-outline-primary flex-fill update" data-resource-id="${this.#resource.id}">
                                <i class="bi bi-pencil-square me-1"></i>
                                Modifica
                            </button>
                            <button class="btn btn-sm btn-outline-danger flex-fill delete" data-resource-id="${this.#resource.id}">
                                <i class="bi bi-trash me-1"></i>
                                Elimina
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Link esterno footer -->
                <div class="card-footer bg-light border-0 text-center">
                    <a href="${this.#resource.link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-primary small">
                        <i class="bi bi-box-arrow-up-right me-1"></i>
                        Apri risorsa
                    </a>
                </div>
            </article>
        </div>

        <!-- Modal Modifica (FUORI dalla card grid) -->
        <div class="modal fade" id="editModal-${this.#resource.id}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-pencil-square me-2"></i>
                            Modifica Risorsa
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="editForm-${this.#resource.id}">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Nome</label>
                                <input class="form-control" type="text" name="name" value="${this.#resource.name}" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Categoria</label>
                                <select class="form-select" id="categorySelectEdit-${this.#resource.id}" name="category_id">
                                    <option value="">Caricamento...</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Immagine URL</label>
                                <input class="form-control" type="url" name="image" value="${this.#resource.image}" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Link Destinazione</label>
                                <input class="form-control" type="url" name="link" value="${this.#resource.link}" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Descrizione</label>
                                <textarea class="form-control" name="description" rows="3">${this.#resource.description || ''}</textarea>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button type="submit" form="editForm-${this.#resource.id}" class="btn btn-primary">
                            <i class="bi bi-check-circle me-1"></i>
                            Salva Modifiche
                        </button>
                    </div>

                    <!-- Errori -->
                    <div class="error-edit-card-${this.#resource.id} d-none alert alert-danger m-3"></div>
                    <div class="error-delete-card-${this.#resource.id} d-none alert alert-danger m-3"></div>
                </div>
            </div>
        </div>
    `;
    }

    async attachEventCard() {
        const editButton = document.querySelector(`.update[data-resource-id="${this.#resource.id}"]`);
        const form = document.getElementById(`editForm-${this.#resource.id}`);
        const deleteButton = document.querySelector(`.delete[data-resource-id="${this.#resource.id}"]`);

        editButton?.addEventListener('click', async () => {
            // Carica e popola le categorie quando si apre il modal
            await this.categorySelect.load();
            this.categorySelect.render();

            const modal = new Modal(document.getElementById(`editModal-${this.#resource.id}`));
            modal.show();
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleUpdateResource(this.#resource.id);

            const modal = Modal.getInstance(document.getElementById(`editModal-${this.#resource.id}`));
            modal?.hide();
        });

        deleteButton?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleDeleteResource(this.#resource.id);
        })
    }

    async handleUpdateResource(resourceId) {
        const form = document.getElementById(`editForm-${this.#resource.id}`);

        const isValid = Validator.validateForm(form, {
            name: {
                required: false,
                minLength: 3,
                messages: {
                    required: 'Il nome è obbligatorio',
                    minLength: 'Il nome deve essere di almeno 3 caratteri'
                }
            },
            category_id: {
                required: false,
                messages: {
                    required: 'La categoria è obbligatoria'
                }
            },
            link: {
                required: false,
                url: true,
                messages: {
                    required: 'Il link è obbligatorio',
                    url: 'Inserisci un URL valido'
                }
            },
            image: {
                url: true,
                messages: {
                    url: 'Inserisci un URL valido per l\'immagine'
                }
            }
        });

        if (!isValid) {
            ToastNotification.error('Compila correttamente tutti i campi');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            await this.resourcesApi.update(resourceId, data);

            ToastNotification.success('Risorsa aggiornata con successo!');

            if (this.#onUpdateCallback) this.#onUpdateCallback();

        } catch (e) {
            ToastNotification.error('Errore nell\'aggiornamento della risorsa');
            const errorUpdate = document.querySelector(`.error-edit-card-${this.#resource.id}`);
            errorUpdate.innerHTML = '<h2 class="error-title">Errore nella modifica della risorsa!</h2>'
            errorUpdate.classList.remove('d-none');
        }
    }

    async handleDeleteResource(resourceId) {
        if (!confirm('Sei sicuro di voler rimuovere questa risorsa?')) return;

        try {
            await this.resourcesApi.delete(resourceId);

            ToastNotification.success('✓ Risorsa eliminata con successo!');

            if (this.#onDeleteCallback) this.#onDeleteCallback();

        } catch (e) {
            ToastNotification.error('✗ Errore nell\'eliminazione della risorsa');
            const errorDelete = document.querySelector(`.error-delete-card-${this.#resource.id}`);
            errorDelete.innerHTML = '<h2 class="error-title">Errore nell\'eliminazione della risorsa!</h2>'
            errorDelete.classList.remove('d-none');
        }
    }
}