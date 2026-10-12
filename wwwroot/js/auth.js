const loginForm = document.querySelector('#loginForm');
const message = document.querySelector('#message');
const logoutButton = document.querySelector('#logoutButton');
const registerForm = document.querySelector('#registerForm');
const registerMessage = document.querySelector('#registerMessage');
const ordersSection = document.querySelector('#ordersSection');
const createOrderSection = document.querySelector('#createOrderSection');

const updateLoginVisibility = () => {
    const token = sessionStorage.getItem('token');

    if (token) {
        ordersSection.style.display = 'block';
        createOrderSection.style.display = 'block';
        logoutButton.style.display = 'block';
    } else {
        ordersSection.style.display = 'none';
        createOrderSection.style.display = 'none';
        logoutButton.style.display = 'none';
    }
};

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {

    if (response.status === 401) {
        message.textContent = 'Fel e-post eller lösenord.';
    } else {
        message.textContent = getErrorMessage(response.status);
    }

    return;
}

        const data = await response.json();

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('email', data.email);

        updateLoginVisibility();
        updateAdminVisibility();

        message.textContent = 'Inloggningen lyckades!';

    } catch (error) {
        console.error(error);
        message.textContent = 'Kunde inte kontakta servern.';
    }
});

logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');

    updateLoginVisibility();
    updateAdminVisibility();

    message.textContent = 'Du är utloggad.';
});

updateLoginVisibility();

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document
        .querySelector('#registerEmail')
        .value
        .trim();

    const password = document
        .querySelector('#registerPassword')
        .value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();

                registerMessage.textContent =
                    errorMessage || getErrorMessage(response.status);
            } else {
                registerMessage.textContent =
                    getErrorMessage(response.status);
            }

            return;
        }

        const data = await response.json();

        registerMessage.textContent =
            `Kontot ${data.email} har skapats. Du kan nu logga in.`;

        registerForm.reset();

    } catch (error) {
        console.error(error);

        registerMessage.textContent =
            'Kunde inte kontakta servern.';
    }
});

