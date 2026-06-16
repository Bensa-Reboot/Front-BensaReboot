import { formatPrice } from '../../js/utils.js';
const cart = {
  items: [],

  add(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this._notify();
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this._notify();
  },

  setQty(id, qty) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    if (qty < 1) {
      this.remove(id);
    } else {
      item.qty = qty;
      this._notify();
    }
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  _notify() {
    document.dispatchEvent(new CustomEvent('cart:updated'));
  }
};

window.cartState = cart;

function isSouthCep(cep) {
  const num = parseInt(cep.replace(/\D/g, ''), 10);
  return num >= 80000000 && num <= 99999999;
}

// Frete fixo para região sul quando abaixo do mínimo
const SOUTH_SHIPPING_PRICE = 9.90;
const SOUTH_FREE_THRESHOLD = 299;

class CartOverlay extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === 'true') return;
    this.dataset.rendered = 'true';

    this._shippingCalculated = false;
    this._shippingData = null;

    this.innerHTML = `
      <div class="cart-overlay" aria-hidden="true">
        <div class="cart-backdrop" data-overlay-close></div>
        <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div class="cart-head">
            <h2 id="cart-title">Carrinho de compras</h2>
            <button class="cart-close-btn" type="button" data-overlay-close>Fechar</button>
          </div>
          <div class="cart-body">
            <div class="cart-items-list"></div>
            <div class="cart-subtotal">
              <span>Subtotal (sem frete):</span>
              <strong class="cart-subtotal-value">R$ 0,00</strong>
            </div>
            <form class="cart-shipping">
              <label for="cart-cep">Meios de envio</label>
              <div class="cep-row">
                <input id="cart-cep" name="cep" inputmode="numeric" placeholder="Seu CEP" maxlength="9">
                <button type="submit" aria-label="Calcular frete">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </button>
              </div>
              <a class="cep-help" href="https://buscacepinter.correios.com.br/" target="_blank" rel="noopener">Não sei meu CEP</a>
              <div class="cart-shipping-result" hidden></div>
            </form>
            <div class="cart-total">
              <span>Total:</span>
              <strong class="cart-total-value">R$ 0,00</strong>
            </div>
            <p class="cart-checkout-error" hidden></p>
            <button class="checkout-button" type="button">Iniciar Compra</button>
            <a class="continue-link" href="categoria.html?tipo=calcados">Ver mais produtos</a>
          </div>
        </aside>
      </div>
    `;

    // ─── Botão Iniciar Compra ──────────────────────────────────
    const checkoutBtn = this.querySelector('.checkout-button');
    const checkoutError = this.querySelector('.cart-checkout-error');

    checkoutBtn?.addEventListener('click', () => {
      checkoutError.setAttribute('hidden', '');
      checkoutError.textContent = '';

      if (cart.items.length === 0) {
        checkoutError.textContent = 'Seu carrinho está vazio.';
        checkoutError.removeAttribute('hidden');
        return;
      }

      if (!this._shippingCalculated) {
        checkoutError.textContent = 'Calcule o frete antes de continuar.';
        checkoutError.removeAttribute('hidden');
        this.querySelector('input[name="cep"]')?.focus();
        return;
      }

      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        sessionStorage.setItem('checkoutCart', JSON.stringify(cart.items));
        sessionStorage.setItem('checkoutShipping', JSON.stringify(this._shippingData));
        window.location.href = 'login.html?redirect=checkout';
        return;
      }

      sessionStorage.setItem('checkoutCart', JSON.stringify(cart.items));
      sessionStorage.setItem('checkoutShipping', JSON.stringify(this._shippingData));
      window.location.href = 'checkout.html';
    });

    document.addEventListener('cart:updated', () => this._render());

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-open-cart]')) this._open();
      if (t.closest('[data-overlay-close]')) this._close();

      const removeBtn = t.closest('[data-cart-remove]');
      if (removeBtn) { cart.remove(removeBtn.dataset.cartRemove); return; }

      const qtyPlus = t.closest('[data-cart-qty-plus]');
      const qtyMinus = t.closest('[data-cart-qty-minus]');
      if (qtyPlus) {
        const id = qtyPlus.dataset.cartQtyPlus;
        const item = cart.items.find(i => i.id === id);
        if (item) cart.setQty(id, item.qty + 1);
        return;
      }
      if (qtyMinus) {
        const id = qtyMinus.dataset.cartQtyMinus;
        const item = cart.items.find(i => i.id === id);
        if (item) cart.setQty(id, item.qty - 1);
        return;
      }
      // BUG 4 CORRIGIDO: removido o handler de [data-favorite] daqui.
      // O main.js (bindFavorites) cuida de salvar e toglar o estado corretamente.
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });

    // ─── Frete ────────────────────────────────────────────────
    const shippingForm = this.querySelector('form.cart-shipping');
    const cepInput = shippingForm?.querySelector('input[name="cep"]');
    const resultBox = this.querySelector('.cart-shipping-result');

    cepInput?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
      e.target.value = v;
      this._shippingCalculated = false;
      this._shippingData = null;
    });

    shippingForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cep = cepInput?.value.replace(/\D/g, '') ?? '';

      if (cep.length !== 8) {
        resultBox.removeAttribute('hidden');
        resultBox.innerHTML = `<p class="cart-shipping-error">Digite um CEP válido (8 dígitos).</p>`;
        this._shippingCalculated = false;
        return;
      }

      resultBox.removeAttribute('hidden');
      resultBox.innerHTML = `<p class="cart-shipping-loading">Calculando frete...</p>`;

      const sul = isSouthCep(cep);
      const total = cart.total();

      if (sul) {
        // BUG 12 CORRIGIDO: região sul abaixo do mínimo tem frete R$9,90, não R$0
        const gratis = total >= SOUTH_FREE_THRESHOLD;
        const faltam = (SOUTH_FREE_THRESHOLD - total).toFixed(2).replace('.', ',');

        if (gratis) {
          this._shippingData = { cep, method: 'gratis', price: 0, label: 'Frete Grátis' };
          resultBox.innerHTML = `<p class="cart-shipping-free">✓ Frete grátis para sua região!</p>`;
        } else {
          this._shippingData = { cep, method: 'sul', price: SOUTH_SHIPPING_PRICE, label: `Entrega Sul (R$ ${SOUTH_SHIPPING_PRICE.toFixed(2).replace('.', ',')})` };
          resultBox.innerHTML = `
            <p class="cart-shipping-free">✓ Região sul — frete grátis a partir de R$ ${SOUTH_FREE_THRESHOLD},00.<br>
              <small>Faltam R$ ${faltam} para frete grátis. Frete atual: R$ ${SOUTH_SHIPPING_PRICE.toFixed(2).replace('.', ',')}.</small>
            </p>`;
        }
        this._shippingCalculated = true;
        this._render();
      } else {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await res.json();
          if (data.erro) {
            resultBox.innerHTML = `<p class="cart-shipping-error">CEP não encontrado.</p>`;
            this._shippingCalculated = false;
            return;
          }
        } catch {
          resultBox.innerHTML = `<p class="cart-shipping-error">Erro ao consultar CEP. Tente novamente.</p>`;
          this._shippingCalculated = false;
          return;
        }

        this._shippingCalculated = true;
        this._shippingData = { cep, method: 'pac', price: 19.90, label: 'PAC (5 a 10 dias úteis)' };

        resultBox.innerHTML = `
          <p class="cart-shipping-label">Escolha o método de envio:</p>
          <div class="cart-shipping-options">
            <label class="cart-shipping-option">
              <input type="radio" name="shipping_method" value="pac" checked>
              <div class="cart-shipping-option-info">
                <span class="cart-shipping-option-name">PAC</span>
                <span class="cart-shipping-option-eta">5 a 10 dias úteis</span>
              </div>
              <span class="cart-shipping-option-price">R$ 19,90</span>
            </label>
            <label class="cart-shipping-option">
              <input type="radio" name="shipping_method" value="sedex">
              <div class="cart-shipping-option-info">
                <span class="cart-shipping-option-name">SEDEX</span>
                <span class="cart-shipping-option-eta">1 a 3 dias úteis</span>
              </div>
              <span class="cart-shipping-option-price">R$ 34,90</span>
            </label>
          </div>
        `;

        resultBox.querySelectorAll('input[name="shipping_method"]').forEach(radio => {
          radio.addEventListener('change', () => {
            if (radio.value === 'sedex') {
              this._shippingData = { cep, method: 'sedex', price: 34.90, label: 'SEDEX (1 a 3 dias úteis)' };
            } else {
              this._shippingData = { cep, method: 'pac', price: 19.90, label: 'PAC (5 a 10 dias úteis)' };
            }
            this._render();
          });
        });

        this._render();
      }
    });

    this._render();
  }

  _render() {
    const list = this.querySelector('.cart-items-list');
    const subtotal = this.querySelector('.cart-subtotal-value');
    const total = this.querySelector('.cart-total-value');
    if (!list) return;

    if (cart.items.length === 0) {
      list.innerHTML = `<p class="cart-empty">Seu carrinho está vazio.</p>`;
    } else {
      list.innerHTML = cart.items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <div class="cart-item-top">
              <div>
                <p class="cart-item-title">${item.title}</p>
                <p class="cart-item-size">(${item.size})</p>
              </div>
              <button class="cart-remove" type="button"
                data-cart-remove="${item.id}"
                aria-label="Remover ${item.title}">✕</button>
            </div>
            <div class="cart-item-bottom">
              <div class="quantity-control" aria-label="Quantidade">
                <button type="button" data-cart-qty-minus="${item.id}" aria-label="Diminuir">−</button>
                <span>${item.qty}</span>
                <button type="button" data-cart-qty-plus="${item.id}" aria-label="Aumentar">+</button>
              </div>
              <strong class="cart-price">${formatPrice(item.price * item.qty)}</strong>
            </div>
          </div>
        </div>
      `).join('');
    }

    const shippingPrice = this._shippingData?.price ?? 0;
    const cartTotal = cart.total() + shippingPrice;
    if (subtotal) subtotal.textContent = formatPrice(cart.total());
    if (total) total.textContent = formatPrice(cartTotal);
  }

  _open() {
    const overlay = this.querySelector('.cart-overlay');
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    this.querySelector('[data-overlay-close]')?.focus();
  }

  _close() {
    const overlay = this.querySelector('.cart-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
}

customElements.define('cart-overlay', CartOverlay);
