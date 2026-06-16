class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === 'true') return;
    this.dataset.rendered = 'true';

    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-shell">
          <nav class="footer-links" aria-label="Links institucionais">
            <a href="#">Sobre nós</a>
            <a href="#">Trocas e devoluções</a>
            <a href="#">Política de privacidade</a>
          </nav>
          <div class="footer-info">
            <div class="social-links">
              <a href="#">Instagram</a>
              <a href="#">Youtube</a>
              <a href="#">TikTok</a>
              <a href="#">GitHub</a>
            </div>
            <div class="contact-grid">
              <p><strong>Contato</strong><br>+55 (47) 9 9940-8295</p>
              <p><strong>E-Mail</strong><br>davimbisewski@gmail.com</p>
              <p><strong>Endereço</strong><br>Rua São Paulo - Floresta - Joinville - SC</p>
            </div>
          </div>
        </div>
        <p class="copyright">Copyright Bensa StreetWear - 48302750327 - 2026. Todos os direitos reservados</p>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);