/* ============================================================
   SOS.JS — Botão flutuante + modal de exercícios de respiração
   ============================================================ */

const EXERCISES = [
  {
    name: 'Respiração em Caixa',
    desc: 'Técnica usada por militares e atletas de elite para controlar o estresse em segundos.',
    cycles: 4,
    steps: [
      { label: 'Inspire',        phase: 'expand',    dur: 4 },
      { label: 'Segure',         phase: 'hold-big',  dur: 4 },
      { label: 'Expire devagar', phase: 'contract',  dur: 4 },
      { label: 'Segure',         phase: 'hold-sml',  dur: 4 },
    ],
  },
  {
    name: 'Técnica 4-7-8',
    desc: 'Ativa o freio do sistema nervoso parassimpático. Reduz a fissura e a ansiedade rapidamente.',
    cycles: 3,
    steps: [
      { label: 'Inspire pelo nariz', phase: 'expand',    dur: 4 },
      { label: 'Segure o ar',        phase: 'hold-big',  dur: 7 },
      { label: 'Expire pela boca',   phase: 'contract',  dur: 8 },
    ],
  },
  {
    name: 'Respiração 5-3-5',
    desc: 'Suave e eficaz. Ideal quando a fissura chega de repente e você precisa de algo imediato.',
    cycles: 5,
    steps: [
      { label: 'Inspire lentamente', phase: 'expand',    dur: 5 },
      { label: 'Segure',             phase: 'hold-big',  dur: 3 },
      { label: 'Expire devagar',     phase: 'contract',  dur: 5 },
    ],
  },
];

const QUOTES = [
  'Você já passou por isso antes — e passou.',
  'A fissura dura no máximo 20 minutos. Você é mais forte que ela.',
  'Cada vez que você resiste, fica um pouco mais fácil na próxima.',
  'Respira. Seu corpo está se curando agora mesmo.',
  'Você não quer o cigarro — quer alívio. A respiração te dá esse alívio.',
  'Pense em alguém que vai se orgulhar de você daqui a pouco.',
  'Você foi longe demais para desistir agora.',
  'Esse momento vai passar. Você vai ficar.',
  'Uma fissura não é uma recaída. Você tem o controle.',
  'Sente o ar entrando. Sente o ar saindo. Você está bem.',
];

class SOSModal {
  constructor() {
    this.exIdx      = 0;
    this.stepIdx    = 0;
    this.cycleIdx   = 0;
    this.stepTimer  = null;
    this.tickTimer  = null;
    this.running    = false;
    this.quoteIdx   = 0;
    this._build();
    this._bind();
  }

  _build() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="sos-overlay" class="sos-overlay hidden" role="dialog" aria-modal="true" aria-label="Exercício de respiração">
        <div class="sos-modal">
          <button class="sos-close" id="sos-close" aria-label="Fechar">✕</button>

          <div class="sos-header">
            <p class="sos-eyebrow">Respira comigo</p>
            <h2>Você está no controle.</h2>
            <p class="sos-lead">Siga o ritmo do círculo. A fissura vai passar.</p>
          </div>

          <div class="sos-tabs" role="tablist">
            ${EXERCISES.map((ex, i) => `
              <button class="sos-tab ${i === 0 ? 'active' : ''}" data-idx="${i}"
                      role="tab" aria-selected="${i === 0}">${ex.name}</button>
            `).join('')}
          </div>

          <p class="sos-ex-desc" id="sos-ex-desc"></p>

          <div class="sos-breath-wrap">
            <div class="sos-ring" aria-hidden="true"></div>
            <div class="sos-circle idle" id="sos-circle">
              <span class="sos-step-label" id="sos-step-label">Pronto?</span>
              <span class="sos-countdown"  id="sos-countdown"></span>
            </div>
          </div>

          <p class="sos-cycle-info" id="sos-cycle-info"></p>

          <div class="sos-actions">
            <button class="btn btn-primary btn-full" id="sos-start">Iniciar respiração</button>
            <button class="btn btn-outline  btn-full hidden" id="sos-stop">Pausar</button>
          </div>

          <div class="sos-quote-box">
            <blockquote id="sos-quote"></blockquote>
            <button class="sos-quote-next" id="sos-quote-next" title="Outra mensagem" aria-label="Próxima mensagem">↻</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
  }

  _bind() {
    document.getElementById('sos-close').addEventListener('click', () => this.close());
    document.getElementById('sos-start').addEventListener('click', () => this.start());
    document.getElementById('sos-stop').addEventListener('click',  () => this.stop());
    document.getElementById('sos-quote-next').addEventListener('click', () => this._nextQuote());
    document.getElementById('sos-overlay').addEventListener('click', e => {
      if (e.target.id === 'sos-overlay') this.close();
    });
    document.querySelectorAll('.sos-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.stop();
        this.exIdx = +btn.dataset.idx;
        document.querySelectorAll('.sos-tab').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn);
        });
        this._reset();
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.getElementById('sos-overlay').classList.contains('hidden')) {
        this.close();
      }
    });
  }

  open() {
    this._reset();
    this._showQuote();
    document.getElementById('sos-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('sos-start').focus();
  }

  close() {
    this.stop();
    document.getElementById('sos-overlay').classList.add('hidden');
    document.body.style.overflow = '';
  }

  _reset() {
    clearTimeout(this.stepTimer);
    clearInterval(this.tickTimer);
    this.running = false;
    const ex = EXERCISES[this.exIdx];
    const totalSec = ex.steps.reduce((a, s) => a + s.dur, 0);
    document.getElementById('sos-ex-desc').textContent    = ex.desc;
    document.getElementById('sos-cycle-info').textContent = `${ex.cycles} ciclos · ${totalSec}s por ciclo`;
    document.getElementById('sos-step-label').textContent = 'Pronto?';
    document.getElementById('sos-countdown').textContent  = '';
    document.getElementById('sos-start').textContent      = 'Iniciar respiração';
    document.getElementById('sos-start').classList.remove('hidden');
    document.getElementById('sos-stop').classList.add('hidden');
    this._setCircle('idle', 0);
    this.stepIdx  = 0;
    this.cycleIdx = 0;
  }

  start() {
    this.stepIdx  = 0;
    this.cycleIdx = 0;
    this.running  = true;
    document.getElementById('sos-start').classList.add('hidden');
    document.getElementById('sos-stop').classList.remove('hidden');
    this._runStep();
  }

  stop() {
    clearTimeout(this.stepTimer);
    clearInterval(this.tickTimer);
    this.running = false;
    this._reset();
  }

  _runStep() {
    if (!this.running) return;
    const ex   = EXERCISES[this.exIdx];
    const step = ex.steps[this.stepIdx];

    document.getElementById('sos-step-label').textContent  = step.label;
    document.getElementById('sos-cycle-info').textContent  = `Ciclo ${this.cycleIdx + 1} de ${ex.cycles}`;
    this._setCircle(step.phase, step.dur);

    let rem = step.dur;
    document.getElementById('sos-countdown').textContent = rem;
    clearInterval(this.tickTimer);
    this.tickTimer = setInterval(() => {
      rem--;
      document.getElementById('sos-countdown').textContent = rem > 0 ? rem : '';
      if (rem <= 0) clearInterval(this.tickTimer);
    }, 1000);

    this.stepTimer = setTimeout(() => {
      this.stepIdx++;
      if (this.stepIdx >= ex.steps.length) {
        this.stepIdx = 0;
        this.cycleIdx++;
        if (this.cycleIdx >= ex.cycles) { this._complete(); return; }
      }
      this._runStep();
    }, step.dur * 1000);
  }

  _complete() {
    clearInterval(this.tickTimer);
    this.running = false;
    document.getElementById('sos-step-label').textContent  = 'Muito bem!';
    document.getElementById('sos-countdown').textContent   = '✓';
    document.getElementById('sos-cycle-info').textContent  = 'Exercício concluído 🎉';
    this._setCircle('done', 0.5);
    document.getElementById('sos-stop').classList.add('hidden');
    const startBtn = document.getElementById('sos-start');
    startBtn.textContent = 'Repetir';
    startBtn.classList.remove('hidden');
  }

  _setCircle(phase, dur) {
    const el = document.getElementById('sos-circle');
    el.style.setProperty('--step-dur', dur + 's');
    /* force reflow so transition restarts */
    el.className = 'sos-circle';
    void el.offsetWidth;
    el.className = `sos-circle ${phase}`;
  }

  _showQuote() {
    this.quoteIdx = Math.floor(Math.random() * QUOTES.length);
    document.getElementById('sos-quote').textContent = QUOTES[this.quoteIdx];
  }

  _nextQuote() {
    this.quoteIdx = (this.quoteIdx + 1) % QUOTES.length;
    document.getElementById('sos-quote').textContent = QUOTES[this.quoteIdx];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sos = new SOSModal();
  document.querySelectorAll('.sos-trigger').forEach(el => {
    el.addEventListener('click', () => sos.open());
  });
});
