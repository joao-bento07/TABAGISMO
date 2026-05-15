/* ============================================================
   CHALLENGES.JS — desafios diários (30 desafios)
   ============================================================ */

const CHALLENGES = [
  { day:1,  icon:'💧', cat:'hidratacao', title:'Beba 8 copos d\'água',              desc:'A água ajuda a limpar a nicotina do organismo e reduz a fissura. Mantenha uma garrafa por perto o dia todo.',             tip:'Adicione limão ou hortelã para tornar mais agradável.' },
  { day:2,  icon:'🧘', cat:'bem-estar',  title:'5 minutos de respiração profunda',  desc:'Quando a vontade de fumar aparecer, respire pelo nariz por 4s, segure por 4s e solte pela boca por 6s. Repita 5x.',      tip:'Essa técnica ativa o sistema nervoso parassimpático e reduz a ansiedade bem rápido.' },
  { day:3,  icon:'🏃', cat:'movimento',  title:'Caminhe 15 minutos',                desc:'O exercício libera dopamina de forma natural, preenchendo o espaço que o cigarro ocupava no cérebro.',                   tip:'Não precisa ser academia. Uma volta no campus já resolve.' },
  { day:4,  icon:'🍎', cat:'nutricao',   title:'Troque o cigarro por uma fruta',    desc:'Sempre que bater a vontade, coma uma fruta ou vegetal crocante — cenoura, pepino ou maçã funcionam muito bem.',          tip:'Palitos de cenoura são práticos de levar para a aula.' },
  { day:5,  icon:'💬', cat:'social',     title:'Conta para alguém',                 desc:'Fale para uma pessoa de confiança que você está parando. Ter alguém torcendo por você aumenta muito a chance de sucesso.',  tip:'Peça para ela te perguntar como você está nos próximos dias.' },
  { day:6,  icon:'🔍', cat:'bem-estar',  title:'Identifique um gatilho',            desc:'Anote uma situação que normalmente te faz querer fumar. Conhecer o gatilho é o primeiro passo para desarmá-lo.',          tip:'Gatilhos comuns: café, álcool, estresse, após refeição, no intervalo das aulas.' },
  { day:7,  icon:'🎉', cat:'bem-estar',  title:'Uma semana! Celebre e reflita',     desc:'Você está há 7 dias. Liste 3 coisas que você já percebeu de diferente — no hálito, fôlego, disposição ou bolso.',        tip:'Compartilhe sua conquista com quem te apoia. Você merece reconhecimento.' },
  { day:8,  icon:'💧', cat:'hidratacao', title:'Hidratação turbo',                  desc:'Coloque uma garrafa de 500ml na mesa e encha 4 vezes ao longo do dia. Meta: 2 litros antes do jantar.',                   tip:'Apps como WaterMinder ajudam a rastrear a ingestão de água.' },
  { day:9,  icon:'🏃', cat:'movimento',  title:'Suba escadas hoje',                 desc:'Evite o elevador. Cada lance de escada é um mini-treino para os pulmões que estão em recuperação.',                       tip:'Comece subindo só um lance se necessário. O importante é criar o hábito.' },
  { day:10, icon:'⏱️', cat:'bem-estar',  title:'Técnica dos 10 minutos',            desc:'Quando der vontade de fumar, diga: "vou esperar 10 minutos". A fissura geralmente passa nesse tempo.',                   tip:'Durante esses 10 minutos: mude de ambiente, beba água, respire fundo.' },
  { day:11, icon:'☕', cat:'nutricao',   title:'Mude a rotina do café',             desc:'Se você fumava após o café, modifique a sequência: tome o café e escove os dentes imediatamente depois.',                 tip:'Chicletes sem açúcar também ajudam a encerrar o ritual do café.' },
  { day:12, icon:'👥', cat:'social',     title:'Pesquise grupos de apoio',          desc:'Procure grupos de apoio na UBS, no campus da Afya ou em comunidades online. Ouvir experiências de outros ajuda muito.',   tip:'O Reddit tem a comunidade r/stopsmoking com centenas de relatos reais.' },
  { day:13, icon:'🧘', cat:'bem-estar',  title:'Meditação de 10 minutos',           desc:'Use um app gratuito como Insight Timer ou Meditações Guiadas no YouTube para uma sessão rápida de mindfulness.',         tip:'Não precisa esvaziar a mente. Só observe seus pensamentos sem julgamento.' },
  { day:14, icon:'💰', cat:'bem-estar',  title:'2 semanas! Calcule o que economizou', desc:'Veja quanto dinheiro você já economizou em 14 dias no contador deste app. Planeje algo legal com essa grana.',         tip:'Visualizar o ganho financeiro é um dos motivadores mais concretos para continuar.' },
  { day:15, icon:'🤸', cat:'movimento',  title:'Experimente um exercício novo',     desc:'Yoga, natação, ciclismo, dança — experimente algo fora da rotina. Atividades novas são mais motivadoras.',              tip:'A Afya provavelmente tem espaços ou parcerias com academias locais. Pergunte!' },
  { day:16, icon:'🥗', cat:'nutricao',   title:'Dia sem ultraprocessados',          desc:'Troque salgadinhos e doces por opções naturais por um dia. A alimentação afeta diretamente o humor.',                   tip:'Não precisa ser perfeito. Só reduz o que der.' },
  { day:17, icon:'🍵', cat:'hidratacao', title:'Chá no lugar do cigarro',           desc:'Prepare um chá de camomila, hortelã ou erva-cidreira. O ritual ajuda a substituir o hábito do cigarro.',                  tip:'Chás de ervas têm efeito calmante natural e zero nicotina.' },
  { day:18, icon:'✨', cat:'social',     title:'Seja uma inspiração',               desc:'Conte para alguém novo que você está parando. Ver o orgulho na reação das pessoas é um reforço muito poderoso.',          tip:'Uma mensagem simples já conta: "Estou há X dias sem fumar!"' },
  { day:19, icon:'📝', cat:'bem-estar',  title:'Escreva seus 5 motivos',            desc:'Anote os 5 principais motivos pelos quais você quer se libertar. Guarde onde vai ver quando a vontade aparecer.',        tip:'Seja específico e pessoal. "Por causa da minha família" é mais forte que "por saúde".' },
  { day:20, icon:'😤', cat:'bem-estar',  title:'Lide com o estresse hoje',          desc:'Identifique o que está te estressando agora e faça algo concreto: conversa, caminhada, organização do dia.',            tip:'O cigarro nunca resolveu problema nenhum. Só adiou e criou mais um.' },
  { day:21, icon:'🌮', cat:'nutricao',   title:'3 semanas! Saboreie algo novo',     desc:'Seu paladar está bem mais aguçado. Experimente um alimento ou tempero que antes parecia sem graça.',                   tip:'Experimente cozinhar algo novo — mantém as mãos e a mente ocupadas.' },
  { day:22, icon:'🚫', cat:'nutricao',   title:'Evite o álcool hoje',               desc:'O álcool é um dos maiores gatilhos de recaída. Fique de boa com água, suco natural ou refrigerante hoje.',              tip:'Em eventos, segure um copo de algo não alcoólico. Ajuda com a pressão social.' },
  { day:23, icon:'🏆', cat:'movimento',  title:'Desafio de 30 minutos',             desc:'Faça 30 minutos contínuos de atividade física. Sinta conscientemente como seu fôlego está melhor do que há 3 semanas.', tip:'Uma caminhada rápida já conta. O importante é sentir a diferença.' },
  { day:24, icon:'❤️', cat:'social',     title:'Agradeça seu apoiador',             desc:'Mande uma mensagem para quem mais te apoiou nessa jornada. Gratidão fortalece os laços que te mantêm firme.',          tip:'Conexões afetivas saudáveis são um dos maiores fatores de proteção contra o vício.' },
  { day:25, icon:'😴', cat:'bem-estar',  title:'Priorize o sono',                   desc:'Durma no horário certo hoje. A privação de sono é um dos maiores fatores de risco para recaída em qualquer vício.',     tip:'Evite telas 30 minutos antes de dormir. Leia, ouça música suave ou medite.' },
  { day:26, icon:'🛡️', cat:'bem-estar', title:'Antecipe uma situação difícil',     desc:'Pense numa situação próxima onde vai ser difícil não fumar (festa, prova, etc). Planeje como vai agir.',             tip:'Ter um plano concreto reduz muito a chance de recaída quando a situação aparecer.' },
  { day:27, icon:'🍳', cat:'nutricao',   title:'Cozinhe algo novo',                 desc:'Preparar uma refeição mantém as mãos ocupadas, estimula a criatividade e você ainda come melhor no final.',             tip:'Quanto mais envolvido você estiver no preparo, menos vai pensar no cigarro.' },
  { day:28, icon:'📣', cat:'social',     title:'Quase 1 mês! Compartilhe',          desc:'Faltam só 2 dias. Compartilhe onde você está — uma foto, um post, uma mensagem. Você pode inspirar alguém.',           tip:'Contar para outros fortalece o compromisso e ajuda mais gente do que você imagina.' },
  { day:29, icon:'💭', cat:'bem-estar',  title:'Reflita sobre a jornada',           desc:'Como você era há 28 dias vs. como está hoje? Escreva ou grave um áudio descrevendo essa transformação.',              tip:'Guardar esse registro vai ser valioso se a vontade de fumar aparecer no futuro.' },
  { day:30, icon:'🏅', cat:'social',     title:'UM MÊS LIVRE! Celebre!',            desc:'Você ficou um mês inteiro sem fumar. Isso é algo que a maioria das pessoas nunca consegue. Celebre com quem te apoiu.', tip:'Use o dinheiro economizado para fazer algo especial. Você merece muito!' },
];

const CAT_LABELS = {
  'hidratacao': '💧 Hidratação',
  'bem-estar':  '🧘 Bem-estar',
  'movimento':  '🏃 Movimento',
  'nutricao':   '🍎 Nutrição',
  'social':     '💬 Social',
};

function getCounterData() {
  try {
    return JSON.parse(localStorage.getItem('smokeCounter') || '{}');
  } catch { return {}; }
}

function getDayNumber() {
  const data = getCounterData();
  if (!data.quitDate) return null;
  const elapsed = Date.now() - new Date(data.quitDate).getTime();
  if (elapsed < 0) return null;
  return Math.min(30, Math.max(1, Math.ceil(elapsed / 86400e3)));
}

function getCompletedToday() {
  const key = 'challenge_done_' + new Date().toDateString();
  return localStorage.getItem(key) === '1';
}

function markDoneToday() {
  const key = 'challenge_done_' + new Date().toDateString();
  localStorage.setItem(key, '1');
  updateStreak();
}

function getStreak() {
  return parseInt(localStorage.getItem('challenge_streak') || '0');
}

function updateStreak() {
  const lastKey = 'challenge_last_done';
  const today   = new Date().toDateString();
  const last    = localStorage.getItem(lastKey);
  const streak  = getStreak();

  if (last === today) return;

  const yesterday = new Date(Date.now() - 86400e3).toDateString();
  const newStreak = (last === yesterday) ? streak + 1 : 1;
  localStorage.setItem('challenge_streak', newStreak);
  localStorage.setItem(lastKey, today);
}

function renderChallenges() {
  const container = document.getElementById('tool-desafios');
  if (!container) return;

  const dayNum    = getDayNumber();
  const streak    = getStreak();
  const doneToday = getCompletedToday();

  if (!dayNum) {
    container.innerHTML = `
      <div class="no-counter-msg">
        <p>Configure o <strong>Contador de Tempo</strong> primeiro para liberar os desafios personalizados.</p>
        <button class="btn btn-primary" onclick="document.querySelector('[data-tool=contador]').click()">Ir para o Contador →</button>
      </div>`;
    return;
  }

  const today    = CHALLENGES[dayNum - 1];
  const upcoming = CHALLENGES.slice(dayNum, Math.min(dayNum + 5, 30));
  const done     = CHALLENGES.slice(0, dayNum - 1);

  let html = `
    <div class="challenges-header">
      <div>
        <h3>Desafio do Dia ${dayNum}</h3>
        <p>Pequenas conquistas constroem grandes mudanças. Um dia de cada vez.</p>
      </div>
      <div class="streak-badge">
        <span class="streak-icon">🔥</span>
        <div>
          <div class="streak-count">${streak}</div>
          <div class="streak-label">dias seguidos</div>
        </div>
      </div>
    </div>

    <div class="challenge-today">
      <div class="today-label">
        <span>Dia ${dayNum} de 30</span>
        <span style="background:rgba(255,255,255,.15);padding:.15rem .6rem;border-radius:100px">${CAT_LABELS[today.cat] || today.cat}</span>
      </div>
      <div class="challenge-icon-big">${today.icon}</div>
      <h3>${today.title}</h3>
      <p>${today.desc}</p>
      <div class="challenge-tip"><strong>Dica:</strong> ${today.tip}</div>
      <button class="challenge-done-btn ${doneToday ? 'done' : ''}" id="challenge-done-btn">
        ${doneToday ? '✓ Concluído hoje!' : '✓ Marcar como feito'}
      </button>
    </div>`;

  if (upcoming.length) {
    html += `<div class="challenges-list"><h4>Próximos desafios</h4><div class="challenge-mini-grid">`;
    upcoming.forEach(c => {
      html += `
        <div class="challenge-mini">
          <span class="mini-icon">${c.icon}</span>
          <div>
            <div class="mini-day">Dia ${c.day}</div>
            <div class="mini-title">${c.title}</div>
          </div>
        </div>`;
    });
    html += `</div></div>`;
  }

  if (done.length) {
    html += `<div class="challenges-list" style="margin-top:1.5rem"><h4>Desafios concluídos (${done.length})</h4><div class="challenge-mini-grid">`;
    done.slice().reverse().forEach(c => {
      html += `
        <div class="challenge-mini done-mini">
          <span class="mini-icon">${c.icon}</span>
          <div>
            <div class="mini-day">Dia ${c.day} ✓</div>
            <div class="mini-title">${c.title}</div>
          </div>
        </div>`;
    });
    html += `</div></div>`;
  }

  container.innerHTML = html;

  const doneBtn = document.getElementById('challenge-done-btn');
  if (doneBtn && !doneToday) {
    doneBtn.addEventListener('click', () => {
      markDoneToday();
      doneBtn.textContent = '✓ Concluído hoje!';
      doneBtn.classList.add('done');
    });
  }
}

document.addEventListener('DOMContentLoaded', renderChallenges);
