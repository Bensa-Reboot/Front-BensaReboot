import { catalog, makeProductId } from '../../js/catalog.js';
import { formatPrice } from '../../js/utils.js';

// componente customizado search overlay
// elemento que cria uma sobreposicao para busca de produtos
// renderiza formulario input area de sugestoes e botoes de controle
// todo codigo abaixo mantem a logica original so adiciona explicacoes
class SearchOverlay extends HTMLElement {
  constructor() {
    super();
    // construtor simples sem estado inicial complexo
  }

  // metodo chamado quando o elemento e inserido no dom
  // aqui fazemos a renderizacao inicial do html do componente
  connectedCallback() {
    // evitamos renderizar mais de uma vez se o elemento for reusado
    if (this.dataset.rendered === 'true') return;
    this.dataset.rendered = 'true';

    // inserimos o html do overlay diretamente em innerhtml
    // a estrutura contem backdrop painel de busca formulario input e area de sugestoes
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

    // apos renderizar conectamos os listeners para interacao
    this._bindEvents();
  }

  // conecta os eventos usados pelo componente
  _bindEvents() {
    // delegacao de clique no documento
    // elementos com data open search abrem o overlay
    // elementos com data overlay close fecham o overlay
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-open-search]')) this._open();
      if (t.closest('[data-overlay-close]')) this._close();
    });

    // fecha o overlay ao pressionar escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });

    // elementos internos do componente que vamos usar
    const form = this.querySelector('[data-search-form]');
    const input = this.querySelector('#search-input');
    const clearBtn = this.querySelector('[data-search-clear]');
    const suggestionsBox = this.querySelector('[data-search-suggestions]');

    // funcao que mostra ou esconde o botao limpar conforme o input
    const toggleClearBtn = () => {
      const hasValue = input.value.trim().length > 0;
      clearBtn.hidden = !hasValue;
    };

    // quando o usuario digita no input
    // buscamos no catalogo e atualizamos a caixa de sugestoes
    input?.addEventListener('input', () => {
      const term = input.value.trim();
      toggleClearBtn();

      // se nao houver termo limpamos as sugestoes
      if (term.length < 1) {
        suggestionsBox.innerHTML = '';
        suggestionsBox.classList.remove('is-visible');
        return;
      }

      // realiza a busca em todo o catalogo
      const results = this._searchAll(term);
      if (results.length === 0) {
        // se nao encontrar mostramos mensagem simples
        suggestionsBox.innerHTML = '<p class="search-no-results">Nenhum produto encontrado</p>';
        suggestionsBox.classList.add('is-visible');
        return;
      }

      // uso de formatprice para formatacao local moeda e evitar inconsistencias
      // montamos o html das sugestoes a partir dos resultados
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

    // clique no botao limpar reseta o input e oculta sugestoes
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      input.focus();
      toggleClearBtn();
      suggestionsBox.innerHTML = '';
      suggestionsBox.classList.remove('is-visible');
    });

    // submit do formulario redireciona para a pagina de categoria com query
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const termo = input?.value.trim();
      if (termo) {
        // encodeURIComponent evita problemas com caracteres especiais na url
        window.location.href = `categoria.html?tipo=busca&q=${encodeURIComponent(termo)}`;
        this._close();
      }
    });
  }

  // busca simples em todo o catalogo por titulo ignorando caixa
  // retorna ate 8 resultados unicos
  _searchAll(term) {
    const results = [];
    const lower = term.toLowerCase();
    const seen = new Set();

    // percorre cada secao do catalogo e suas products quando existirem
    for (const [sectionKey, section] of Object.entries(catalog)) {
      if (!section.products) continue;
      section.products.forEach((p, i) => {
        // makeproductid gera um id consistente para o produto
        const id = makeProductId(sectionKey, p.title, i);
        // verifica se o titulo contem o termo e evita duplicatas
        if (!seen.has(id) && p.title.toLowerCase().includes(lower)) {
          seen.add(id);
          results.push({ ...p, id });
        }
      });
    }

    // limitamos o numero de sugestoes para nao poluir a interface
    return results.slice(0, 8);
  }

  // abre o overlay e prepara o input para digitar
  _open() {
    const overlay = this.querySelector('.search-overlay');
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    // evita scroll da pagina enquanto o overlay estiver aberto
    document.body.classList.add('no-scroll');
    const input = this.querySelector('#search-input');
    if (input) {
      input.value = '';
      this.querySelector('[data-search-clear]').hidden = true;
      const box = this.querySelector('[data-search-suggestions]');
      if (box) box.classList.remove('is-visible');
      // pequeno atraso para garantir visibilidade antes de focar
      setTimeout(() => input.focus(), 100);
    }
  }

  // fecha o overlay e limpa sugestoes
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

// registra o elemento customizado para uso no html
customElements.define('search-overlay', SearchOverlay);
