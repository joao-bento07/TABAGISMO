/* ============================================================
   CALCULATOR.JS — linha do tempo de recuperação da saúde
   ============================================================ */

const MILESTONES = [
  { ms: 20 * 60e3,          time: '20 min',   icon: '❤️',  title: 'Pressão normalizada',       desc: 'Pressão arterial e frequência cardíaca voltam aos níveis normais. Seu coração já respira aliviado.' },
  { ms: 8  * 3600e3,        time: '8 horas',  icon: '🫁',  title: 'Menos CO no sangue',         desc: 'O nível de monóxido de carbono cai pela metade. Mais oxigênio chegando a cada célula do corpo.' },
  { ms: 24 * 3600e3,        time: '1 dia',    icon: '💓',  title: 'Risco de infarto cai',       desc: 'Com apenas um dia, o risco de infarto já começou a diminuir. O coração sente a diferença rápido.' },
  { ms: 48 * 3600e3,        time: '2 dias',   icon: '👃',  title: 'Paladar e olfato voltam',    desc: 'As terminações nervosas começam a se recuperar. Comida vai ter um gosto completamente diferente.' },
  { ms: 72 * 3600e3,        time: '3 dias',   icon: '💨',  title: 'Brônquios relaxam',          desc: 'Os brônquios param de contrair. Respirar fundo fica mais fácil — você já vai sentir a diferença.' },
  { ms: 14 * 86400e3,       time: '2 sem',    icon: '🩸',  title: 'Circulação melhora',         desc: 'A circulação sanguínea melhora bastante. Subir escadas, caminhar rápido — tudo vai ficando mais leve.' },
  { ms: 30 * 86400e3,       time: '1 mês',    icon: '🌿',  title: 'Tosse diminui',              desc: 'A tosse de fumante começa a desaparecer. Os cílios do pulmão se recuperam e o muco vai embora.' },
  { ms: 90 * 86400e3,       time: '3 meses',  icon: '🫀',  title: '+30% capacidade pulmonar',   desc: 'Função pulmonar aumentou em até 30%. Exercício físico virou outra coisa — você vai sentir no fôlego.' },
  { ms: 270 * 86400e3,      time: '9 meses',  icon: '🌱',  title: 'Pulmões renovados',          desc: 'Cílios completamente recuperados. Infecções respiratórias ficam cada vez mais raras.' },
  { ms: 365 * 86400e3,      time: '1 ano',    icon: '🏆',  title: 'Risco cardíaco na metade',   desc: 'O risco de doença coronariana caiu pela metade comparado a quando você fumava. Um ano que valeu.' },
  { ms: 5 * 365 * 86400e3,  time: '5 anos',   icon: '🧠',  title: 'AVC como não-fumante',       desc: 'Risco de acidente vascular cerebral (AVC) é agora igual ao de quem nunca fumou.' },
  { ms: 10 * 365 * 86400e3, time: '10 anos',  icon: '🎗️', title: 'Câncer de pulmão: ‑50%',    desc: 'O risco de câncer de pulmão caiu à metade. Seu organismo deu uma volta por cima incrível.' },
  { ms: 15 * 365 * 86400e3, time: '15 anos',  icon: '⭐',  title: 'Como quem nunca fumou',      desc: 'Risco de doença cardíaca igual ao de uma pessoa que nunca fumou. Liberdade de verdade.' },
];

function getElapsed() {
  try {
    const data = JSON.parse(localStorage.getItem('smokeCounter') || '{}');
    if (!data.quitDate) return 0;
    return Math.max(0, Date.now() - new Date(data.quitDate).getTime());
  } catch { return 0; }
}

function renderTimeline() {
  const container = document.getElementById('health-timeline');
  if (!container) return;

  const elapsed = getElapsed();
  const maxMs   = MILESTONES[MILESTONES.length - 1].ms;
  const pct     = Math.min(100, (elapsed / maxMs) * 100);
  const hasQuit = elapsed > 0;

  let html = `
    <div class="timeline-intro reveal">
      <h3>Linha do tempo de recuperação</h3>
      <p>O seu corpo começa a se curar nos primeiros 20 minutos após o último cigarro — e não para mais. Cada marco abaixo é real e cientificamente comprovado.</p>
    </div>`;

  if (hasQuit) {
    html += `
    <div class="timeline-progress-bar reveal reveal-delay-1">
      <div class="timeline-progress-fill" style="width: ${pct.toFixed(1)}%"></div>
    </div>
    <p class="timeline-progress-label" style="font-size:.85rem;color:var(--text-muted);margin-bottom:2rem;text-align:center">
      Progresso rumo aos 15 anos: <strong style="color:var(--primary)">${pct.toFixed(1)}%</strong>
    </p>`;
  } else {
    html += `
    <div class="no-counter-msg reveal reveal-delay-1">
      <p>Configure seu contador de tempo para ver seu progresso pessoal nesta linha do tempo.</p>
      <button class="btn btn-primary" onclick="document.querySelector('[data-tool=contador]').click()">Configurar contador →</button>
    </div>`;
  }

  html += `<div class="milestones-grid">`;

  MILESTONES.forEach((m, i) => {
    const reached = elapsed >= m.ms;
    const cls     = reached ? 'reached' : 'locked';
    html += `
      <div class="milestone-card ${cls} reveal reveal-delay-${(i % 3) + 1}" data-index="${i}">
        <div class="milestone-time">${m.time}</div>
        <div class="milestone-icon">${m.icon}</div>
        <h4>${m.title}</h4>
        <p>${m.desc}</p>
      </div>`;
  });

  html += `</div>`;
  container.innerHTML = html;

  container.querySelectorAll('.reveal').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', renderTimeline);
