import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import LoginPage from './pages/LoginPage.js';
import HomePage from './pages/HomePage.js';

const initApp = () => {
    const token = localStorage.getItem('token');

    if (token) {
        const home = new HomePage();
        home.init();
    } else {
        const login = new LoginPage();
        login.init();
    }
};

initApp();