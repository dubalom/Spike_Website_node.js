document.getElementById('searchInput').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const cards = document.querySelectorAll('.card'); // Assumes each drill is wrapped in a 'card' class

    if (searchQuery) {
        cards.forEach((card) => {
            if (card.textContent.toLowerCase().includes(searchQuery)) {
                card.style.display = ''; // Show matching cards
            } else {
                card.style.display = 'none'; // Hide non-matching cards
            }
        });
    } else {
        cards.forEach((card) => {
            card.style.display = ''; // Show all cards when the search query is cleared
        });
    }
});
function filterByCategory(category) {
    console.log("Filtering by category:", category);  // Debug: log the category being filtered
    const cards = document.querySelectorAll('.card');
    console.log("Total cards found:", cards.length);  // Debug: log total cards found

    cards.forEach(card => {
        const cardCategory = card.querySelector('p').textContent.toLowerCase().trim();
        console.log("Card category:", cardCategory); // Debug: See what's read from the card
        const categoryLower = category.toLowerCase().trim();

        if (categoryLower === '' || cardCategory.includes(categoryLower)) {
            card.style.display = ''; // Show matching cards
            console.log("Showing card:", cardCategory);  // More detailed log when showing a card
        } else {
            card.style.display = 'none'; // Hide non-matching cards
            console.log("Hiding card:", cardCategory);  // More detailed log when hiding a card
        }
    });
}

