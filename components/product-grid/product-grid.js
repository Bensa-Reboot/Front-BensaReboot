import { brandSymbols, brandLabels, catalog, makeProductId } from '../../js/catalog.js';
import { formatPrice } from '../../js/utils.js'; 

class ProductGrid extends HTMLElement {
  constructor() {
    super();
    this._allProducts = [];
    this._filtered = [];
    this._symbol = '';
    this._defaultProducts = [];
    this._isFilterable = false;
  }

  connectedCallback() {
    if (this.dataset.rendered === 'true') return;
    this.dataset.rendered = 'true';

    this._isFilterable = this.hasAttribute('data-filterable');

    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('tipo');
    const marca = params.get('marca')?.toLowerCase().replace(/\s/g, '');
    const busca = params.get('q')?.trim();

    // Modo busca
    if (tipo === 'busca' && busca) {
      const allProducts = [];
      for (const [key, section] of Object.entries(catalog)) {
        allProducts.push(...section.products.map((p, i) => ({
          ...p,
          id: makeProductId(key, p.title, i),
          sectionKey: key
        })));
      }

      const unique = [];
      const seen = new Set();
      for (const p of allProducts) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          unique.push(p);
        }
      }

      const termo = busca.toLowerCase();
      this._allProducts = unique.filter(p => p.title.toLowerCase().includes(termo));
      this._filtered = [...this._allProducts];
      this._symbol = '';
      this._render();
      this._bindSort();
      this._bindFilter();
      return;
    }

    // Modo normal
    const key = marca || tipo || 'calcados';
    const data = catalog[key] || catalog.calcados;

    const amount = Number(this.getAttribute('data-products') || 9);
    this._allProducts = data.products.slice(0, amount).map((p, i) => ({
      ...p,
      id: makeProductId(key, p.title, i)
    }));
    this._filtered = [...this._allProducts];
    this._defaultProducts = [...this._allProducts];
    this._symbol = data.symbol;

    if (marca) {
      const label = brandLabels[marca] || marca;
      const breadcrumb = document.querySelector('[data-marca-breadcrumb]');
      const title = document.querySelector('[data-marca-title]');
      if (breadcrumb) breadcrumb.textContent = label;
      if (title) {
        const logoHtml = data.symbol
          ? data.symbol.replace('class="brand-logo-mark"', 'class="brand-logo-heading"')
          : '';
        title.innerHTML = `${logoHtml} ${label}`;
      }
      document.title = `${label} | Bensa StreetWear`;
    }

    this._render();
    this._bindSort();
    this._bindFilter();

    if (this._isFilterable) {
      this._bindFilterChips();
    }
  }

  _bindFilterChips() {
    const chips = document.querySelectorAll('.filter-chip');
    if (chips.length === 0) return;

    const handleChipClick = (chip) => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const brand = chip.textContent.trim();
      if (brand === 'Ver todas') {
        this._filtered = [...this._defaultProducts];
        this._render();
        return;
      }

      const key = brand.toLowerCase().replace(/\s/g, '');
      const section = catalog[key];

      let products = [];
      if (section && section.products) {
        const amount = Number(this.getAttribute('data-products') || 3);
        products = section.products.slice(0, amount).map((p, i) => ({
          ...p,
          id: makeProductId(key, p.title, i)
        }));
      }

      this._filtered = products;
      this._render();
    };

    chips.forEach(chip => {
      chip.addEventListener('click', () => handleChipClick(chip));
    });
  }

  _productCardTemplate(p) {
    const badge = p.badge
      ? `<span class="product-badge">${p.badge}</span>`
      : `<span class="product-badge" style="visibility:hidden">-</span>`;

    const symbol = this._symbol
      ? `<div class="card-brand-mark">${this._symbol}</div>`
      : '';

    return `
    <article class="product-card">
      <div class="product-top">
        ${symbol}
        <button class="favorite-button" type="button" data-favorite aria-label="Salvar produto como favorito">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
        </button>
        <a href="produto.html?id=${p.id}" aria-label="Ver produto ${p.title}">
          <img src="${p.image}" alt="${p.title}">
        </a>
      </div>
      ${badge}
      <a class="product-title" href="produto.html?id=${p.id}">${p.title}</a>
     <strong class="product-price">${formatPrice(p.price)}</strong>
      <button
        class="bag-button ${p.stock === 0 ? 'is-disabled' : ''}"
        type="button"
        ${p.stock > 0 ? `data-add-to-cart data-product='${JSON.stringify({ id: p.id, title: p.title, price: p.price, image: p.image, size: 'Único' })}'` : 'disabled'}
        aria-label="Adicionar ${p.title} ao carrinho"
        ${p.stock === 0 ? 'title="Esgotado"' : ''}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 7h12l1 14H5L6 7ZM9 7a3 3 0 0 1 6 0"/></svg>
      </button>
    </article>
  `;
  }

  _render() {
    if (this._filtered.length === 0) {
      const msg = this._isFilterable
        ? 'Não há novos lançamentos dessa marca, fique de olho!'
        : 'Nenhum produto encontrado.';
      this.innerHTML = `<p class="grid-empty-message" style="grid-column: 1 / -1; text-align: center; color: var(--color-muted); font-size: 16px; font-weight: 600; padding: 96px 24px; background: var(--color-soft); border-radius: 12px; border: 1px dashed var(--color-line); min-height: 360px; display: flex; align-items: center; justify-content: center; margin: 0;">${msg}</p>`;
      return;
    }
    this.innerHTML = this._filtered.map(p => this._productCardTemplate(p)).join('');
  }

  _dropdown(anchorBtn, items, onSelect) {
    let dropdown = null;

    anchorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown) { dropdown.remove(); dropdown = null; return; }

      const wrapper = anchorBtn.parentElement;
      wrapper.style.position = 'relative';

      dropdown = document.createElement('ul');

      const wrapperRect = wrapper.getBoundingClientRect();
      const btnRect = anchorBtn.getBoundingClientRect();
      const leftOffset = btnRect.left - wrapperRect.left;

      dropdown.style.cssText = `
        position:absolute;
        top:calc(100% + 8px);
        left:${leftOffset}px;
        background:#fff;border:1px solid #dfdfdf;border-radius:8px;
        list-style:none;margin:0;padding:8px 0;min-width:200px;
        box-shadow:0 8px 22px rgba(0,0,0,.12);z-index:50;
      `;

      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.label;
        li.style.cssText = 'padding:12px 20px;cursor:pointer;font-size:14px;font-weight:600;font-family:Montserrat,sans-serif;white-space:nowrap;color:#151515;';
        li.addEventListener('mouseenter', () => li.style.background = '#f3f3f3');
        li.addEventListener('mouseleave', () => li.style.background = '');
        li.addEventListener('click', (ev) => { ev.stopPropagation(); item.action(); dropdown.remove(); dropdown = null; });
        dropdown.appendChild(li);
      });

      wrapper.appendChild(dropdown);
      setTimeout(() => document.addEventListener('click', () => { dropdown?.remove(); dropdown = null; }, { once: true }), 0);
    });
  }

  _bindSort() {
    const btn = [...document.querySelectorAll('.catalog-tools button')].find(b => b.textContent.includes('Ordenar'));
    if (!btn) return;
    const options = [
      { label: 'Menor preço', action: () => { this._filtered = [...this._filtered].sort((a, b) => a.price - b.price); this._render(); } },
      { label: 'Maior preço', action: () => { this._filtered = [...this._filtered].sort((a, b) => b.price - a.price); this._render(); } },
      { label: 'A–Z', action: () => { this._filtered = [...this._filtered].sort((a, b) => a.title.localeCompare(b.title)); this._render(); } },
      { label: 'Z–A', action: () => { this._filtered = [...this._filtered].sort((a, b) => b.title.localeCompare(a.title)); this._render(); } },
    ];
    this._dropdown(btn, options, () => { });
  }

  _bindFilter() {
    const btn = [...document.querySelectorAll('.catalog-tools button')].find(b => b.textContent.includes('Filtrar'));
    if (!btn) return;
    const filters = [
      { label: 'Todos', action: () => { this._filtered = [...this._allProducts]; this._render(); } },
      { label: 'Até R$150', action: () => { this._filtered = this._allProducts.filter(p => p.price <= 150); this._render(); } },
      { label: 'Até R$300', action: () => { this._filtered = this._allProducts.filter(p => p.price <= 300); this._render(); } },
      { label: 'Até R$500', action: () => { this._filtered = this._allProducts.filter(p => p.price <= 500); this._render(); } },
      { label: 'Até R$800', action: () => { this._filtered = this._allProducts.filter(p => p.price <= 800); this._render(); } },
      { label: 'Acima de R$800', action: () => { this._filtered = this._allProducts.filter(p => p.price > 800); this._render(); } },
      { label: 'Best Seller', action: () => { this._filtered = this._allProducts.filter(p => p.badge === 'Best Seller'); this._render(); } },
      { label: 'Novidades', action: () => { this._filtered = this._allProducts.filter(p => p.badge === 'Novo'); this._render(); } },
    ];
    this._dropdown(btn, filters, () => { });
  }
}

customElements.define('product-grid', ProductGrid);