class SiteHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const inPages = window.location.pathname.includes("/pages/");
    const assetsPrefix = inPages ? "../" : "";
    const homeHref = inPages ? "../index.html" : "index.html";
  
    // Verificar se usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const userLink = isLoggedIn && user.email 
      ? `<a class="icon-button" href="/pages/perfil.html" aria-label="Meu perfil" title="Perfil">
           <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>
         </a>`
      : `<a class="icon-button" href="login.html" aria-label="Entrar na conta">
           <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>
         </a>`;

    this.innerHTML = `
      <header class="site-header" data-header>
        <nav class="nav-shell" aria-label="Navegação principal">
          <div class="nav-links">
            <a href="/pages/categoria.html?tipo=roupas">Roupas</a>
            <a href="/pages/categoria.html?tipo=calcados">Calçados</a>
            <a href="/pages/categoria.html?tipo=acessorios">Acessórios</a>
          </div>

          <a class="brand" href="${homeHref}" aria-label="Página inicial Bensa StreetWear">
            <img src="${assetsPrefix}images/logo-bensa.svg" alt="Bensa StreetWear">
          </a>

          <div class="nav-actions">
            <a class="community-link" href="#" aria-label="Acessar comunidade Bensa">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.5 2.7 3.7 6 3.7 10S14.5 19.3 12 22M12 2C9.5 4.7 8.3 8 8.3 12S9.5 19.3 12 22M3 12h18M4.8 7h14.4M4.8 17h14.4"/></svg>
              <span>Comunidade</span>
            </a>
            <button class="icon-button" type="button" data-open-search aria-label="Pesquisar">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"/></svg>
            </button>
            ${userLink}
            <button class="icon-button" type="button" data-open-cart aria-label="Abrir carrinho">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 7h12l1 14H5L6 7ZM9 7a3 3 0 0 1 6 0"/></svg>
            </button>
          </div>
        </nav>
      </header>
    `;
  }
}

customElements.define("site-header", SiteHeader);
