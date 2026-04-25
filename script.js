/* ===== ヘッダー: スクロールで背景を追加 ===== */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== ハンバーガーメニュー ===== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== フェードイン: IntersectionObserver ===== */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* ===== 数字カウントアップアニメーション ===== */
function countUp(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = isFloat
      ? current.toFixed(1) + (el.dataset.suffix || '')
      : Math.floor(current) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

/* ===== メニュータブ切り替え ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

/* ===== お問合せフォーム バリデーション ===== */
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name     = document.getElementById('c-name').value.trim();
  const email    = document.getElementById('c-email').value.trim();
  const category = document.getElementById('c-category').value;
  const message  = document.getElementById('c-message').value.trim();
  const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !category || !message) {
    alert('すべての必須項目を入力してください。');
    return;
  }
  if (!emailOk) {
    alert('正しいメールアドレスを入力してください。');
    return;
  }
  alert(`${name} 様のお問合せを受け付けました。\n2営業日以内にご返信いたします。`);
  e.target.reset();
});

/* ===== 予約フォーム バリデーション ===== */
document.querySelector('.reservation-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('r-name').value.trim();
  const tel  = document.getElementById('r-tel').value.trim();
  const date = document.getElementById('r-date').value;
  const menu = document.getElementById('r-menu').value;

  if (!name || !tel || !date || !menu) {
    alert('すべての必須項目を入力してください。');
    return;
  }
  alert(`${name} 様のご予約を受け付けました。\nご確認のご連絡をお送りいたします。`);
  e.target.reset();
});

/* ===== チャットボット ===== */
const chatToggle   = document.querySelector('.chatbot-toggle');
const chatWindow   = document.querySelector('.chatbot-window');
const chatMessages = document.querySelector('.chatbot-messages');
const chatOptions  = document.querySelector('.chatbot-options');

chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
});

const scenarios = {
  start: {
    message: 'こんにちは！Beauté Noir へようこそ ✨\nご質問をお気軽にどうぞ。',
    options: [
      { label: '営業時間を教えて', next: 'hours' },
      { label: 'ご予約方法について', next: 'booking' },
      { label: 'メニュー・料金について', next: 'menu' },
      { label: 'アクセスを教えて', next: 'access' },
    ],
  },
  hours: {
    message: '営業時間は以下の通りです。\n\n📅 火〜日曜日 10:00〜20:00\n🔒 月曜定休\n\n祝日も通常営業しております。',
    options: [
      { label: '他のことを聞く', next: 'start' },
      { label: 'ご予約はこちら', anchor: '#reservation' },
    ],
  },
  booking: {
    message: 'ご予約はページ内の「ご予約フォーム」からどうぞ。\nお電話でも承っております📞\n\nTEL: 03-XXXX-XXXX\n（受付: 10:00〜19:00）',
    options: [
      { label: '他のことを聞く', next: 'start' },
      { label: 'フォームへ移動', anchor: '#reservation' },
    ],
  },
  menu: {
    message: 'ネイル・エステ各種メニューをご用意しております。\n詳細はページ内「メニュー・料金」セクションをご覧ください💅',
    options: [
      { label: '他のことを聞く', next: 'start' },
      { label: 'メニューを見る', anchor: '#menu' },
    ],
  },
  access: {
    message: '📍 東京都〇〇区〇〇1-2-3\n\n最寄り駅から徒歩3分。\n詳しくはサロン情報をご確認ください。',
    options: [
      { label: '他のことを聞く', next: 'start' },
      { label: 'お問合せする', anchor: '#contact' },
    ],
  },
};

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = type === 'bot' ? 'msg-bot' : 'msg-user';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderOptions(options) {
  chatOptions.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chat-option';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      addMessage(opt.label, 'user');
      chatOptions.innerHTML = '';
      if (opt.anchor) {
        setTimeout(() => {
          chatWindow.classList.remove('open');
          document.querySelector(opt.anchor)?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      } else if (opt.next) {
        setTimeout(() => {
          const scene = scenarios[opt.next];
          addMessage(scene.message, 'bot');
          renderOptions(scene.options);
        }, 500);
      }
    });
    chatOptions.appendChild(btn);
  });
}

function initChat() {
  chatMessages.innerHTML = '';
  const scene = scenarios.start;
  addMessage(scene.message, 'bot');
  renderOptions(scene.options);
}

chatToggle.addEventListener('click', () => {
  if (chatWindow.classList.contains('open') && chatMessages.children.length === 0) {
    initChat();
  }
});

initChat();
