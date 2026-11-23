const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMore');
const clearGalleryBtn = document.getElementById('clearGallery');
const removeLastBtn = document.getElementById('removeLast');
const reverseGalleryBtn = document.getElementById('reverseGallery');
const shuffleGalleryBtn = document.getElementById('shuffleGallery');

let currentPage = 1;
const limit = 4;
const loadedIds = new Set(); // Зберігає ID завантажених фото, щоб уникнути дублікатів

// Функція отримання фото з API
async function fetchImages() {
    try {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Завантаження...';

        const response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const images = await response.json();
        currentPage++;

        images.forEach(image => {
            if (!loadedIds.has(image.id)) {
                loadedIds.add(image.id);
                renderImageCard(image);
            }
        });
    } catch (error) {
        console.error('Не вдалося завантажити зображення:', error);
        alert('Помилка під час завантаження зображень. Перевірте підключення до мережі.');
    } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Завантажити ще 4 картинки';
    }
}

// Створення DOM-елемента картки
function renderImageCard(image) {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.dataset.id = image.id;

    const img = document.createElement('img');
    // Використовуємо оптимізований розмір 500x400 замість оригіналу для швидкого завантаження
    img.src = `https://picsum.photos/id/${image.id}/500/400`;
    img.alt = `Фото від ${image.author}`;
    img.loading = 'lazy';

    const author = document.createElement('div');
    author.className = 'author';
    author.textContent = `Автор: ${image.author}`;

    card.appendChild(img);
    card.appendChild(author);
    gallery.appendChild(card);
}

// 1. Завантажити ще 4 картинки
loadMoreBtn.addEventListener('click', fetchImages);

// 2. Очистити галерею
clearGalleryBtn.addEventListener('click', () => {
    gallery.innerHTML = '';
    loadedIds.clear();
});

// 3. Видалити останню картинку
removeLastBtn.addEventListener('click', () => {
    const lastCard = gallery.lastElementChild;
    if (lastCard) {
        loadedIds.delete(lastCard.dataset.id);
        lastCard.remove();
    }
});

// 4. Перевернути галерею
reverseGalleryBtn.addEventListener('click', () => {
    const items = Array.from(gallery.children);
    if (items.length > 1) {
        items.reverse().forEach(item => gallery.appendChild(item));
    }
});

// 5. Додатковий функціонал: Перемішати галерею (алгоритм Фішера — Єйтса)
shuffleGalleryBtn.addEventListener('click', () => {
    const items = Array.from(gallery.children);
    if (items.length > 1) {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        items.forEach(item => gallery.appendChild(item));
    }
});

// Початкове завантаження 4 картинок при відкритті сторінки
document.addEventListener('DOMContentLoaded', fetchImages);