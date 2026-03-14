document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage');

    // Check if user is already logged in
    if (localStorage.getItem('token')) {
        window.location.href = 'dashboard.html';
    }

    // Tab Switching Logic
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        authMessage.style.display = 'none';
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        authMessage.style.display = 'none';
    });

    // Login Handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('l-email').value;
        const password = document.getElementById('l-password').value;

        showMsg('Authenticating...', 'info');

        try {
            const res = await api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            showMsg('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showMsg(error.message, 'error');
        }
    });

    // Register Handler
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('r-name').value;
        const email = document.getElementById('r-email').value;
        const password = document.getElementById('r-password').value;
        const role = document.getElementById('r-role').value;

        showMsg('Creating account...', 'info');

        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            showMsg('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showMsg(error.message, 'error');
        }
    });

    function showMsg(text, type) {
        authMessage.textContent = text;
        authMessage.className = `message ${type}`;
        authMessage.style.display = 'block';
    }
});
