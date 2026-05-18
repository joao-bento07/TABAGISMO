import { db, isConfigured } from './firebase.js';
import { getUser, getInitials } from './auth.js';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

const CATS = [
  { id: 'geral',       label: 'Geral',        icon: '💬' },
  { id: 'conquista',   label: 'Conquistas',   icon: '🏆' },
  { id: 'dificuldade', label: 'Dificuldades', icon: '😓' },
  { id: 'dica',        label: 'Dicas',        icon: '💡' },
  { id: 'motivacao',   label: 'Motivação',    icon: '💪' },
];

let activeCat   = 'todos';
let unsubscribe = null;
let posts       = [];

function getDaysSmokeFree() {
  try {
    const data = JSON.parse(localStorage.getItem('smokeCounter') || '{}');
    if (!data.quitDate) return null;
    const ms = Date.now() - new Date(data.quitDate).getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  } catch { return null; }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(ts) {
  if (!ts) return '';
  const d    = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)    return 'agora mesmo';
  if (diff < 3600)  return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString('pt-BR');
}

function render() {
  const list = document.getElementById('posts-list');
  if (!list) return;
  const filtered = activeCat === 'todos' ? posts : posts.filter(p => p.cat === activeCat);
  const user     = getUser();

  if (filtered.length === 0) {
    list.innerHTML = `<p class="posts-empty">Nenhuma publicação aqui ainda. Seja o primeiro!</p>`;
    return;
  }

  list.innerHTML = filtered.map(p => {
    const liked    = user && Array.isArray(p.likedBy) && p.likedBy.includes(user.uid);
    const cat      = CATS.find(c => c.id === p.cat) || CATS[0];
    const days     = p.daysSmokeFree;
    const daysBadge = (days !== null && days !== undefined)
      ? `<span class="post-days-badge">🚭 ${days}d sem fumar</span>` : '';

    return `
      <article class="post-card" data-id="${p.id}">
        <div class="post-top">
          <div class="post-avatar">${escHtml(p.authorInitials || '?')}</div>
          <div class="post-meta">
            <span class="post-author">${escHtml(p.authorName || 'Anônimo')}</span>
            ${daysBadge}
            <span class="post-time">${formatTime(p.createdAt)}</span>
          </div>
          <span class="post-cat-badge">${cat.icon} ${cat.label}</span>
        </div>
        <p class="post-text">${escHtml(p.text)}</p>
        <div class="post-actions">
          <button class="like-btn ${liked ? 'liked' : ''}" data-id="${p.id}" aria-label="Curtir">
            <span class="like-icon">${liked ? '❤️' : '🤍'}</span>
            <span class="like-count">${p.likesCount || 0}</span>
          </button>
        </div>
      </article>`;
  }).join('');

  list.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleLike(btn.dataset.id));
  });
}

async function toggleLike(postId) {
  const user = getUser();
  if (!user) { document.getElementById('nav-login-btn')?.click(); return; }
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const liked = Array.isArray(post.likedBy) && post.likedBy.includes(user.uid);
  await updateDoc(doc(db, 'posts', postId), {
    likedBy:    liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    likesCount: increment(liked ? -1 : 1),
  });
}

function subscribe() {
  if (unsubscribe) unsubscribe();
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  unsubscribe = onSnapshot(q, snap => {
    posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    render();
  });
}

function buildComposer() {
  const user     = getUser();
  const composer = document.getElementById('post-composer');
  if (!composer) return;

  if (!user) {
    composer.innerHTML = `
      <div class="forum-gate">
        <p>Para publicar na comunidade, você precisa entrar com sua conta.</p>
        <button class="btn btn-primary" id="gate-login-btn">Entrar ou criar conta</button>
      </div>`;
    document.getElementById('gate-login-btn')?.addEventListener('click', () => {
      document.getElementById('nav-login-btn')?.click();
    });
    return;
  }

  const catOptions = CATS.map(c =>
    `<button type="button" class="cat-btn" data-cat="${c.id}">${c.icon} ${c.label}</button>`
  ).join('');

  composer.innerHTML = `
    <form id="post-form" class="post-form" novalidate>
      <div class="composer-top">
        <div class="post-avatar composer-avatar">${escHtml(getInitials(user))}</div>
        <textarea id="post-text" placeholder="Compartilhe uma conquista, dificuldade ou dica..." rows="3" maxlength="500" required></textarea>
      </div>
      <div class="composer-bottom">
        <div class="cat-row" role="group" aria-label="Categoria">
          ${catOptions}
        </div>
        <button type="submit" class="btn btn-primary btn-sm" id="post-submit">Publicar</button>
      </div>
      <p class="post-error hidden" id="post-error" role="alert"></p>
    </form>`;

  let selectedCat = 'geral';
  const catBtns   = composer.querySelectorAll('.cat-btn');
  catBtns[0]?.classList.add('active');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCat = btn.dataset.cat;
      catBtns.forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  composer.querySelector('#post-form').addEventListener('submit', async e => {
    e.preventDefault();
    const text   = document.getElementById('post-text').value.trim();
    const errEl  = document.getElementById('post-error');
    const submit = document.getElementById('post-submit');
    errEl.classList.add('hidden');
    if (!text) {
      errEl.textContent = 'Escreva algo antes de publicar.';
      errEl.classList.remove('hidden');
      return;
    }
    submit.disabled    = true;
    submit.textContent = 'Publicando...';
    try {
      await addDoc(collection(db, 'posts'), {
        authorId:       user.uid,
        authorName:     user.displayName || user.email,
        authorInitials: getInitials(user),
        cat:            selectedCat,
        text,
        likesCount:     0,
        likedBy:        [],
        daysSmokeFree:  getDaysSmokeFree(),
        createdAt:      serverTimestamp(),
      });
      document.getElementById('post-text').value = '';
    } catch {
      errEl.textContent = 'Não foi possível publicar. Tente novamente.';
      errEl.classList.remove('hidden');
    } finally {
      submit.disabled    = false;
      submit.textContent = 'Publicar';
    }
  });
}

function buildFilterBar() {
  const bar = document.getElementById('filter-bar');
  if (!bar) return;
  bar.innerHTML = `
    <button class="filter-btn active" data-cat="todos">Todos</button>
    ${CATS.map(c =>
      `<button class="filter-btn" data-cat="${c.id}">${c.icon} ${c.label}</button>`
    ).join('')}`;
  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      render();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!isConfigured) {
    const section = document.getElementById('comunidade');
    if (section) {
      section.querySelector('.community-inner')?.remove();
      const msg = document.createElement('div');
      msg.className = 'config-notice container';
      msg.innerHTML = `<p>A comunidade requer configuração do Firebase. Consulte o <code>.env.example</code> para começar.</p>`;
      section.appendChild(msg);
    }
    return;
  }

  buildFilterBar();
  buildComposer();
  subscribe();

  document.addEventListener('auth:changed', () => {
    buildComposer();
    render();
  });
});
