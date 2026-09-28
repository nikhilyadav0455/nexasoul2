(function checkAuth() {
  const isAuth = sessionStorage.getItem('grand-line-auth') || localStorage.getItem('grand-line-auth');
  if (!isAuth) {
    window.location.replace('/');
  }
})();

// Restore theme immediately to avoid flash of dark/light theme
(function initTheme() {
  const savedTheme = localStorage.getItem('grand-line-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
    if (document.body) document.body.classList.add('theme-light');
  }
})();

const DEFAULT_CREW = [
  { name: 'Luffy', role: 'Captain', bounty: '3,000,000,000 B', portrait: '/assets/luffy.webp' },
  { name: 'Nami', role: 'Navigator', bounty: '366,000,000 B', portrait: '/assets/nami.webp' },
  { name: 'Sanji', role: 'Cook', bounty: '1,032,000,000 B', portrait: '/assets/sanji.jpeg' },
  { name: 'Zoro', role: 'Swordsman', bounty: '1,111,000,000 B', portrait: '/assets/zoro.webp' },
  { name: 'Usopp', role: 'Sniper', bounty: '500,000,000 B', portrait: '/assets/ussop.jpeg' },
  { name: 'Chopper', role: 'Doctor', bounty: '1,000 B', portrait: '/assets/chopper.jpeg' },
  { name: 'Robin', role: 'Archaeologist', bounty: '930,000,000 B', portrait: '/assets/robin.webp' },
  { name: 'Franky', role: 'Shipwright', bounty: '394,000,000 B', portrait: '/assets/franky.jpeg' },
  { name: 'Brook', role: 'Musician', bounty: '383,000,000 B', portrait: '/assets/brook.jpeg' },
  { name: 'Jinbe', role: 'Helmsman', bounty: '1,100,000,000 B', portrait: '/assets/jinbe.jpeg' },
];

const ONE_PIECE_AVATARS = [
  { name: 'Luffy', src: '/assets/luffy.webp' },
  { name: 'Zoro', src: '/assets/zoro.webp' },
  { name: 'Nami', src: '/assets/nami.webp' },
  { name: 'Sanji', src: '/assets/sanji.jpeg' },
  { name: 'Usopp', src: '/assets/ussop.jpeg' },
  { name: 'Chopper', src: '/assets/chopper.jpeg' },
  { name: 'Robin', src: '/assets/robin.webp' },
  { name: 'Franky', src: '/assets/franky.jpeg' },
  { name: 'Brook', src: '/assets/brook.jpeg' },
  { name: 'Jinbe', src: '/assets/jinbe.jpeg' },
  { name: 'Roger', src: '/assets/roger.jpg' },
  { name: 'Garp', src: '/assets/garp.jpg' },
  { name: 'Shanks', src: '/assets/shanks.png' },
  { name: 'Ace', src: '/assets/ace.jpg' },
  { name: 'Blackbeard', src: '/assets/blackbeard.jpg' },
  { name: 'Whitebeard', src: '/assets/whitebeard.jpg' },
  { name: 'Law', src: '/assets/law.jpg' },
  { name: 'Mihawk', src: '/assets/mihawk.png' },
  { name: 'Buggy', src: '/assets/buggy.png' },
  { name: 'Sabo', src: '/assets/sabo.png' },
  { name: 'Rayleigh', src: '/assets/rayleigh.jpg' },
  { name: 'Yamato', src: '/assets/yamato.jpg' },
];

const CATEGORY_ICONS = {
  Food: '🍖',
  Travel: '🧭',
  Supplies: '📦',
  Maintenance: '🔧',
  Accommodation: '🏠',
  Other: '💰',
};

function capitalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
}

function getMemberPortrait(name, explicitPortrait) {
  if (explicitPortrait && typeof explicitPortrait === 'string' && explicitPortrait.trim() !== '') {
    let p = explicitPortrait.trim();
    if (p.includes('unsplash.com')) {
      const match = ONE_PIECE_AVATARS.find((a) => (name || '').toLowerCase().includes(a.name.toLowerCase()));
      if (match) return match.src;
    }
    if (p.startsWith('assets/')) p = '/' + p;
    return p;
  }
  const cleanName = (name || '').toLowerCase().trim();
  if (!cleanName) return '';
  const match = ONE_PIECE_AVATARS.find(
    (a) =>
      cleanName === a.name.toLowerCase() ||
      cleanName.includes(a.name.toLowerCase()) ||
      a.name.toLowerCase().includes(cleanName)
  );
  if (match) return match.src;
  const defaultMatch = DEFAULT_CREW.find(
    (c) =>
      cleanName === c.name.toLowerCase() ||
      cleanName.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(cleanName)
  );
  if (defaultMatch) return defaultMatch.portrait;
  return '';
}

const CURRENCY_CONFIG = {
  BELI: { symbol: '฿', rate: 1, name: 'Beli' },
  USD: { symbol: '$', rate: 0.01, name: 'USD' },
  EUR: { symbol: '€', rate: 0.0092, name: 'EUR' },
  INR: { symbol: '₹', rate: 0.83, name: 'INR' },
  JPY: { symbol: '¥', rate: 1.5, name: 'JPY' },
};

let activeCurrency = 'BELI';
let soundEnabled = true;
let audioCtx = null;
let activeCategoryFilter = 'ALL';
let selectedAvatarSrc = '';

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCoinSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now);
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.32);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(1975.53, now + 0.2);
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.42);
  } catch {}
}

function playSettleSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.28);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  } catch {}
}

const STORAGE_KEY = 'grand-line-ledger-v5';
const LEGACY_V4_STORAGE_KEY = 'grand-line-ledger-v4';
const LEGACY_V3_STORAGE_KEY = 'grand-line-ledger-v3';
const LEGACY_V2_STORAGE_KEY = 'grand-line-ledger-v2';
const LEGACY_STORAGE_KEY = 'grand-line-ledger-v1';
const DEMO_EXPENSE_IDS = new Set(['dinner', 'transport', 'supplies', 'ship-repair', 'stay']);

let crew = DEFAULT_CREW.map((member) => ({ ...member }));
const state = loadState();
crew = state.crew;

const formatBeli = (amountInCents) => {
  const cents = Math.round(Number(amountInCents) || 0);
  const cfg = CURRENCY_CONFIG[activeCurrency] || CURRENCY_CONFIG.BELI;
  if (activeCurrency === 'BELI') {
    const whole = Math.floor(cents / 100).toLocaleString('en-US');
    const fraction = cents % 100;
    return `฿ ${whole}${fraction ? `.${String(fraction).padStart(2, '0')}` : ''}`;
  }
  const converted = (cents / 100) * cfg.rate;
  return `${cfg.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const avatarMarkup = (name, size = 'small') => {
  const member = crew.find((item) => item.name.toLowerCase() === (name || '').toLowerCase());
  const portrait = getMemberPortrait(name, member?.portrait);
  const initials = escapeHTML((name || '?').slice(0, 1).toUpperCase());
  if (portrait) {
    return `<span class="avatar avatar-${size}" aria-label="${escapeHTML(name)}"><span class="avatar-fallback">${initials}</span><img src="${escapeHTML(portrait)}" alt="" loading="lazy" onerror="this.style.display='none';"></span>`;
  }
  return `<span class="avatar avatar-${size}" aria-label="${escapeHTML(name)}"><span class="avatar-fallback">${initials}</span></span>`;
};

function initDefaultState() {
  const defaultMembers = DEFAULT_CREW.map((member) => ({ ...member }));
  const defaultCrew = {
    id: 'straw-hats',
    name: 'Straw Hat Crew',
    members: defaultMembers,
    expenses: [],
    payments: [],
    currentUser: 'Luffy'
  };
  const stateObj = {
    crews: [defaultCrew],
    activeCrewId: 'straw-hats',
    crew: defaultMembers,
    currentUser: 'Luffy',
    expenses: [],
    payments: [],
    totalSpend: 0,
    youOwe: 0,
    youGet: 0
  };
  updateSummary(stateObj);
  return stateObj;
}

function normalizeCrewGroup(group) {
  const name = String(group.name || 'Pirate Crew').trim().slice(0, 40) || 'Pirate Crew';
  const id = String(group.id || `crew-${Date.now()}`);
  const members = normalizeCrew(group.members || group.crew);

  const nameMap = new Map();
  (group.members || group.crew || []).forEach((m) => {
    if (m && m.name) {
      nameMap.set(m.name, capitalizeName(m.name));
    }
  });

  const expenses = (Array.isArray(group.expenses) ? group.expenses : [])
    .filter((expense) => !DEMO_EXPENSE_IDS.has(expense.id))
    .map((e) => {
      const payer = nameMap.get(e.payer) || capitalizeName(e.payer);
      const expenseMembers = (e.members || []).map((m) => nameMap.get(m) || capitalizeName(m));
      let shares = e.shares;
      if (shares && typeof shares === 'object') {
        shares = {};
        for (const [k, v] of Object.entries(e.shares)) {
          shares[nameMap.get(k) || capitalizeName(k)] = v;
        }
      }
      const category = e.category || 'Other';
      const icon = CATEGORY_ICONS[category] || '💰';
      return normalizeExpense({ ...e, payer, members: expenseMembers, shares, category, icon }, members);
    })
    .filter(Boolean);

  const payments = (Array.isArray(group.payments) ? group.payments : [])
    .map((p) => {
      const from = nameMap.get(p.from) || capitalizeName(p.from);
      const to = nameMap.get(p.to) || capitalizeName(p.to);
      return normalizePayment({ ...p, from, to }, members);
    })
    .filter(Boolean);

  const rawCurrentUser = group.currentUser || '';
  const mappedUser = nameMap.get(rawCurrentUser) || capitalizeName(rawCurrentUser);
  const currentUser = members.some((m) => m.name === mappedUser)
    ? mappedUser
    : members[0].name;

  return { id, name, members, expenses, payments, currentUser };
}

function getActiveCrew(targetState = state) {
  if (!Array.isArray(targetState.crews) || targetState.crews.length === 0) {
    const defaults = initDefaultState();
    targetState.crews = defaults.crews;
    targetState.activeCrewId = defaults.activeCrewId;
  }
  let active = targetState.crews.find((c) => c.id === targetState.activeCrewId);
  if (!active) {
    active = targetState.crews[0];
    targetState.activeCrewId = active.id;
  }
  return active;
}

function syncActiveCrew(targetState = state) {
  const active = getActiveCrew(targetState);
  targetState.crew = active.members;
  crew = active.members;
  targetState.expenses = active.expenses;
  targetState.payments = active.payments;
  targetState.currentUser = active.currentUser;
  return active;
}

function loadState() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem(LEGACY_V4_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_V3_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_V2_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!savedValue) {
      return initDefaultState();
    }

    const saved = JSON.parse(savedValue);
    if (!saved) return initDefaultState();

    let crews = [];
    if (Array.isArray(saved.crews) && saved.crews.length > 0) {
      crews = saved.crews.map(normalizeCrewGroup);
    } else if (Array.isArray(saved.expenses) || Array.isArray(saved.crew)) {
      const savedCrew = normalizeCrew(saved.crew);
      const expenses = (saved.expenses || [])
        .filter((expense) => !DEMO_EXPENSE_IDS.has(expense.id))
        .map((expense) => normalizeExpense(expense, savedCrew))
        .filter(Boolean);
      const payments = (Array.isArray(saved.payments) ? saved.payments : [])
        .map((payment) => normalizePayment(payment, savedCrew))
        .filter(Boolean);
      const currentUser = savedCrew.some((member) => member.name === saved.currentUser)
        ? saved.currentUser
        : savedCrew.find((member) => member.name === 'Luffy')?.name || savedCrew[0].name;
      crews.push({
        id: 'straw-hats',
        name: 'Straw Hat Crew',
        members: savedCrew,
        expenses,
        payments,
        currentUser
      });
    }

    if (crews.length === 0) return initDefaultState();

    let activeCrewId = saved.activeCrewId;
    if (!crews.some((c) => c.id === activeCrewId)) {
      activeCrewId = crews[0].id;
    }

    const cleanState = {
      crews,
      activeCrewId,
      crew: [],
      currentUser: '',
      expenses: [],
      payments: [],
      totalSpend: 0,
      youOwe: 0,
      youGet: 0
    };
    syncActiveCrew(cleanState);
    updateSummary(cleanState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
    return cleanState;
  } catch {
    return initDefaultState();
  }
}

function normalizeCrew(savedCrew) {
  const source = Array.isArray(savedCrew) && savedCrew.length ? savedCrew : DEFAULT_CREW;
  const names = new Set();
  const members = [];
  source.forEach((member) => {
    const rawName = String(member.name || '').trim().slice(0, 30);
    const name = capitalizeName(rawName);
    if (!name || names.has(name.toLowerCase())) return;
    names.add(name.toLowerCase());
    const original = DEFAULT_CREW.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
    const portrait = getMemberPortrait(name, member.portrait || original?.portrait);
    members.push({
      name,
      role: String(member.role || original?.role || 'Crew member').trim().slice(0, 40),
      bounty: String(member.bounty || original?.bounty || '—').trim().slice(0, 40),
      portrait,
    });
  });
  return members.length ? members : DEFAULT_CREW.map((member) => ({ ...member }));
}

function equalShares(amount, members) {
  const baseShare = Math.floor(amount / members.length);
  const remainder = amount % members.length;
  return Object.fromEntries(members.map((member, index) => [member, baseShare + (index < remainder ? 1 : 0)]));
}

function normalizeExpense(expense, roster = crew) {
  const amount = Math.round(Number(expense.amount));
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;

  const savedShares = expense.shares && typeof expense.shares === 'object' ? expense.shares : null;
  const savedMembers = Array.isArray(expense.members)
    ? expense.members
    : savedShares
      ? Object.keys(savedShares)
      : roster.slice(0, Math.max(1, Math.min(roster.length, Number(expense.split) || roster.length))).map((member) => member.name);
  const members = [...new Set(savedMembers.filter((name) => roster.some((member) => member.name === name)))];
  if (!members.length) return null;

  let shares = equalShares(amount, members);
  if (savedShares) {
    const candidate = Object.fromEntries(members.map((member) => [member, Math.round(Number(savedShares[member]))]));
    const candidateTotal = Object.values(candidate).reduce((sum, share) => sum + share, 0);
    if (Object.values(candidate).every((share) => Number.isSafeInteger(share) && share >= 0) && candidateTotal === amount) {
      shares = candidate;
    }
  }

  return {
    ...expense,
    amount,
    payer: roster.some((member) => member.name === expense.payer) ? expense.payer : roster[0].name,
    members,
    shares,
    split: members.length,
  };
}

function normalizePayment(payment, roster = crew) {
  const amount = Math.round(Number(payment.amount));
  const knownMember = (name) => roster.some((member) => member.name === name);
  if (!Number.isSafeInteger(amount) || amount <= 0 || payment.from === payment.to || !knownMember(payment.from) || !knownMember(payment.to)) return null;
  return { id: payment.id || `payment-${Date.now()}`, from: payment.from, to: payment.to, amount };
}

function calculateBalances(targetState = state) {
  const balances = new Map(targetState.crew.map((member) => [member.name, 0]));
  const addMember = (name) => {
    if (!balances.has(name)) balances.set(name, 0);
  };

  targetState.expenses.forEach((expense) => {
    const amount = Math.round(Number(expense.amount) || 0);
    const payer = targetState.crew.some((member) => member.name === expense.payer) ? expense.payer : targetState.currentUser;
    addMember(payer);
    balances.set(payer, balances.get(payer) + amount);
    expense.members.forEach((member) => {
      addMember(member);
      balances.set(member, balances.get(member) - expense.shares[member]);
    });
  });

  targetState.payments.forEach((payment) => {
    if (payment.from === payment.to || !Number.isSafeInteger(payment.amount) || payment.amount <= 0) return;
    addMember(payment.from);
    addMember(payment.to);
    balances.set(payment.from, balances.get(payment.from) + payment.amount);
    balances.set(payment.to, balances.get(payment.to) - payment.amount);
  });

  return balances;
}

function updateSummary(targetState = state) {
  targetState.totalSpend = targetState.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balances = calculateBalances(targetState);
  const currentBalance = balances.get(targetState.currentUser) || 0;
  targetState.youOwe = Math.max(0, -currentBalance);
  targetState.youGet = Math.max(0, currentBalance);
}

function planSettlements(targetState = state) {
  const balances = calculateBalances(targetState);
  const debtors = [...balances].filter(([, balance]) => balance < 0).map(([name, balance]) => ({ name, amount: -balance }));
  const creditors = [...balances].filter(([, balance]) => balance > 0).map(([name, balance]) => ({ name, amount: balance }));
  const plan = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.amount, creditor.amount);
    if (debtor.name !== creditor.name && amount > 0) {
      plan.push({ id: `transfer-${plan.length}`, from: debtor.name, to: creditor.name, amount });
    }
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) debtorIndex += 1;
    if (creditor.amount === 0) creditorIndex += 1;
  }

  return plan;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function persist() {
  try {
    const active = getActiveCrew();
    active.members = crew;
    active.expenses = state.expenses;
    active.payments = state.payments;
    active.currentUser = state.currentUser;
    updateSummary();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast('Browser storage is unavailable. Changes will not persist.', 'error');
  }
}

function expenseRow(expense, includeActions = false) {
  const splitCell = includeActions ? `<td>${Number(expense.split) || 1} crew</td>` : '';
  const actionCell = includeActions
    ? `<td><button class="expense-action-button" type="button" data-delete-expense="${escapeHTML(expense.id)}" aria-label="Delete ${escapeHTML(expense.name)}">Delete</button></td>`
    : '';
  const icon = CATEGORY_ICONS[expense.category] || expense.icon || '💰';
  return `<tr>
    <td><span class="expense-name"><span class="expense-symbol" aria-hidden="true">${escapeHTML(icon)}</span>${escapeHTML(expense.name)}</span></td>
    <td><span class="category-pill" data-category="${escapeHTML(expense.category)}">${escapeHTML(expense.category)}</span></td>
    <td><span class="paid-by">${avatarMarkup(expense.payer)}${escapeHTML(expense.payer)}</span></td>
    ${splitCell}
    <td class="amount-cell">${formatBeli(expense.amount)}</td>
    <td class="date-cell">${escapeHTML(expense.date)}</td>
    ${actionCell}
  </tr>`;
}

function settlementRow(debt, isPayment = false) {
  const settled = isPayment || debt.status === 'settled';
  return `<div class="settlement-row" data-debt="${escapeHTML(debt.id)}">
    <div class="debt-parties">
      <span class="debt-person">${avatarMarkup(debt.from)}<span>${escapeHTML(debt.from)}</span></span>
      <span class="debt-arrow" aria-hidden="true">→</span>
      <span class="debt-person">${avatarMarkup(debt.to)}<span>${escapeHTML(debt.to)}</span></span>
    </div>
    <strong class="debt-amount">${formatBeli(debt.amount)}</strong>
    ${settled ? '<span class="settled-label">SETTLED</span>' : `<button class="settle-button" type="button" data-settle="${escapeHTML(debt.id)}">Settle</button>`}
  </div>`;
}

function switchCrew(crewId) {
  if (state.activeCrewId === crewId) return;
  const target = state.crews.find((c) => c.id === crewId);
  if (!target) return;
  state.activeCrewId = crewId;
  syncActiveCrew();
  persist();
  render();
  animateSummary();
  showToast(`Switched to ${target.name}.`);
}

function openNewCrewDialog() {
  const dialog = document.querySelector('#new-crew-dialog');
  document.querySelector('#new-crew-form').reset();
  document.querySelector('#new-crew-error').hidden = true;
  dialog.showModal();
  window.setTimeout(() => document.querySelector('#new-crew-name').focus(), 20);
}

function closeNewCrewDialog() {
  document.querySelector('#new-crew-dialog').close();
}

function submitNewCrew(event) {
  event.preventDefault();
  const name = document.querySelector('#new-crew-name').value.trim();
  const rawCaptain = document.querySelector('#new-crew-captain').value.trim();
  const captain = capitalizeName(rawCaptain);
  const role = document.querySelector('#new-crew-role').value.trim() || 'Captain';
  const error = document.querySelector('#new-crew-error');

  if (!name) {
    error.textContent = 'Enter a crew name.';
    error.hidden = false;
    return;
  }
  if (state.crews.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    error.textContent = 'A crew with this name already exists.';
    error.hidden = false;
    return;
  }
  if (!captain) {
    error.textContent = 'Enter a captain / first member name.';
    error.hidden = false;
    return;
  }

  const newId = `crew-${Date.now()}`;
  const newCrew = {
    id: newId,
    name,
    members: [{ name: captain, role, bounty: '—', portrait: getMemberPortrait(captain) }],
    expenses: [],
    payments: [],
    currentUser: captain
  };
  state.crews.push(newCrew);
  state.activeCrewId = newId;
  syncActiveCrew();
  persist();
  render();
  animateSummary();
  closeNewCrewDialog();
  showToast(`Assembled ${name}! Welcome aboard, ${captain}.`);
}

function deleteActiveCrew() {
  if (state.crews.length <= 1) {
    showToast('You must keep at least one crew in your ledger.', 'error');
    return;
  }
  const current = getActiveCrew();
  if (!window.confirm(`Disband "${current.name}" and delete all its records?`)) return;
  state.crews = state.crews.filter((c) => c.id !== current.id);
  state.activeCrewId = state.crews[0].id;
  syncActiveCrew();
  persist();
  render();
  animateSummary();
  showToast(`"${current.name}" was disbanded.`);
}

function renderCategoryAnalytics() {
  const barsWrap = document.querySelector('#category-bars-wrap');
  const totalEl = document.querySelector('#category-analytics-total');
  if (!barsWrap) return;

  const categories = [
    { name: 'Food', icon: '🍖', color: '#f59e0b' },
    { name: 'Travel', icon: '🧭', color: '#38bdf8' },
    { name: 'Supplies', icon: '📦', color: '#a855f7' },
    { name: 'Maintenance', icon: '🔧', color: '#10b981' },
    { name: 'Accommodation', icon: '🏠', color: '#ec4899' },
    { name: 'Other', icon: '💰', color: '#94a3b8' }
  ];

  const totals = {};
  categories.forEach((cat) => (totals[cat.name] = 0));
  let grandTotal = 0;

  state.expenses.forEach((e) => {
    const found = categories.some((c) => c.name === e.category);
    const catName = found ? e.category : 'Other';
    totals[catName] = (totals[catName] || 0) + e.amount;
    grandTotal += e.amount;
  });

  if (totalEl) {
    totalEl.textContent = `Total: ${formatBeli(grandTotal)}`;
  }

  barsWrap.innerHTML = categories.map((cat) => {
    const amt = totals[cat.name] || 0;
    const pct = grandTotal > 0 ? Math.min(100, Math.round((amt / grandTotal) * 100)) : 0;
    return `<div class="category-bar-row">
      <div class="category-bar-label">
        <span class="category-icon" aria-hidden="true">${cat.icon}</span>
        <span>${escapeHTML(cat.name)}</span>
      </div>
      <div class="category-meter-track">
        <div class="category-meter-fill" style="width: ${pct}%; background-color: ${cat.color};"></div>
      </div>
      <div class="category-bar-amount">${formatBeli(amt)}</div>
    </div>`;
  }).join('');
}

function exportManifestCSV() {
  const activeCrew = getActiveCrew();
  if (!state.expenses.length) {
    showToast('No expenses logged to export.', 'error');
    return;
  }
  const headers = ['Date', 'Item Name', 'Category', 'Paid By', 'Amount (Cents)', 'Amount (Formatted)', 'Split Count', 'Participants'];
  const rows = state.expenses.map((e) => [
    `"${e.date || ''}"`,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${e.category || ''}"`,
    `"${e.payer || ''}"`,
    e.amount,
    `"${formatBeli(e.amount).replace(/"/g, '""')}"`,
    e.split || 1,
    `"${(e.members || []).join(', ')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${activeCrew.name.toLowerCase().replace(/\s+/g, '_')}_manifest.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Manifest exported to CSV file.');
}

function renderAvatarPicker(currentPortrait = '') {
  selectedAvatarSrc = currentPortrait || '';
  const grid = document.querySelector('#avatar-picker-grid');
  const customInput = document.querySelector('#member-custom-url');
  if (customInput) {
    customInput.value = currentPortrait && !ONE_PIECE_AVATARS.some((a) => a.src === currentPortrait) ? currentPortrait : '';
  }

  if (grid) {
    grid.innerHTML = ONE_PIECE_AVATARS.map((avatar) => {
      const isSelected = selectedAvatarSrc === avatar.src;
      return `<button type="button" class="avatar-pick-option${isSelected ? ' is-selected' : ''}" data-avatar-src="${escapeHTML(avatar.src)}" title="${escapeHTML(avatar.name)}">
        <span class="avatar"><span class="avatar-fallback">${escapeHTML(avatar.name[0])}</span><img src="${escapeHTML(avatar.src)}" alt="${escapeHTML(avatar.name)}" loading="lazy" onerror="this.style.display='none';"></span>
        <span class="avatar-pick-name">${escapeHTML(avatar.name)}</span>
      </button>`;
    }).join('');
  }
}

function applyTheme(isLight) {
  document.documentElement.classList.toggle('theme-light', isLight);
  if (document.body) document.body.classList.toggle('theme-light', isLight);
  const switchBtn = document.querySelector('#theme-switch');
  if (switchBtn) {
    switchBtn.setAttribute('aria-checked', String(isLight));
    switchBtn.setAttribute('title', isLight ? 'Current: Light Theme (Click for Dark)' : 'Current: Dark Theme (Click for Light)');
  }
  try {
    localStorage.setItem('grand-line-theme', isLight ? 'light' : 'dark');
  } catch {}
}

function toggleTheme() {
  const isLight = !document.documentElement.classList.contains('theme-light');
  applyTheme(isLight);
  showToast(isLight ? 'Switched to Light mode.' : 'Switched to Dark mode.');
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundBtn = document.querySelector('#sound-toggle');
  const soundIcon = document.querySelector('#sound-icon');
  if (soundBtn) {
    soundBtn.classList.toggle('is-muted', !soundEnabled);
    soundBtn.setAttribute('title', soundEnabled ? 'Sound Effects: ON (Click to mute)' : 'Sound Effects: MUTED (Click to enable)');
    soundBtn.setAttribute('aria-label', soundEnabled ? 'Sound effects enabled' : 'Sound effects muted');
  }
  if (soundIcon) {
    soundIcon.textContent = soundEnabled ? '🔔' : '🔕';
  }
  if (soundEnabled) {
    playCoinSound();
  }
  showToast(`Sound effects ${soundEnabled ? 'enabled' : 'muted'}.`);
}

function render() {
  const activeCrew = getActiveCrew();
  syncActiveCrew();
  updateSummary();
  const sortedExpenses = [...state.expenses].sort((first, second) => second.createdAt - first.createdAt);
  const filteredExpenses = activeCategoryFilter === 'ALL'
    ? sortedExpenses
    : sortedExpenses.filter((e) => e.category === activeCategoryFilter);

  const settlementPlan = planSettlements();
  const currentMember = crew.find((member) => member.name === state.currentUser) || crew[0];
  state.currentUser = currentMember.name;
  activeCrew.currentUser = currentMember.name;

  const crewSelect = document.querySelector('#active-crew-select');
  if (crewSelect) {
    crewSelect.innerHTML = state.crews.map((c) =>
      `<option value="${escapeHTML(c.id)}"${c.id === state.activeCrewId ? ' selected' : ''}>☠ ${escapeHTML(c.name)}</option>`
    ).join('');
  }
  const crewTitleEl = document.querySelector('#crew-title');
  if (crewTitleEl) {
    crewTitleEl.textContent = activeCrew.name;
  }
  const deleteCrewBtn = document.querySelector('#crew-delete-btn');
  if (deleteCrewBtn) {
    deleteCrewBtn.style.display = state.crews.length > 1 ? 'inline-flex' : 'none';
  }

  document.querySelector('#recent-expense-rows').innerHTML = sortedExpenses.length
    ? sortedExpenses.slice(0, 5).map((expense) => expenseRow(expense)).join('')
    : '<tr><td colspan="5"><div class="table-empty"><span>◈</span><strong>No expenses logged yet</strong><small>Add the first crew expense to begin your ledger.</small></div></td></tr>';

  document.querySelector('#all-expense-rows').innerHTML = filteredExpenses.length
    ? filteredExpenses.map((expense) => expenseRow(expense, true)).join('')
    : `<tr><td colspan="7"><div class="table-empty"><span>◈</span><strong>${activeCategoryFilter === 'ALL' ? 'Your expense ledger is clear' : `No expenses found in "${activeCategoryFilter}"`}</strong><small>Crew expenses matching this category will appear here.</small></div></td></tr>`;

  document.querySelector('#recent-settlements').innerHTML = settlementPlan.length
    ? settlementPlan.slice(0, 5).map((debt) => settlementRow(debt)).join('')
    : '<p class="settlement-empty">No crew debts to settle. Fair winds.</p>';
  document.querySelector('#all-settlements').innerHTML = settlementPlan.length
    ? settlementPlan.map((debt) => settlementRow(debt)).join('')
    : '<p class="settlement-empty">No outstanding debts. Everyone is square.</p>';
  const settledPayments = state.payments || [];
  const settledHistoryEl = document.querySelector('#settled-history');
  if (settledHistoryEl) {
    settledHistoryEl.innerHTML = settledPayments.length
      ? settledPayments.map((payment) => settlementRow(payment, true)).join('')
      : '<p class="settlement-empty">No payments have been recorded yet.</p>';
  }
  const settledCountEl = document.querySelector('#settled-count');
  if (settledCountEl) {
    settledCountEl.textContent = `${String(settledPayments.length).padStart(2, '0')} SETTLED`;
  }

  document.querySelector('#total-spend').textContent = formatBeli(state.totalSpend);
  document.querySelector('#you-owe').textContent = formatBeli(state.youOwe);
  document.querySelector('#you-get').textContent = formatBeli(state.youGet);
  document.querySelector('#active-crew').textContent = String(crew.length).padStart(2, '0');
  document.querySelector('#pending-count').textContent = `${String(settlementPlan.length).padStart(2, '0')} OPEN`;
  document.querySelector('#crew-count').textContent = `${String(crew.length).padStart(2, '0')} MEMBERS`;
  document.querySelector('#profile-name').textContent = currentMember.name;
  document.querySelector('#profile-role').textContent = currentMember.role;
  document.querySelector('#profile-menu-name').textContent = currentMember.name;
  document.querySelector('#profile-menu-role').textContent = `${currentMember.role} · ${activeCrew.name}`;
  const profileAvatar = document.querySelector('#profile-avatar');
  if (profileAvatar) {
    const initials = escapeHTML((currentMember.name || '?').slice(0, 1).toUpperCase());
    const portrait = getMemberPortrait(currentMember.name, currentMember.portrait);
    profileAvatar.innerHTML = portrait
      ? `<span class="avatar-fallback">${initials}</span><img src="${escapeHTML(portrait)}" alt="" onerror="this.style.display='none';">`
      : `<span class="avatar-fallback">${initials}</span>`;
  }

  // Update Category Filter Buttons Active state
  document.querySelectorAll('#category-filters [data-filter]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === activeCategoryFilter);
  });

  // Sync theme toggle switch
  const isLight = document.documentElement.classList.contains('theme-light');
  const switchBtn = document.querySelector('#theme-switch');
  if (switchBtn) {
    switchBtn.setAttribute('aria-checked', String(isLight));
  }

  renderCrew();
  renderCategoryAnalytics();
}

function countUp(element, target, formatter) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = formatter(target);
    return;
  }

  const startedAt = performance.now();
  const duration = 760;
  const tick = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatter(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function animateSummary() {
  countUp(document.querySelector('#total-spend'), state.totalSpend, formatBeli);
  countUp(document.querySelector('#you-owe'), state.youOwe, formatBeli);
  countUp(document.querySelector('#you-get'), state.youGet, formatBeli);
  countUp(document.querySelector('#active-crew'), crew.length, (count) => String(count).padStart(2, '0'));
}

function renderCrew() {
  document.querySelector('#crew-grid').innerHTML = crew.map((member) => `<article class="crew-card">
    ${avatarMarkup(member.name, 'large')}
    <span class="crew-card-copy"><strong>${escapeHTML(member.name)}</strong><small>${escapeHTML(member.role)}</small></span>
    <span class="crew-card-actions">
      <button type="button" data-edit-member="${escapeHTML(member.name)}" aria-label="Edit ${escapeHTML(member.name)}">Edit</button>
      <button type="button" data-remove-member="${escapeHTML(member.name)}" aria-label="Remove ${escapeHTML(member.name)}">×</button>
    </span>
  </article>`).join('');
  document.querySelector('#expense-payer').innerHTML = crew.map((member) => `<option value="${escapeHTML(member.name)}"${member.name === state.currentUser ? ' selected' : ''}>${escapeHTML(member.name)}</option>`).join('');
  document.querySelector('#member-check-grid').innerHTML = crew.map((member) => `<label class="member-option">
    <input type="checkbox" name="members" value="${escapeHTML(member.name)}" checked>
    ${avatarMarkup(member.name)}<span>${escapeHTML(member.name)}</span>
  </label>`).join('');
}

function showToast(message, kind = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast${kind === 'error' ? ' toast-error' : ''}`;
  toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  document.querySelector('#toast-region').append(toast);
  window.setTimeout(() => toast.remove(), 3400);
}

function setView(view) {
  const validViews = ['dashboard', 'crew', 'expenses', 'settlements'];
  if (!validViews.includes(view)) return;

  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === view;
    if (button.classList.contains('nav-item')) {
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  });
  document.querySelectorAll('[data-view-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== view;
  });

  const dashboard = view === 'dashboard';
  document.querySelector('#hero').hidden = !dashboard;
  document.querySelector('#summary-grid').hidden = !dashboard;

  document.querySelector('#view-heading').hidden = dashboard;
  if (!dashboard) document.querySelector('#view-title').textContent = view[0].toUpperCase() + view.slice(1);
  closeMobileMenu();
}

function openExpenseDialog() {
  const dialog = document.querySelector('#expense-dialog');
  document.querySelector('#expense-form').reset();
  document.querySelector('#expense-payer').value = state.currentUser;
  document.querySelector('#form-error').hidden = true;
  setSplitMode('equal');
  renderCustomShares();
  dialog.showModal();
  window.setTimeout(() => document.querySelector('#expense-name').focus(), 20);
}

function closeExpenseDialog() {
  document.querySelector('#expense-dialog').close();
}

function openMemberDialog(memberName = '') {
  const member = crew.find((item) => item.name === memberName);
  const form = document.querySelector('#member-form');
  form.reset();
  document.querySelector('#member-error').hidden = true;
  document.querySelector('#member-original-name').value = member?.name || '';
  document.querySelector('#member-name').value = member?.name || '';
  document.querySelector('#member-role').value = member?.role || '';
  document.querySelector('#member-bounty').value = member?.bounty === '—' ? '' : member?.bounty || '';
  document.querySelector('#member-dialog-title').textContent = member ? 'Edit crew member' : 'Add a crew member';
  document.querySelector('#save-member').innerHTML = `${member ? 'Save changes' : 'Add member'} <span aria-hidden="true">→</span>`;

  renderAvatarPicker(member?.portrait || '');
  document.querySelector('#member-dialog').showModal();
  window.setTimeout(() => document.querySelector('#member-name').focus(), 20);
}

function closeMemberDialog() {
  document.querySelector('#member-dialog').close();
}

function saveMember(event) {
  event.preventDefault();
  const originalName = document.querySelector('#member-original-name').value.trim();
  const rawName = document.querySelector('#member-name').value.trim();
  const name = capitalizeName(rawName);
  const role = document.querySelector('#member-role').value.trim() || 'Crew member';
  const bounty = document.querySelector('#member-bounty').value.trim() || '—';
  const customUrl = document.querySelector('#member-custom-url')?.value.trim();
  const portrait = customUrl || selectedAvatarSrc || getMemberPortrait(name);
  const error = document.querySelector('#member-error');
  const duplicate = crew.some(
    (member) => member.name.toLowerCase() === name.toLowerCase() && member.name.toLowerCase() !== originalName.toLowerCase()
  );

  if (!name) {
    error.textContent = 'Enter a crew member name.';
    error.hidden = false;
    return;
  }
  if (duplicate) {
    error.textContent = 'That name is already in the crew.';
    error.hidden = false;
    return;
  }

  if (originalName) {
    const member = crew.find((item) => item.name.toLowerCase() === originalName.toLowerCase());
    if (!member) return;
    member.name = name;
    member.role = role;
    member.bounty = bounty;
    member.portrait = portrait;
    state.expenses.forEach((expense) => {
      if (expense.payer.toLowerCase() === originalName.toLowerCase()) expense.payer = name;
      expense.members = expense.members.map((participant) =>
        participant.toLowerCase() === originalName.toLowerCase() ? name : participant
      );
      for (const [key, share] of Object.entries(expense.shares)) {
        if (key.toLowerCase() === originalName.toLowerCase() && key !== name) {
          expense.shares[name] = share;
          delete expense.shares[key];
        }
      }
    });
    state.payments.forEach((payment) => {
      if (payment.from.toLowerCase() === originalName.toLowerCase()) payment.from = name;
      if (payment.to.toLowerCase() === originalName.toLowerCase()) payment.to = name;
    });
    if (state.currentUser.toLowerCase() === originalName.toLowerCase()) state.currentUser = name;
  } else {
    crew.push({ name, role, bounty, portrait });
  }

  state.crew = crew;
  persist();
  render();
  closeMemberDialog();
  showToast(originalName ? `${name}'s crew profile was updated.` : `${name} joined the crew.`);
}

function removeMember(name) {
  if (crew.length <= 1) {
    showToast('Keep at least one crew member on board.', 'error');
    return;
  }
  if (state.expenses.some((expense) => expense.payer === name)) {
    showToast(`${name} paid an expense. Rename them or reassign the payer before removing them.`, 'error');
    return;
  }
  if (state.payments.some((payment) => payment.from === name || payment.to === name)) {
    showToast(`${name} is in a recorded settlement. Rename them instead to preserve the ledger.`, 'error');
    return;
  }

  const affectedExpenses = state.expenses.filter((expense) => expense.members.includes(name));
  if (affectedExpenses.some((expense) => expense.members.length <= 1)) {
    showToast(`${name} is the only member on an expense. Add another participant before removing them.`, 'error');
    return;
  }
  if (!window.confirm(`Remove ${name} from the crew? Their expense shares will be redistributed evenly across the remaining participants.`)) return;

  affectedExpenses.forEach((expense) => {
    const removedShare = expense.shares[name] || 0;
    const remainingMembers = expense.members.filter((member) => member !== name);
    const redistributedShares = equalShares(removedShare, remainingMembers);
    remainingMembers.forEach((member) => {
      expense.shares[member] += redistributedShares[member];
    });
    delete expense.shares[name];
    expense.members = remainingMembers;
    expense.split = remainingMembers.length;
  });

  crew = crew.filter((member) => member.name !== name);
  state.crew = crew;
  if (state.currentUser === name) state.currentUser = crew[0].name;
  persist();
  render();
  showToast(`${name} left the crew. Their shares were redistributed.`);
}

function setSplitMode(mode) {
  const custom = mode === 'custom';
  document.querySelectorAll('[data-split-mode]').forEach((button) => {
    const active = button.dataset.splitMode === mode;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#custom-shares').hidden = !custom;
  if (custom) renderCustomShares();
}

function selectedMembers() {
  return [...document.querySelectorAll('input[name="members"]:checked')].map((input) => input.value);
}

function renderCustomShares() {
  const selected = selectedMembers();
  document.querySelector('#custom-share-rows').innerHTML = selected.map((name) => `<label class="custom-share-row">
    <span class="custom-share-name">${avatarMarkup(name)}${escapeHTML(name)}</span>
    <input class="custom-share-input" type="number" min="0" step="0.01" inputmode="decimal" data-share-for="${escapeHTML(name)}" placeholder="฿ 0.00" aria-label="${escapeHTML(name)} share">
  </label>`).join('');
}

function submitExpense(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.querySelector('#expense-name').value.trim();
  const amount = Math.round(Number(document.querySelector('#expense-amount').value) * 100);
  const category = document.querySelector('#expense-category').value;
  const payer = document.querySelector('#expense-payer').value;
  const members = selectedMembers();
  const customMode = document.querySelector('[data-split-mode="custom"]').classList.contains('is-selected');
  const error = document.querySelector('#form-error');

  let validationMessage = '';
  if (!name) validationMessage = 'Give this expense a name.';
  else if (!Number.isSafeInteger(amount) || amount <= 0) validationMessage = 'Enter an amount greater than zero.';
  else if (!members.length) validationMessage = 'Select at least one crew member.';

  let shares = null;
  if (!validationMessage && customMode) {
    shares = Object.fromEntries(members.map((member) => [member, Math.round(Number(document.querySelector(`[data-share-for="${CSS.escape(member)}"]`)?.value) * 100)]));
    const totalShares = Object.values(shares).reduce((sum, share) => sum + (Number.isFinite(share) ? share : 0), 0);
    if (Object.values(shares).some((share) => !Number.isSafeInteger(share) || share < 0) || totalShares !== amount) {
      validationMessage = 'Custom shares must add up to the full expense amount.';
    }
  } else if (!validationMessage) {
    shares = equalShares(amount, members);
  }

  if (validationMessage) {
    error.textContent = validationMessage;
    error.hidden = false;
    return;
  }

  const now = new Date();
  const date = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(now);
  const icon = CATEGORY_ICONS[category] || '💰';
  state.expenses.unshift({ id: `expense-${Date.now()}`, name, category, payer, amount, members, split: members.length, date, icon, createdAt: Date.now(), shares });
  playCoinSound();
  persist();
  render();
  closeExpenseDialog();
  form.reset();
  setSplitMode('equal');
  showToast(`${name} added to the crew ledger.`);
}

function settleDebt(id) {
  const debt = planSettlements().find((item) => item.id === id);
  if (!debt) return;
  state.payments.push({ id: `payment-${Date.now()}`, from: debt.from, to: debt.to, amount: debt.amount });
  playSettleSound();
  persist();
  render();
  showToast(`${debt.from} → ${debt.to} marked as settled.`);
}

function deleteExpense(id) {
  const expense = state.expenses.find((item) => item.id === id);
  if (!expense) return;
  if (!window.confirm(`Delete expense "${expense.name}"?`)) return;
  state.expenses = state.expenses.filter((item) => item.id !== id);
  persist();
  render();
  showToast(`"${expense.name}" removed from the ledger.`);
}

function closeMobileMenu() {
  document.querySelector('#sidebar').classList.remove('is-open');
  document.querySelector('#sidebar-scrim').hidden = true;
  document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) setView(viewButton.dataset.view);

  if (event.target.closest('[data-open-expense]')) openExpenseDialog();

  const deleteExpenseButton = event.target.closest('[data-delete-expense]');
  if (deleteExpenseButton) deleteExpense(deleteExpenseButton.dataset.deleteExpense);

  if (event.target.closest('[data-open-member]')) openMemberDialog();

  const editMemberButton = event.target.closest('[data-edit-member]');
  if (editMemberButton) openMemberDialog(editMemberButton.dataset.editMember);

  const removeMemberButton = event.target.closest('[data-remove-member]');
  if (removeMemberButton) removeMember(removeMemberButton.dataset.removeMember);

  const settleButton = event.target.closest('[data-settle]');
  if (settleButton) settleDebt(settleButton.dataset.settle);

  const splitButton = event.target.closest('[data-split-mode]');
  if (splitButton) setSplitMode(splitButton.dataset.splitMode);

  // Avatar pick option
  const avatarPickOption = event.target.closest('.avatar-pick-option');
  if (avatarPickOption) {
    selectedAvatarSrc = avatarPickOption.dataset.avatarSrc;
    document.querySelectorAll('.avatar-pick-option').forEach((opt) => {
      opt.classList.toggle('is-selected', opt === avatarPickOption);
    });
    const customInput = document.querySelector('#member-custom-url');
    if (customInput) customInput.value = '';
  }

  // Category filters
  const filterBtn = event.target.closest('#category-filters [data-filter]');
  if (filterBtn) {
    activeCategoryFilter = filterBtn.dataset.filter;
    render();
  }

  // Export CSV
  if (event.target.closest('#export-csv-btn')) {
    exportManifestCSV();
  }

  // Print receipt
  if (event.target.closest('#print-ledger-btn')) {
    window.print();
  }

  // Sound toggle button
  if (event.target.closest('#sound-toggle')) {
    toggleSound();
  }

  // Theme switch toggle
  if (event.target.closest('#theme-switch') || event.target.closest('#theme-toggle')) {
    toggleTheme();
  }

  if (event.target.closest('#profile-trigger')) {
    const trigger = document.querySelector('#profile-trigger');
    const menu = document.querySelector('#profile-menu');
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    trigger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  } else if (!event.target.closest('#profile-menu')) {
    document.querySelector('#profile-trigger').setAttribute('aria-expanded', 'false');
    document.querySelector('#profile-menu').hidden = true;
  }

  const logoutLink = event.target.closest('a[href="/"]');
  if (logoutLink) {
    try {
      sessionStorage.removeItem('grand-line-auth');
      localStorage.removeItem('grand-line-auth');
    } catch {}
  }

  if (event.target.closest('#open-new-crew') || event.target.closest('#crew-new-btn')) openNewCrewDialog();
  if (event.target.closest('#crew-delete-btn')) deleteActiveCrew();

  if (event.target.closest('#notifications')) showToast('All caught up. The crew is sailing smoothly.');

  if (event.target.closest('#mobile-menu')) {
    const sidebar = document.querySelector('#sidebar');
    const open = !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', open);
    document.querySelector('#sidebar-scrim').hidden = !open;
    document.querySelector('#mobile-menu').setAttribute('aria-expanded', String(open));
  }
  if (event.target.closest('#sidebar-scrim')) closeMobileMenu();
});

document.querySelector('#currency-select')?.addEventListener('change', (event) => {
  activeCurrency = event.target.value;
  render();
  animateSummary();
  showToast(`Currency converted to ${CURRENCY_CONFIG[activeCurrency].name}.`);
});

document.querySelector('#expense-form').addEventListener('submit', submitExpense);
document.querySelector('#close-expense').addEventListener('click', closeExpenseDialog);
document.querySelector('#cancel-expense').addEventListener('click', closeExpenseDialog);

document.querySelector('#member-form').addEventListener('submit', saveMember);
document.querySelector('#close-member').addEventListener('click', closeMemberDialog);
document.querySelector('#cancel-member').addEventListener('click', closeMemberDialog);
document.querySelector('#member-custom-url')?.addEventListener('input', (e) => {
  if (e.target.value.trim()) {
    selectedAvatarSrc = e.target.value.trim();
    document.querySelectorAll('.avatar-pick-option').forEach((opt) => opt.classList.remove('is-selected'));
  }
});

document.querySelector('#member-name')?.addEventListener('input', (e) => {
  const customInput = document.querySelector('#member-custom-url');
  if (customInput && customInput.value.trim()) return;
  const typed = e.target.value.trim().toLowerCase();
  if (!typed) return;
  const matched = ONE_PIECE_AVATARS.find(
    (a) => typed === a.name.toLowerCase() || typed.includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(typed)
  );
  if (matched) {
    selectedAvatarSrc = matched.src;
    document.querySelectorAll('.avatar-pick-option').forEach((opt) => {
      opt.classList.toggle('is-selected', opt.dataset.avatarSrc === matched.src);
    });
  }
});

document.querySelector('#member-check-grid').addEventListener('change', () => {
  if (document.querySelector('[data-split-mode="custom"]').classList.contains('is-selected')) renderCustomShares();
});
document.querySelector('#expense-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeExpenseDialog();
});
document.querySelector('#member-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeMemberDialog();
});
document.querySelector('#active-crew-select')?.addEventListener('change', (event) => switchCrew(event.target.value));
document.querySelector('#new-crew-form')?.addEventListener('submit', submitNewCrew);
document.querySelector('#close-new-crew')?.addEventListener('click', closeNewCrewDialog);
document.querySelector('#cancel-new-crew')?.addEventListener('click', closeNewCrewDialog);
document.querySelector('#new-crew-dialog')?.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeNewCrewDialog();
});

// Initial render & sync
const isInitialLight = localStorage.getItem('grand-line-theme') === 'light';
applyTheme(isInitialLight);
render();
animateSummary();