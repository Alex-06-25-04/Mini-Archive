import { Modal } from 'bootstrap';
import Validator from '../utils/Validator.js';
import CategorySelect from './CategorySelect.js';
import ToastNotification from './ToastNotification.js';
import ResourcesApi from '../api/ResourcesApi.js';

export default class AddResourceModal {
    constructor(onResourceAdded) {
        this.resourcesApi = new ResourcesApi();
        this.categorySelect = new CategorySelect('categorySelect');
        this.onResourceAdded = onResourceAdded;
    }

    render() {
        return `
        <div class="modal fade" id="addResourceModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-light">
                        <h5 class="modal-title">Aggiungi Nuova Risorsa</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <form id="addResourceForm">
                            <div class="mb-3">
                                <label class="form-label">Nome</label>
                                <input type="text" class="form-control" name="name" required />
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Categoria</label>
                                <select class="form-select" id="categorySelect" name="category_id">
                                    <option value="">Caricamento...</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Immagine URL</label>
                                <input type="text" class="form-control" name="image" required />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Link</label>
                                <input type="text" class="form-control" name="link" required />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Descrizione</label>
                                <textarea class="form-control" name="description"></textarea>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                                <button type="submit" class="btn btn-primary">Salva</button>
                            </div>
                        </form>
                    </div>
                </div>          
            </div>
        </div>
        `;
    }

    attachEvents() {
        // Carica categorie quando il modal si apre
        const modalElement = document.getElementById('addResourceModal');
        modalElement?.addEventListener('shown.bs.modal', async () => {
            await this.categorySelect.load();
            this.categorySelect.render();
        });

        // Gestisci submit form
        const form = document.getElementById('addResourceForm');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSave(form);
        });
    }

    async handleSave(form) {
        const isValid = Validator.validateForm(form, {
            name: {
                required: true,
                minLength: 3,
                messages: {
                    required: 'Il nome della risorsa è obbligatorio',
                    minLength: 'Il nome deve essere di almeno 3 caratteri'
                }
            },
            category_id: {
                required: true,
                messages: {
                    required: 'Seleziona una categoria'
                }
            },
            link: {
                required: true,
                url: true,
                messages: {
                    required: 'Il link è obbligatorio',
                    url: 'Inserisci un URL valido (es: https://esempio.com)'
                }
            },
            image: {
                required: true,
                url: true,
                messages: {
                    required: 'L\'URL dell\'immagine è obbligatorio',
                    url: 'Inserisci un URL valido per l\'immagine'
                }
            }
        });

        if (!isValid) {
            ToastNotification.error('Compila correttamente tutti i campi obbligatori');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            await this.resourcesApi.create(data);

            ToastNotification.success('✓ Risorsa creata con successo!');

            // Chiudi il modale
            const modal = Modal.getInstance(document.getElementById('addResourceModal'));
            modal.hide();

            // Resetta il form
            form.reset();

            if (this.onResourceAdded) this.onResourceAdded();

        } catch (e) {
            ToastNotification.error('✗ Errore nella creazione della risorsa');
            alert('Errore durante la creazione della risorsa');
            console.error(e);
        }
    }
}