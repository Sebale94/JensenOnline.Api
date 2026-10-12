const productSelect = document.querySelector('#productId');
const productList = document.querySelector('#productList');
const searchInput = document.querySelector('#searchProduct');

let products = [];

const loadProducts = async () => {
    try {
        const response = await fetch('/api/product');

        if (!response.ok) {
            productList.textContent = getErrorMessage(response.status);
            return;
        }

        products = await response.json();

        displayProducts(products);
        fillProductSelect(products);

    } catch (error) {
        console.error(error);
        productList.textContent = 'Kunde inte kontakta servern.';
    }
};

const displayProducts = (productsToShow) => {
    productList.replaceChildren();

    productsToShow.forEach(product => {
        const productElement = document.createElement('div');

        const name = document.createElement('h3');
        name.textContent = product.name;

        const description = document.createElement('p');
        description.textContent = product.description;

        const price = document.createElement('p');
        price.textContent = `${product.price} kr`;

        productElement.appendChild(name);
        productElement.appendChild(description);
        productElement.appendChild(price);

        productList.appendChild(productElement);
    });
};

const fillProductSelect = (productsToShow) => {
    productSelect.replaceChildren();

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Välj produkt';

    productSelect.appendChild(defaultOption);

    productsToShow.forEach(product => {
        const option = document.createElement('option');

        option.value = product.id;
        option.textContent = `${product.name} - ${product.price} kr`;

        productSelect.appendChild(option);
    });
};

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
});

loadProducts();

