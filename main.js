import { formatPrice } from './js/utils.js';
window.formatPrice = formatPrice;

import "./components/site-header/site-header.js";
import "./components/site-footer/site-footer.js";
import "./components/product-grid/product-grid.js";
import "./components/search-overlay/search-overlay.js";
import "./components/cart-overlay/cart-overlay.js";
import "./components/auth-layout/auth-layout.js";

const categoryLabels = {
    roupas: "Roupas",
    calcados: "Calçados",
    acessorios: "Acessórios",
    busca: "Busca",
};

document.addEventListener("DOMContentLoaded", () => {
    updateCatalogTitle();
    bindInteractions();
    bindScrollHeader();
    bindFavorites();
    bindGlobalAddToCart();
    bindShippingMarquee();
});

function bindGlobalAddToCart() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-to-cart][data-product]');
        if (!btn) return;
        try {
            const product = JSON.parse(btn.dataset.product);
            window.cartState?.add(product);
            document.querySelector('cart-overlay')?._open();
        } catch (_) { }
    });
}

function getFavorites() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user?.favorites ?? [];
}

function saveFavorites(favorites) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) return false;
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    user.favorites = favorites;
    localStorage.setItem('currentUser', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) { users[idx] = user; localStorage.setItem('registeredUsers', JSON.stringify(users)); }
    return true;
}

export function refreshFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll('.product-card').forEach(card => {
        const linkEl = card.querySelector('a[href*="produto.html"]');
        const href = linkEl?.getAttribute('href') ?? '';
        const id = new URLSearchParams(href.split('?')[1] ?? '').get('id');
        const btn = card.querySelector('[data-favorite]');
        if (!btn) return;
        if (id && favorites.some(f => f.id === id)) {
            btn.classList.add('is-active');
        } else {
            btn.classList.remove('is-active');
        }
    });
}

function bindFavorites() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-favorite]');
        if (!btn) return;

        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) { window.location.href = 'login.html'; return; }

        const card = btn.closest('.product-card');
        const titleEl = card?.querySelector('.product-title');
        const priceEl = card?.querySelector('.product-price');
        const linkEl = card?.querySelector('a[href*="produto.html"]');
        const imgEl = linkEl?.querySelector('img') ?? card?.querySelector('.product-top > a img');

        if (!titleEl) return;

        const title = titleEl.textContent.trim();
        const price = parseFloat(
            priceEl?.textContent.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
        ) || 0;
        const image = imgEl?.src ?? '';
        const href = linkEl?.getAttribute('href') ?? '';
        const id = new URLSearchParams(href.split('?')[1] ?? '').get('id') ?? title;

        const fav = { id, title, price, image };

        let favorites = getFavorites();
        const already = favorites.some(f => f.id === id);

        if (already) {
            favorites = favorites.filter(f => f.id !== id);
            btn.classList.remove('is-active');
        } else {
            favorites.push(fav);
            btn.classList.add('is-active');
        }

        saveFavorites(favorites);
    });

    refreshFavoriteButtons();

    const grid = document.querySelector('product-grid');
    if (grid) {
        const observer = new MutationObserver(() => refreshFavoriteButtons());
        observer.observe(grid, { childList: true });
    }
}

function bindScrollHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener("scroll", () => {
        header.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });
}

function bindShippingMarquee() {
    const track = document.querySelector('[data-shipping-track]');
    if (!track) return;

    const speed = 0.5;
    let position = 0;
    let animationId;
    let setWidth = 0;

    function setup() {
        const originalItems = [...track.children];
        const gap = parseFloat(getComputedStyle(track).gap) || 80;

        setWidth = originalItems.reduce((acc, item) => {
            return acc + item.getBoundingClientRect().width + gap;
        }, 0);

        const needed = Math.ceil((window.innerWidth * 2) / setWidth) + 1;
        for (let i = 0; i < needed; i++) {
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
        }
    }

    function animate() {
        position -= speed;
        if (setWidth > 0 && position <= -setWidth) {
            position += setWidth;
        }
        track.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
    }

    setup();
    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

function updateCatalogTitle() {
    const page = document.querySelector("[data-catalog-page]");
    if (!page) return;
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo") || "calcados";
    const busca = params.get("q");
    if (tipo === 'busca' && busca) {
        const label = `Busca: "${busca}"`;
        const title = document.querySelector("[data-catalog-title]");
        const breadcrumb = document.querySelector("[data-catalog-breadcrumb]");
        if (title) title.textContent = label;
        if (breadcrumb) breadcrumb.textContent = label;
        document.title = `${label} | Bensa StreetWear`;
        return;
    }
    const label = categoryLabels[tipo] || categoryLabels.calcados;
    const title = document.querySelector("[data-catalog-title]");
    const breadcrumb = document.querySelector("[data-catalog-breadcrumb]");
    if (title) title.textContent = label;
    if (breadcrumb) breadcrumb.textContent = label;
    document.title = `${label} | Bensa StreetWear`;
}

function bindInteractions() {
    document.addEventListener("click", (event) => {
        const target = event.target;
        const size = target.closest("[data-size]");
        if (size) {
            size.parentElement
                ?.querySelectorAll("[data-size]")
                .forEach((b) => b.classList.remove("is-active"));
            size.classList.add("is-active");
        }
    });
    document.addEventListener("submit", (event) => {
        if (event.target?.matches(".search-form, .cart-shipping")) {
            event.preventDefault();
        }
    });
}
