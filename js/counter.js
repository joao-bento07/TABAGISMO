/* ============================================================
   COUNTER.JS — contador de tempo sem fumar
   ============================================================ */

const STAGES = [
  { ms: 20 * 60e3,                label: '20 minutos', desc: 'Pressão arterial e frequência cardíaca voltaram ao normal' },
  { ms: 8  * 3600e3,              label: '8 horas',    desc: 'Nível de monóxido de carbono no sangue caiu pela metade' },
  { ms: 24 * 3600e3,              label: '1 dia',      desc: 'Risco de infarto já começa a diminuir' },
  { ms: 48 * 3600e3,              label: '2 dias',     desc: 'Olfato e paladar começam a se recuperar' },
  { ms: 72 * 3600e3,              label: '3 dias',     desc: 'Brônquios relaxam — respirar já ficou mais fácil' },
  { ms: 14 * 86400e3,             label: '2 semanas',  desc: 'Circulação melhora e função pulmonar aumenta' },
  { ms: 30 * 86400e3,             label: '1 mês',      desc: 'Tosse crônica e falta de ar diminuem' },
  { ms: 90 * 86400e3,             label: '3 meses',    desc: 'Capacidade pulmonar aumentou até 30%' },
  { ms: 270 * 86400e3,            label: '9 meses',    desc: 'Cílios pulmonares recuperados — infecções diminuem' },
  { ms: 365 * 86400e3,            label: '1 ano',      desc: 'Risco de doença cardíaca caiu pela metade' },
  { ms: 5  * 365 * 86400e3,       label: '5 anos',     desc: 'Risco de AVC igual ao de quem nunca fumou' },
  { ms: 10 * 365 * 86400e3,       label: '10 anos',    desc: 'Risco de câncer de pulmão caiu pela metade' },
  { ms: 15 * 365 * 86400e3,       label: '15 anos',    desc: 'Risco cardíaco igual ao de quem nunca fumou' },
];

class SmokeCounter {
  constructor() {
    this.interval = null;
    this.data = this._load();
    this._init();
  }

  _load() {
    try {
      const s = localStorage.getItem('smokeCounter');
      return s ? JSON.parse(s) : this._defaults();
    } catch { return this._defaults(); }
  }

  _defaults() {
    return { quitDate: null, cigarettesPerDay: 10, pricePerPack: 15, cigarettesPerPack: 20 };
  }

  _save() {
    localStorage.setItem('smokeCounter', JSON.stringify(this.data));
  }

  _init() {
    this._setupForm();
    if (this.data.quitDate) {
      this._showDisplay();
      this._startTimer();
    }
  }

  _setupForm() {
    const form   = document.getElementById('counter-setup');
    const dateEl = document.getElementById('quit-date');
    const cigEl  = document.getElementById('cigarettes-per-day');
    const priceEl= document.getElementById('price-per-pack');

    if (!form) return;

    if (dateEl) {
      if (this.data.quitDate) {
        const d = new Date(this.data.quitDate);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        dateEl.value = d.toISOString().slice(0, 16);
      } else {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateEl.value = now.toISOString().slice(0, 16);
      }
    }
    if (cigEl)   cigEl.value   = this.data.cigarettesPerDay;
    if (priceEl) priceEl.value = this.data.pricePerPack;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const qd = dateEl ? new Date(dateEl.value) : new Date();
      if (isNaN(qd.getTime())) return;

      this.data.quitDate          = qd.toISOString();
      this.data.cigarettesPerDay  = Math.max(1, parseInt(cigEl?.value) || 10);
      this.data.pricePerPack      = Math.max(0.1, parseFloat(priceEl?.value) || 15);
      this._save();
      this._showDisplay();
      this._startTimer();
    });
  }

  _showDisplay() {
    document.getElementById('counter-setup-wrapper')?.classList.add('hidden');
    const display = document.getElementById('counter-display');
    display?.classList.remove('hidden');

    const resetBtn = document.getElementById('counter-reset');
    resetBtn?.addEventListener('click', () => this._reset(), { once: true });
  }

  _reset() {
    if (!confirm('Redefinir o contador vai apagar seu progresso salvo. Tem certeza?')) return;
    this._stopTimer();
    this.data = this._defaults();
    this._save();
    document.getElementById('counter-setup-wrapper')?.classList.remove('hidden');
    document.getElementById('counter-display')?.classList.add('hidden');
  }

  _startTimer() {
    this._update();
    this.interval = setInterval(() => this._update(), 1000);
  }

  _stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
  }

  _update() {
    if (!this.data.quitDate) return;
    const now  = Date.now();
    const quit = new Date(this.data.quitDate).getTime();
    const diff = now - quit;

    if (diff < 0) {
      this._showCountdown(-diff);
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days     = Math.floor(totalSec / 86400);
    const hours    = Math.floor((totalSec % 86400) / 3600);
    const mins     = Math.floor((totalSec % 3600) / 60);
    const secs     = totalSec % 60;

    this._setText('count-days',    days);
    this._setText('count-hours',   this._pad(hours));
    this._setText('count-minutes', this._pad(mins));
    this._setText('count-seconds', this._pad(secs));

    const cigNotSmoked = Math.floor((diff / 86400e3) * this.data.cigarettesPerDay);
    const moneySaved   = (cigNotSmoked / this.data.cigarettesPerPack) * this.data.pricePerPack;

    this._setText('count-cigarettes', cigNotSmoked.toLocaleString('pt-BR'));
    this._setText('count-money', 'R$ ' + moneySaved.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    this._updateStage(diff);
  }

  _showCountdown(remaining) {
    const days  = Math.floor(remaining / 86400e3);
    const hours = Math.floor((remaining % 86400e3) / 3600e3);
    const el    = document.getElementById('count-days');
    if (el) {
      el.closest('.time-unit')?.previousElementSibling?.insertAdjacentHTML('beforebegin',
        `<p style="color:var(--primary-light);font-size:.9rem;margin-bottom:.5rem">Sua jornada começa em ${days > 0 ? days + 'd ' : ''}${hours}h</p>`
      );
    }
  }

  _updateStage(elapsed) {
    let current = STAGES[0];
    let next    = STAGES[1];

    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (elapsed >= STAGES[i].ms) {
        current = STAGES[i];
        next    = STAGES[i + 1] ?? null;
        break;
      }
    }

    this._setText('stage-label', current.label);
    this._setText('stage-desc',  current.desc);

    const nextEl = document.getElementById('stage-next');
    if (nextEl) {
      nextEl.textContent = next
        ? `${next.label} — ${next.desc}`
        : 'Você atingiu todos os marcos! Parabéns.';
    }
  }

  _setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  _pad(n) { return String(n).padStart(2, '0'); }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('counter-setup')) new SmokeCounter();
});
