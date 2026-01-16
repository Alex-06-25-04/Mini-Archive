import AuthApi from '../api/AuthApi.js';

export default class NavbarSection {
    constructor(user) {
        this.user = user;
        this.authApi = new AuthApi();
    }

    render() {
        return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <i class="bi bi-archive-fill me-2" style="font-size: 1.5rem;"></i>
                    <span class="fw-bold">Mini Archive</span>
                </a>

                <div class="ms-auto d-flex align-items-center">
                    ${this.user
                ? `
                    <span class="text-white me-3">
                        <i class="bi bi-person-circle me-1"></i>
                        ${this.user.name}
                    </span>
                    ${this.user.is_admin ? '<span class="badge bg-warning text-dark me-3">Amministratore</span>' : ''}
                
                    <button class="btn btn-outline-light btn-sm logout">
                        <i class="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>
                `
                : ''}
                </div>
            </div>
        </nav>
        `;
    }

    attachEventsLogout() {
        const logout = document.querySelector('.logout');

        logout?.addEventListener('click', async () => {
            // Salva il contenuto originale
            const originalContent = logout.innerHTML;

            // Disabilita il bottone e mostra lo spinner
            logout.disabled = true;
            logout.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Logout...';

            try {
                await this.handleLogout();

            } catch (e) {
                logout.disabled = false;
                logout.innerHTML = originalContent;
                console.error('Errore durante il logout: ', e);
            }
        });
    }

    async handleLogout() {
        try {
            await this.authApi.logout();

            // Torna al login
            window.location.reload();

        } catch (e) {
            console.error('Errore logout:', e);
            alert('Errore durante il logout');
        }
    }
}