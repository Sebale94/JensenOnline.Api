const loadOrdersButton = document.querySelector('#loadOrdersButton');
const ordersContainer = document.querySelector('#orders');
const createOrderForm = document.querySelector('#createOrderForm');
const createOrderMessage = document.querySelector('#createOrderMessage');

loadOrdersButton.addEventListener('click', async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        ordersContainer.textContent = 'Du måste logga in först.';
        return;
    }

    try {
        const response = await fetch('/api/order', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            ordersContainer.textContent = getErrorMessage(response.status);
            return;
        }

        const orders = await response.json();

        ordersContainer.replaceChildren();

        orders.forEach(order => {
            const orderElement = document.createElement('div');

            const orderTitle = document.createElement('h3');
            orderTitle.textContent = `Order ID: ${order.id}`;

            const createdAt = document.createElement('p');
            createdAt.textContent =
                `Skapad: ${new Date(order.createdAt).toLocaleString()}`;

            orderElement.appendChild(orderTitle);
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

            ordersContainer.appendChild(orderElement);
        });

    } catch (error) {
        console.error(error);
        ordersContainer.textContent = 'Kunde inte kontakta servern.';
    }
});


createOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
        createOrderMessage.textContent = 'Du måste logga in först.';
        return;
    }

    const productId = parseInt(
        document.querySelector('#productId').value
    );

    const quantity = parseInt(
        document.querySelector('#quantity').value
    );

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        });

        if (!response.ok) {
            createOrderMessage.textContent =
                getErrorMessage(response.status);

            return;
        }

        const order = await response.json();

        createOrderMessage.textContent =
            `Order ${order.id} skapades!`;

        createOrderForm.reset();

    } catch (error) {
        console.error(error);
        createOrderMessage.textContent =
            'Kunde inte kontakta servern.';
    }
});