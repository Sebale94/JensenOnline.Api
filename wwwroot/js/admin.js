const adminSection = document.querySelector('#adminSection');
const createProductForm = document.querySelector('#createProductForm');
const createProductMessage = document.querySelector('#createProductMessage');
const loadAllOrdersButton = document.querySelector('#loadAllOrdersButton');
const allOrdersContainer = document.querySelector('#allOrders');
const updateProductForm = document.querySelector('#updateProductForm');
const updateProductMessage = document.querySelector('#updateProductMessage');

const updateAdminVisibility = () => {
    const role = sessionStorage.getItem('role');

    if (role === 'Admin') {
        adminSection.style.display = 'block';
    } else {
        adminSection.style.display = 'none';
    }
};

updateAdminVisibility();


// Skapa produkt
createProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
        createProductMessage.textContent = 'Du måste logga in först.';
        return;
    }

    const name = document.querySelector('#productName').value.trim();

    const price = parseFloat(
        document.querySelector('#productPrice').value
    );

    const description = document
        .querySelector('#productDescription')
        .value
        .trim();

    try {
        const response = await fetch('/api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                price: price,
                description: description
            })
        });

        if (!response.ok) {
            createProductMessage.textContent =
                getErrorMessage(response.status);

            return;
        }

        const product = await response.json();

        createProductMessage.textContent =
            `Produkten ${product.name} skapades!`;

        createProductForm.reset();

    } catch (error) {
        console.error(error);

        createProductMessage.textContent =
            'Kunde inte kontakta servern.';
    }
});


// Hämta alla orders
loadAllOrdersButton.addEventListener('click', async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        allOrdersContainer.textContent = 'Du måste logga in först.';
        return;
    }

    try {
        const response = await fetch('/api/order/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            allOrdersContainer.textContent =
                getErrorMessage(response.status);

            return;
        }

        const orders = await response.json();

        allOrdersContainer.replaceChildren();

        orders.forEach(order => {
            const orderElement = document.createElement('div');

            const orderTitle = document.createElement('h4');
            orderTitle.textContent = `Order ID: ${order.id}`;

            const userId = document.createElement('p');
            userId.textContent = `User ID: ${order.userId}`;

            const createdAt = document.createElement('p');
            createdAt.textContent =
                `Skapad: ${new Date(order.createdAt).toLocaleString()}`;

            orderElement.appendChild(orderTitle);
            orderElement.appendChild(userId);
            orderElement.appendChild(createdAt);

            order.items.forEach(item => {
                const product = document.createElement('p');
                product.textContent = `Produkt: ${item.product}`;

                const quantity = document.createElement('p');
                quantity.textContent = `Antal: ${item.quantity}`;

                orderElement.appendChild(product);
                orderElement.appendChild(quantity);
            });

            const line = document.createElement('hr');
            orderElement.appendChild(line);

            allOrdersContainer.appendChild(orderElement);
        });

    } catch (error) {
        console.error(error);

        allOrdersContainer.textContent =
            'Kunde inte kontakta servern.';
    }
});

updateProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
        updateProductMessage.textContent =
            'Du måste logga in först.';
        return;
    }

    const productId = parseInt(
        document.querySelector('#updateProductId').value
    );

    const name = document
        .querySelector('#updateProductName')
        .value
        .trim();

    const price = parseFloat(
        document.querySelector('#updateProductPrice').value
    );

    const description = document
        .querySelector('#updateProductDescription')
        .value
        .trim();

    try {
        const response = await fetch(`/api/product/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                price: price,
                description: description
            })
        });

        if (!response.ok) {
            updateProductMessage.textContent =
                getErrorMessage(response.status);

            return;
        }

        const product = await response.json();

        updateProductMessage.textContent =
            `Produkten ${product.name} har uppdaterats!`;

        updateProductForm.reset();

        loadProducts();

    } catch (error) {
        console.error(error);

        updateProductMessage.textContent =
            'Kunde inte kontakta servern.';
    }
});