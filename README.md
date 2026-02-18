# 📚 Mini Archive - Sistema di Gestione Risorse

Mini Archive è un'applicazione web moderna per organizzare e gestire risorse digitali (documenti, software, hardware, corsi, ecc.) con sistema di autenticazione, ruoli utente e interfaccia intuitiva.

## 🖼️ Screenshot

### Homepage con Risorse
![Homepage](docs/screenshots/homepage.png)

### Pagina Login
![Login](docs/screenshots/login.png)

### Creazione Nuova Risorsa (Admin)
![Create Modal](docs/screenshots/create-modal.png)

### Ricerca Risorse
![Search](docs/screenshots/search.png)

## ✨ Features

### Autenticazione & Autorizzazione
- 🔐 Registrazione e login utenti
- 🎫 Autenticazione API con Laravel Sanctum (Bearer Token)
- 👥 Sistema di ruoli (Admin / User)
- 🚪 Logout con invalidazione token

### Gestione Risorse (CRUD)
- ➕ Creazione risorse (solo admin)
- ✏️ Modifica risorse (solo admin)
- 🗑️ Eliminazione risorse (solo admin)
- 👁️ Visualizzazione risorse (tutti gli utenti)

### Funzionalità Avanzate
- 🔍 Ricerca risorse per nome o categoria
- 🏷️ Categorizzazione automatica (6 categorie predefinite)
- 🖼️ Immagini di anteprima per ogni risorsa
- 📱 Design completamente responsive
- ⚡ Interfaccia dinamica senza ricaricamento pagina (SPA-like)

## 🛠️ Stack Tecnologico

### Backend
- **Framework:** Laravel 11
- **Autenticazione:** Laravel Sanctum (Token-based API Auth)
- **Database:** SQLite (sviluppo) / MySQL (produzione)
- **Architettura:** Service Layer Pattern
- **Validazione:** Form Request Classes

### Frontend
- **JavaScript:** Vanilla JS (ES6+) - Nessun framework pesante
- **UI Framework:** Bootstrap 5.3
- **Icons:** Bootstrap Icons
- **Build Tool:** Vite
- **CSS:** Bootstrap + Custom CSS

### DevOps
- **Dependency Management:** Composer (PHP) + NPM (JS)
- **Version Control:** Git
- **Server:** Apache/Nginx + PHP 8.2+

## 📋 Requisiti di Sistema

- **PHP:** >= 8.2
- **Composer:** >= 2.0
- **Node.js:** >= 18.0
- **NPM:** >= 9.0
- **Database:** SQLite o MySQL/MariaDB
- **Estensioni PHP:** PDO, Mbstring, OpenSSL, JSON

## 🚀 Installazione

### 1. Clona il Repository
```bash
git clone https://github.com/tuo-username/mini-archive.git
cd mini-archive
```

### 2. Installa Dipendenze Backend
```bash
composer install
```

### 3. Installa Dipendenze Frontend
```bash
npm install
```

### 4. Configura Environment
```bash
cp .env.example .env
php artisan key:generate
```

Modifica il file `.env` con le tue configurazioni:
```env
DB_CONNECTION=sqlite
# Oppure per MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=mini_archive
# DB_USERNAME=root
# DB_PASSWORD=
```

### 5. Crea Database e Popola con Dati di Esempio
```bash
# Crea il file database (se usi SQLite)
touch database/database.sqlite

# Esegui migrazioni e seeder
php artisan migrate --seed
```

### 6. Avvia i Server

**In due terminali separati:**

Terminale 1 - Backend:
```bash
php artisan serve
# Server disponibile su: http://127.0.0.1:8000
```

Terminale 2 - Frontend:
```bash
npm run dev
# Frontend disponibile su: http://localhost:5173
```

### 7. Accedi all'Applicazione

Apri il browser su `http://localhost:5173`

**Credenziali di Test:**
- **Admin:** 
  - Email: `admin@test.com`
  - Password: `password`
- **User Normale:** 
  - Email: `user@test.com`
  - Password: `password`

## 📁 Struttura del Progetto
```
mini-archive/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # API Controllers
│   │   ├── Middleware/       # Custom Middleware (IsAdmin)
│   │   └── Requests/         # Form Request Validation
│   ├── Models/               # Eloquent Models
│   └── Services/             # Business Logic Layer
├── database/
│   ├── migrations/           # Database Schema
│   └── seeders/              # Data Seeders
├── resources/
│   ├── css/                  # Styles
│   ├── js/
│   │   ├── api/             # API Client
│   │   ├── components/      # UI Components
│   │   └── pages/           # Page Components
│   └── views/               # Blade Templates
├── routes/
│   ├── api.php              # API Routes
│   └── web.php              # Web Routes
└── public/                  # Public Assets
```

## 🔌 API Endpoints

### Autenticazione
```
POST   /api/register          - Registrazione nuovo utente
POST   /api/login             - Login e generazione token
POST   /api/logout            - Logout e invalidazione token (auth)
```

### Risorse (Public)
```
GET    /api/resources         - Lista tutte le risorse
GET    /api/resources/{id}    - Dettagli singola risorsa
GET    /api/resources/search  - Ricerca risorse (query: name, category)
```

### Risorse (Admin Only - Richiede Token)
```
POST   /api/resources         - Crea nuova risorsa
PUT    /api/resources/{id}    - Aggiorna risorsa
DELETE /api/resources/{id}    - Elimina risorsa
```

**Autenticazione API:**
Tutte le rotte protette richiedono header:
```
Authorization: Bearer {token}
```

## 🎨 Categorie Disponibili

1. 📄 **Documenti** - Guide, manuali, documentazione
2. 💻 **Software** - Applicazioni, tool, utilities
3. 🖥️ **Hardware** - Dispositivi, componenti
4. 📈 **Marketing** - Strumenti di marketing e analytics
5. 🎓 **Formazione** - Corsi, tutorial, risorse educative
6. 👥 **HR** - Risorse umane, recruiting

## 🧪 Testing
```bash
# Esegui tutti i test
php artisan test

# Test con coverage
php artisan test --coverage
```

## 📦 Build per Produzione
```bash
# Build assets frontend
npm run build

# Ottimizza autoload composer
composer install --optimize-autoloader --no-dev

# Cache configurazione Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🐛 Troubleshooting

### Errore "Failed to fetch" durante DELETE
- Verifica che `credentials: 'include'` sia commentato in `fetch.js`
- Controlla che il controllo del 204 sia prima del controllo Content-Type

### CORS Errors
- Verifica `config/cors.php` - `supports_credentials` deve essere `true`
- Controlla che `HandleCors` middleware sia applicato alle rotte API

### Token non riconosciuto
- Verifica che il token sia salvato correttamente in localStorage
- Controlla l'header `Authorization: Bearer {token}` nella richiesta

## 🤝 Contribuire

Le pull request sono benvenute! Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

## 📄 Licenza

Questo progetto è rilasciato sotto licenza [MIT](https://opensource.org/licenses/MIT).

## 👨‍💻 Autore

**Alessandro Maria Leonardo Mattera**
- GitHub: [https://github.com/Alex-06-25-04](https://github.com/Alex-06-25-04)
- LinkedIn: [https://linkedin.com/in/alessandro-mattera-538a48324](https://linkedin.com/in/alessandro-mattera-538a48324)
- Portfolio: [https://ale-portfolio.pages.dev/](https://ale-portfolio.pages.dev/)

## 🙏 Ringraziamenti

- Laravel Framework per l'eccellente documentazione
- Bootstrap per il sistema di design
- Community PHP e JavaScript per il supporto

---

⭐ Se questo progetto ti è stato utile, lascia una stella su GitHub!