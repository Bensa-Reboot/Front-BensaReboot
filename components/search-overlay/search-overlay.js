import { catalog, makeProductId } from '../../js/catalog.js';
import { formatPrice } from '../../js/utils.js';

class SearchOverlay extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.dataset.rendered === 'true') return;
    this.dataset.rendered = 'true';

    this.innerHTML = `
      <div class="search-overlay" aria-hidden="true">
        <div class="search-backdrop" data-overlay-close></div>
        <section class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <a class="brand" href="index.html" aria-label="Página inicial Bensa StreetWear">
            <img src="../images/logo-bensa.svg" alt="Bensa StreetWear">
          </a>
          <form class="search-form" data-search-form autocomplete="off">
            <label id="search-title" for="search-input">Pesquisar</label>
            <div class="search-input-wrapper">
              <input id="search-input" name="pesquisa" type="search" placeholder="O que você procura?">
              <button type="button" class="search-clear-btn" data-search-clear aria-label="Limpar pesquisa" hidden>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="search-suggestions" data-search-suggestions></div>
          </form>
          <button class="overlay-close" type="button" data-overlay-close aria-label="Fechar busca">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </section>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-open-search]')) this._open();
      if (t.closest('[data-overlay-close]')) this._close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });

    const form = this.querySelector('[data-search-form]');
    const input = this.querySelector('#search-input');
    const clearBtn = this.querySelector('[data-search-clear]');
    const suggestionsBox = this.querySelector('[data-search-suggestions]');

    const toggleClearBtn = () => {
      const hasValue = input.value.trim().length > 0;
      clearBtn.hidden = !hasValue;
    };

    input?.addEventListener('input', () => {
      const term = input.value.trim();
      toggleClearBtn();

      if (term.length < 1) {
        suggestionsBox.innerHTML = '';
        suggestionsBox.classList.remove('is-visible');
        return;
      }

      const results = this._searchAll(term);
      if (results.length === 0) {
        suggestionsBox.innerHTML = '<p class="search-no-results">Nenhum produto encontrado</p>';
        suggestionsBox.classList.add('is-visible');
        return;
      }

      // BUG 9 CORRIGIDO: usar formatPrice em vez de toFixed manual
      suggestionsBox.innerHTML = results.map(p => `
        <a href="produto.html?id=${p.id}" class="search-suggestion-item">
          <img src="${p.image}" alt="${p.title}">
          <div>
            <p class="search-suggestion-title">${p.title}</p>
            <p class="search-suggestion-price">${formatPrice(p.price)}</p>
          </div>
        </a>
      `).join('');
      suggestionsBox.classList.add('is-visible');
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      input.focus();
      toggleClearBtn();
      suggestionsBox.innerHTML = '';
      suggestionsBox.classList.remove('is-visible');
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const termo = input?.value.trim();
      if (termo) {
        window.location.href = `categoria.html?tipo=busca&q=${encodeURIComponent(termo)}`;
        this._close();
      }
    });
  }

  _searchAll(term) {
    const results = [];
    const lower = term.toLowerCase();
    const seen = new Set();

    for (const [sectionKey, section] of Object.entries(catalog)) {
      if (!section.products) continue;
      section.products.forEach((p, i) => {
        const id = makeProductId(sectionKey, p.title, i);
        if (!seen.has(id) && p.title.toLowerCase().includes(lower)) {
          seen.add(id);
          results.push({ ...p, id });
        }
      });
    }

    return results.slice(0, 8);
  }

  _open() {
    const overlay = this.querySelector('.search-overlay');
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const input = this.querySelector('#search-input');
    if (input) {
      input.value = '';
      this.querySelector('[data-search-clear]').hidden = true;
      const box = this.querySelector('[data-search-suggestions]');
      if (box) box.classList.remove('is-visible');
      setTimeout(() => input.focus(), 100);
    }
  }

  _close() {
    const overlay = this.querySelector('.search-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    const box = this.querySelector('[data-search-suggestions]');
    if (box) {
      box.innerHTML = '';
      box.classList.remove('is-visible');
    }
  }
}

customElements.define('search-overlay', SearchOverlay);
