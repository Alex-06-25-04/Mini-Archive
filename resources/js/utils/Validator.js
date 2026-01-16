export default class Validator {
    /**
     * Valida un campo email
     */
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Valida un URL
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica che un campo non sia vuoto
     */
    static isNotEmpty(value) {
        return value && value.trim().length > 0;
    }

    /**
     * Verifica lunghezza minima
     */
    static minLength(value, min) {
        return value && value.length >= min;
    }

    /**
     * Mostra errore sotto un campo
     */
    static showError(input, message) {
        // Rimuovi errore precedente se esiste
        this.clearError(input);

        // Aggiungi classe di errore al campo
        input.classList.add('is-invalid');

        // Crea messaggio di errore
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;

        // Inserisci dopo il campo
        input.parentElement.appendChild(errorDiv);
    }

    /**
     * Rimuove errore da un campo
     */
    static clearError(input) {
        input.classList.remove('is-invalid');
        const errorDiv = input.parentElement.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Rimuove tutti gli errori da un form
     */
    static clearAllErrors(form) {
        const inputs = form.querySelectorAll('.is-invalid');
        inputs.forEach(input => this.clearError(input));
    }

    /**
     * Valida un intero form
     * @param {HTMLFormElement} form - Il form da validare
     * @param {Object} rules - Regole di validazione
     * @returns {boolean} - true se valido, false altrimenti
     */
    static validateForm(form, rules) {
        this.clearAllErrors(form);
        let isValid = true;

        for (const [fieldName, fieldRules] of Object.entries(rules)) {
            const input = form.querySelector(`[name="${fieldName}"]`);
            if (!input) return;

            const value = input.value;

            // Required
            if (fieldRules.required && !this.isNotEmpty(value)) {
                this.showError(input, fieldRules.messages?.required || 'Questo campo è obbligatorio');
                isValid = false;
                continue;
            }

            // Se il campo è vuoto e non è required, salta le altre validazioni
            if (!value) return;

            // Email
            if (fieldRules.email && !this.isValidEmail(value)) {
                this.showError(input, fieldRules.messages?.email || 'Inserisci un\'email valida');
                isValid = false;
                continue;
            }

            // URL
            if (fieldRules.url && !this.isValidUrl(value)) {
                this.showError(input, fieldRules.messages?.url || 'Inserisci un URL valido');
                isValid = false;
                continue;
            }

            // Min Length
            if (fieldRules.minLength && !this.minLength(value, fieldRules.minLength)) {
                this.showError(input, fieldRules.messages?.minLength || `Minimo ${fieldRules.minLength} caratteri`);
                isValid = false;
                continue;
            }
        }

        return isValid;
    }
}