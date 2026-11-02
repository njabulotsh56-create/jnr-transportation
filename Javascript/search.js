// ===== Dynamic content, search, filter and sort =====
const results = document.getElementById('results');

if (results) {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-filter');
    let items = [];

    // Load the data with fetch
    fetch('data/items.json')
        .then(response => {
            if (!response.ok) throw new Error('Could not load items');
            return response.json();
        })
        .then(data => {
            items = data;
            update();
        })
        .catch(error => {
            results.textContent = 'Sorry, the listings could not be loaded.';
            console.error(error);
        });

    // Build the cards with DOM methods
    function render(list) {
        results.replaceChildren();

        if (list.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No results found.';
            results.appendChild(message);
            return;
        }

        list.forEach(item => {
            const card = document.createElement('article');
            card.className = 'card';
            card.dataset.id = item.id;

            const title = document.createElement('h3');
            title.textContent = item.name;

            const desc = document.createElement('p');
            desc.className = 'description';
            desc.textContent = item.description;

           

            card.append(title, desc);
            results.appendChild(card);
        });
    }

    // Filter, search and sort
    function update() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;

        const list = items.filter(item =>
            (item.name.toLowerCase().includes(query) ||
             item.description.toLowerCase().includes(query)) &&
            (category === '' || category === 'all' || item.category === category)
        );

        if (sortSelect.value === 'name-asc') {
            list.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (sortSelect.value === 'name-desc') {
            list.sort((a, b) => b.name.localeCompare(a.name));
        }

        render(list);
    }

    [searchInput, categoryFilter, sortSelect].forEach(el =>
        el.addEventListener('input', update)
    );
}