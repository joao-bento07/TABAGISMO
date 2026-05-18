import { auth, isConfigured } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

let currentUser = null;

export function getUser()           { return currentUser; }
export function getInitials(user) {
  if (!user) return '';
  const name = user.displayName || user.email || '';
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function dispatch(user) {
  document.dispatchEvent(new CustomEvent('auth:changed', { detail: user }));
}

function buildModal() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="auth-overlay" class="auth-overlay hidden" role="dialog" aria-modal="true" aria-label="Entrar ou criar conta">
      <div class="auth-modal">
        <button class="auth-close" id="auth-close" aria-label="Fechar">✕</button>
        <div class="auth-header">
          <h2>Entrar na comunidade</h2>
          <p>Crie sua conta para participar do fórum e acompanhar seu progresso.</p>
        </div>
        <div class="auth-tabs" role="tablist">
          <button class="auth-tab active" data-tab="login"    role="tab" aria-selected="true">Entrar</button>
          <button class="auth-tab"        data-tab="register" role="tab" aria-selected="false">Criar conta</button>
        </div>
        <form class="auth-form" id="auth-login-form" novalidate>
          <div class="auth-field">
            <label for="auth-email">E-mail</label>
            <input type="email" id="auth-email" autocomplete="email" placeholder="seu@email.com" required>
          </div>
          <div class="auth-field">
            <label for="auth-password">Senha</label>
            <input type="password" id="auth-password" autocomplete="current-password" placeholder="••••••••" required>
          </div>
          <p class="auth-error hidden" id="auth-login-error" role="alert"></p>
          <button type="submit" class="btn btn-primary btn-full">Entrar</button>
        </form>
        <form class="auth-form hidden" id="auth-register-form" novalidate>
          <div class="auth-field">
            <label for="reg-name">Seu nome</label>
            <input type="text" id="reg-name" autocomplete="name" placeholder="Como você quer ser chamado" required>
          </div>
          <div class="auth-field">
            <label for="reg-email">E-mail</label>
            <input type="email" id="reg-email" autocomplete="email" placeholder="seu@email.com" required>
          </div>
          <div class="auth-field">
            <label for="reg-password">Senha</label>
            <input type="password" id="reg-password" autocomplete="new-password" placeholder="Mínimo 6 caracteres" required minlength="6">
          </div>
          <p class="auth-error hidden" id="auth-reg-error" role="alert"></p>
          <button type="submit" class="btn btn-primary btn-full">Criar conta</button>
        </form>
      </div>
    </div>`;
  document.body.appendChild(wrap.firstElementChild);
}

function updateNav(user) {
  const loginBtn   = document.getElementById('nav-login-btn');
  const navUser    = document.getElementById('nav-user');
  const navInitials = document.getElementById('nav-initials');
  if (!loginBtn || !navUser) return;
  if (user) {
    loginBtn.classList.add('hidden');
    navUser.classList.remove('hidden');
    if (navInitials) navInitials.textContent = getInitials(user);
  } else {
    loginBtn.classList.remove('hidden');
    navUser.classList.add('hidden');
  }
}

function openModal() {
  document.getElementById('auth-overlay')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('auth-overlay')?.classList.add('hidden');
  document.body.style.overflow = '';
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function bindModal() {
  document.getElementById('auth-close').addEventListener('click', closeModal);
  document.getElementById('auth-overlay').addEventListener('click', e => {
    if (e.target.id === 'auth-overlay') closeModal();
  });
  document.addEventListener('keydown', e => {
    const overlay = document.getElementById('auth-overlay');
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) closeModal();
  });

  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      const isLogin = btn.dataset.tab === 'login';
      document.getElementById('auth-login-form').classList.toggle('hidden', !isLogin);
      document.getElementById('auth-register-form').classList.toggle('hidden', isLogin);
    });
  });

  document.getElementById('auth-login-form').addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('auth-login-error').classList.add('hidden');
    const email    = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (err) {
      showError('auth-login-error', friendlyError(err.code));
    }
  });

  document.getElementById('auth-register-form').addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('auth-reg-error').classList.add('hidden');
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    if (!name) { showError('auth-reg-error', 'Informe seu nome.'); return; }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      closeModal();
    } catch (err) {
      showError('auth-reg-error', friendlyError(err.code));
    }
  });

  document.getElementById('nav-login-btn')?.addEventListener('click', openModal);
  document.getElementById('nav-signout')?.addEventListener('click', () => signOut(auth));
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':       'E-mail não encontrado. Verifique ou crie uma conta.',
    'auth/wrong-password':       'Senha incorreta. Tente novamente.',
    'auth/email-already-in-use': 'Esse e-mail já está em uso.',
    'auth/invalid-email':        'E-mail inválido.',
    'auth/weak-password':        'A senha precisa ter pelo menos 6 caracteres.',
    'auth/too-many-requests':    'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/invalid-credential':   'E-mail ou senha incorretos.',
  };
  return map[code] || 'Algo deu errado. Tente novamente.';
}

document.addEventListener('DOMContentLoaded', () => {
  if (!isConfigured) return;
  buildModal();
  bindModal();
  onAuthStateChanged(auth, user => {
    currentUser = user;
    updateNav(user);
    dispatch(user);
  });
});
