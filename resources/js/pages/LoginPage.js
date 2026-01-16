import AuthApi from '../api/AuthApi.js';
import Validator from '../utils/Validator.js';
import ToastNotification from '../components/ToastNotification.js';

export default class LoginPage {
    constructor() {
        this.authApi = new AuthApi();
        this.app = document.getElementById('app');
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        this.app.innerHTML = `
    <div class="container min-vh-100 d-flex align-items-center justify-content-center">
        <div class="row w-100 justify-content-center">
            <div class="col-md-10 col-lg-8">
                <div id="auth-container" class="auth-container card shadow-lg border-0 rounded-4 overflow-hidden">
                    <div class="row g-0">
                        <!-- Login Container -->
                        <div class="col-md-6 form-container login-container p-5">
                            <div class="text-center mb-4">
                                <i class="bi bi-archive-fill text-primary" style="font-size: 3rem;"></i>
                                <h2 class="mt-3 fw-bold">Accedi</h2>
                            </div>
                            
                            <form id="loginForm">
                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="bi bi-envelope-fill me-2"></i>Email
                                    </label>
                                    <input 
                                        type="email" 
                                        class="form-control form-control-lg" 
                                        placeholder="tua@email.com" 
                                        name="email" 
                                        required 
                                    />
                                </div>
                                
                                <div class="mb-4">
                                    <label class="form-label">
                                        <i class="bi bi-lock-fill me-2"></i>Password
                                    </label>
                                    <input 
                                        type="password" 
                                        class="form-control form-control-lg" 
                                        placeholder="••••••••" 
                                        name="password" 
                                        required 
                                    />
                                </div>
                                
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary btn-lg">
                                        <i class="bi bi-box-arrow-in-right me-2"></i>Login
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Register Container -->
                        <div class="col-md-6 form-container register-container p-5">
                            <div class="text-center mb-4">
                                <i class="bi bi-person-plus-fill text-success" style="font-size: 3rem;"></i>
                                <h2 class="mt-3 fw-bold">Registrati</h2>
                            </div>
                            
                            <form id="registerForm">
                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="bi bi-person-fill me-2"></i>Nome
                                    </label>
                                    <input 
                                        type="text" 
                                        class="form-control form-control-lg" 
                                        placeholder="Mario Rossi" 
                                        name="name" 
                                        required 
                                    />
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="bi bi-envelope-fill me-2"></i>Email
                                    </label>
                                    <input 
                                        type="email" 
                                        class="form-control form-control-lg" 
                                        placeholder="tua@email.com" 
                                        name="email" 
                                        required 
                                    />
                                </div>
                                
                                <div class="mb-4">
                                    <label class="form-label">
                                        <i class="bi bi-lock-fill me-2"></i>Password
                                    </label>
                                    <input 
                                        type="password" 
                                        class="form-control form-control-lg" 
                                        placeholder="••••••••" 
                                        name="password" 
                                        required 
                                    />
                                </div>
                                
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-success btn-lg">
                                        <i class="bi bi-person-check-fill me-2"></i>Registrati
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Switch Panel (UN SOLO PANNELLO CHE SI SPOSTA) -->
                        <div class="col-md-6 switch-panel bg-gradient-primary d-flex align-items-center justify-content-center p-5 text-white">
                            <div class="text-center">
                                <i class="bi bi-person-plus-fill switch-icon" style="font-size: 4rem; opacity: 0.8;"></i>
                                <h3 class="mt-4 fw-bold" id="switchText">Non hai un account?</h3>
                                <p class="mb-4 switch-description">Registrati per iniziare a usare Mini Archive</p>
                                <button id="switchBtn" class="btn btn-outline-light btn-lg px-5">
                                    Registrati
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    attachEvents() {
        const switchBtn = document.getElementById('switchBtn');
        const switchText = document.getElementById('switchText');
        const authContainer = document.getElementById('auth-container');

        let isRegister = false;

        switchBtn?.addEventListener('click', () => {
            isRegister = !isRegister;

            authContainer.classList.toggle('register-active', isRegister);
            switchText.textContent = isRegister ? 'Hai già un account?' : 'Non hai un account?';
            switchBtn.textContent = isRegister ? 'Accedi' : 'Registrati';
        });

        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            await this.handleLogin(form);
        });

        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            await this.handleRegister(form, switchBtn);
        });
    }

    async handleLogin(form) {
        const isValid = Validator.validateForm(form, {
            email: {
                required: true,
                email: true,
                messages: {
                    required: 'L\'email è obbligatoria',
                    email: 'Inserisci un\'email valida (es: nome@esempio.com)'
                }
            },
            password: {
                required: true,
                minLength: 6,
                messages: {
                    required: 'La password è obbligatoria',
                    minLength: 'La password deve essere di almeno 6 caratteri'
                }
            }
        });

        if (!isValid) {
            ToastNotification.error('Compila correttamente tutti i campi');
            return;
        }

        const data = Object.fromEntries(new FormData(form));

        try {
            await this.authApi.login(data);

            ToastNotification.success('Login effettuato con successo!');

            import('./HomePage.js').then(({ default: HomePage }) => {
                const home = new HomePage();
                home.init();
            });

            form.reset();

        } catch (e) {
            ToastNotification.error('Email o password errati');
            console.error('Errore durante il login: ', e.target);
        }
    }

    async handleRegister(form, switchBtn) {
        const isValid = Validator.validateForm(form, {
            name: {
                required: true,
                minLength: 3,
                messages: {
                    required: 'Il nome è obbligatorio',
                    minLength: 'Il nome deve essere di almeno 3 caratteri'
                }
            },
            email: {
                required: true,
                email: true,
                messages: {
                    required: 'L\'email è obbligatoria',
                    email: 'Inserisci un\'email valida'
                }
            },
            password: {
                required: true,
                minLength: 6,
                messages: {
                    required: 'La password è obbligatoria',
                    minLength: 'La password deve essere di almeno 6 caratteri'
                }
            }
        });

        if (!isValid) {
            ToastNotification.error('Compila correttamente tutti i campi');
            return;
        }

        const data = Object.fromEntries(new FormData(form));

        try {
            await this.authApi.register(data);

            ToastNotification.success('Registrazione completata! Effettua il login');

            switchBtn.click(); // Torna al login

            form.reset();

        } catch (e) {
            ToastNotification.error('Errore durante la registrazione');
            console.error('Errore durante la registrazione: ', e.message);
        }
    }
}