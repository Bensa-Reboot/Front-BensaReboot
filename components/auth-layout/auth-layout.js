class AuthLayout extends HTMLElement {
  connectedCallback() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      // BUG 8 CORRIGIDO: respeitar ?redirect=checkout ao já estar logado
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect === 'checkout' ? 'checkout.html' : 'index.html';
      return;
    }

    if (this.dataset.rendered === 'true') return;
    this.dataset.rendered = 'true';

    const variant = this.getAttribute('variant') || 'login';
    variant === 'register' ? this._renderRegister() : this._renderLogin();
  }

  _setError(el, msg) {
    if (!el) return false;
    el.textContent = msg || '';
    el.classList.toggle('is-visible', Boolean(msg));
    el.style.display = msg ? 'block' : '';
    return Boolean(msg);
  }

  _clearErrors(form) {
    form.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.classList.remove('is-visible');
      el.style.display = '';
    });
  }

  _scrollToFirstError(form) {
    const first = form.querySelector('.error-message.is-visible');
    if (!first) return;
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ─── REGISTER ───────────────────────────────────────────────
  _renderRegister() {
    this.innerHTML = `
      <main class="auth-screen">
        <section class="auth-card auth-register" aria-labelledby="register-title">
          <aside class="auth-photo auth-photo-register">
            <img src="../images/auth-register-panel.png" alt="Modelo usando camiseta preta em fundo vermelho">
            <p>Conecte-se com a essência da rua.<br>Cadastre-se e vista a atitude.</p>
          </aside>
          <form class="auth-form" data-register-form novalidate>
            <img class="auth-logo" src="../images/logo-bensa.svg" alt="Bensa StreetWear">
            <h1 class="sr-only" id="register-title">Cadastro</h1>
            <p>Cadastre-se agora e aproveite</p>
            <label for="register-name">Nome completo</label>
            <input id="register-name" name="name" type="text" placeholder="Seu nome completo" required>
            <p class="error-message" data-error="name"></p>
            <label for="register-email">E-mail</label>
            <input id="register-email" name="email" type="email" placeholder="Digite seu e-mail" required>
            <p class="error-message" data-error="email"></p>

            <label for="register-password">Senha</label>
            <input id="register-password" name="password" type="password" placeholder="Digite sua senha" required>
            <p class="error-message" data-error="password"></p>

            <label for="register-password-confirm">Confirmar Senha</label>
            <input id="register-password-confirm" name="password-confirm" type="password" placeholder="Digite sua senha novamente" required>
            <p class="error-message" data-error="password-confirm"></p>

            <label for="register-cep">CEP</label>
            <div class="cep-input-group">
              <input id="register-cep" name="cep" type="text" placeholder="00000-000" maxlength="9" data-cep-input required>
              <button type="button" data-cep-search aria-label="Buscar CEP">Buscar</button>
            </div>
            <p class="error-message" data-error="cep"></p>

            <label for="register-address">Endereço</label>
            <input id="register-address" name="address" type="text" placeholder="Rua, Avenida..." readonly>

            <label for="register-neighborhood">Bairro</label>
            <input id="register-neighborhood" name="neighborhood" type="text" placeholder="Bairro" readonly>

            <div class="address-row">
              <div>
                <label for="register-city">Cidade</label>
                <input id="register-city" name="city" type="text" placeholder="Cidade" readonly>
              </div>
              <div>
                <label for="register-state">Estado</label>
                <input id="register-state" name="state" type="text" placeholder="UF" readonly maxlength="2">
              </div>
            </div>

            <p class="error-message" data-error="general"></p>

            <button class="auth-submit" type="submit">Cadastre-se</button>
            <p class="auth-switch">Já tem uma conta? <a href="login.html">Entrar</a></p>
          </form>
        </section>
      </main>
    `;

    this._bindCep();
    this._bindRegisterSubmit();
  }

  _bindCep() {
    const form = this.querySelector('[data-register-form]');
    const input = this.querySelector('[data-cep-input]');
    const button = this.querySelector('[data-cep-search]');

    input?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
      e.target.value = v;
    });

    const buscar = async () => {
      const cepEl = form?.querySelector('[data-error="cep"]');
      if (cepEl) { cepEl.textContent = ''; cepEl.classList.remove('is-visible'); }

      const cep = input?.value.replace(/\D/g, '');
      if (!cep || cep.length !== 8) {
        this._setError(cepEl, 'Digite um CEP válido com 8 dígitos (00000-000).');
        return;
      }

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) { this._setError(cepEl, 'CEP não encontrado.'); return; }

        form.querySelector('[name="address"]').value = data.logradouro || '';
        form.querySelector('[name="neighborhood"]').value = data.bairro || '';
        form.querySelector('[name="city"]').value = data.localidade || '';
        form.querySelector('[name="state"]').value = data.uf || '';
      } catch {
        this._setError(form?.querySelector('[data-error="cep"]'), 'Erro ao buscar CEP. Tente novamente.');
      }
    };

    button?.addEventListener('click', buscar);
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscar(); });
  }

  _bindRegisterSubmit() {
    const form = this.querySelector('[data-register-form]');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this._clearErrors(form);

      const val = (name) => form.querySelector(`input[name="${name}"]`)?.value.trim() ?? '';
      const err = (key) => form.querySelector(`[data-error="${key}"]`);
      let hasError = false;

      const name = val('name');
      if (!name) { this._setError(err('name'), 'Nome é obrigatório.'); hasError = true; }

      const email = val('email');
      const password = form.querySelector('input[name="password"]')?.value ?? '';
      const confirm = form.querySelector('input[name="password-confirm"]')?.value ?? '';
      const cep = val('cep');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this._setError(err('email'), 'E-mail é obrigatório.'); hasError = true;
      } else if (!emailRegex.test(email)) {
        this._setError(err('email'), 'E-mail inválido. Use o formato nome@email.com.'); hasError = true;
      }

      if (!password) {
        this._setError(err('password'), 'Senha é obrigatória.'); hasError = true;
      } else if (password.length < 6) {
        this._setError(err('password'), 'Senha deve ter no mínimo 6 caracteres.'); hasError = true;
      }

      if (!confirm) {
        this._setError(err('password-confirm'), 'Confirme sua senha.'); hasError = true;
      } else if (password !== confirm) {
        this._setError(err('password-confirm'), 'As senhas devem ser iguais.'); hasError = true;
      }

      const cepDigits = cep.replace(/\D/g, '');
      if (!cep) {
        this._setError(err('cep'), 'CEP é obrigatório.'); hasError = true;
      } else if (cepDigits.length !== 8) {
        this._setError(err('cep'), 'CEP deve ter 8 dígitos (00000-000).'); hasError = true;
      }

      if (hasError) { this._scrollToFirstError(form); return; }

      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (users.some(u => u.email === email)) {
        this._setError(err('general'), 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
        this._scrollToFirstError(form);
        return;
      }

      const user = {
        name,
        email,
        password,
        cep,
        address:      val('address'),
        neighborhood: val('neighborhood'),
        city:         val('city'),
        state:        val('state'),
        createdAt:    new Date().toISOString(),
        favorites:    [],
        orders:       [],
      };

      users.push(user);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'index.html';
    });
  }

  // ─── LOGIN ───────────────────────────────────────────────────
  _renderLogin() {
    this.innerHTML = `
      <main class="auth-screen">
        <section class="auth-card auth-login" aria-labelledby="login-title">
          <form class="auth-form" data-login-form novalidate>
            <img class="auth-logo" src="../images/logo-bensa.svg" alt="Bensa StreetWear">
            <h1 id="login-title">Bem-vindo</h1>
            <p>Entre agora e aproveite as melhores peças</p>

            <label for="login-email">E-mail</label>
            <input id="login-email" name="email" type="email" placeholder="Digite seu e-mail" required>
            <p class="error-message" data-error="email"></p>

            <label for="login-password">Senha</label>
            <input id="login-password" name="password" type="password" placeholder="Digite sua senha" required>
            <p class="error-message" data-error="password"></p>

            <p class="error-message" data-error="general"></p>

            <a class="auth-side-link" href="#">Esqueceu sua senha?</a>
            <button class="auth-submit" type="submit">Entrar</button>
            <p class="auth-switch">Não tem uma conta? <a href="cadastro.html">Cadastre-se</a></p>
          </form>
          <aside class="auth-photo auth-photo-login">
            <img src="../images/auth-login-panel.png" alt="Modelo usando camiseta preta em fundo vermelho">
            <p>Conecte-se com a essência da rua.<br>Acesse sua conta e vista a atitude.</p>
          </aside>
        </section>
      </main>
    `;

    this._bindLoginSubmit();
  }

  _bindLoginSubmit() {
    const form = this.querySelector('[data-login-form]');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this._clearErrors(form);

      const email    = form.querySelector('input[name="email"]')?.value.trim() ?? '';
      const password = form.querySelector('input[name="password"]')?.value ?? '';
      const err      = (key) => form.querySelector(`[data-error="${key}"]`);
      let hasError   = false;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this._setError(err('email'), 'E-mail é obrigatório.'); hasError = true;
      } else if (!emailRegex.test(email)) {
        this._setError(err('email'), 'E-mail inválido.'); hasError = true;
      }

      if (!password) {
        this._setError(err('password'), 'Senha é obrigatória.'); hasError = true;
      }

      if (hasError) { this._scrollToFirstError(form); return; }

      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user  = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        // BUG 8 CORRIGIDO: respeitar ?redirect=checkout após login
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect === 'checkout' ? 'checkout.html' : 'index.html';
      } else {
        this._setError(err('general'), 'E-mail ou senha incorretos.');
        this._scrollToFirstError(form);
      }
    });
  }
}

customElements.define('auth-layout', AuthLayout);
