const KEY = id => `pf2e-sheet:state:${id}`;

export function loadState(id, defaults) {
  try {
    const merged = { ...defaults, ...JSON.parse(localStorage.getItem(KEY(id)) ?? '{}') };
    // Coerce values to safe types so stale/corrupt storage can't inject unexpected values
    if (!Number.isFinite(merged.currentHP)) merged.currentHP = defaults.currentHP;
    merged.heroPoints = Math.min(3, Math.max(0, Math.round(Number(merged.heroPoints) || 0)));
    if (merged.tempHP !== '' && !Number.isFinite(Number(merged.tempHP))) merged.tempHP = '';
    return merged;
  } catch { return { ...defaults }; }
}

export function saveState(id, state) {
  localStorage.setItem(KEY(id), JSON.stringify(state));
}

const PIPS = { 0: '⬡ ⬡ ⬡', 1: '⬢ ⬡ ⬡', 2: '⬢ ⬢ ⬡', 3: '⬢ ⬢ ⬢' };

export function wireEdit(rootEl, id, model) {
  const state = loadState(id, {
    currentHP: model.hp.max,
    tempHP: '',
    heroPoints: 1,
  });

  const cur = rootEl.querySelector('[data-hp-current]');
  const tmp = rootEl.querySelector('[data-hp-temp]');
  const hero = rootEl.querySelector('[data-hero-pips]');

  // Initial paint — use textContent to avoid innerHTML for state values
  cur.textContent = state.currentHP;
  if (state.tempHP === '') {
    tmp.innerHTML = '&nbsp;';
  } else {
    tmp.textContent = state.tempHP;
  }
  hero.textContent = PIPS[state.heroPoints];

  const editPill = (el, key, allowEmpty = false) => {
    el.style.cursor = 'text';
    el.title = 'Click to edit';
    el.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = state[key] === '' ? '' : state[key];
      input.style.width = '50px';
      el.replaceWith(input);
      input.focus();
      const commit = () => {
        const raw = input.value.trim();
        const v = raw === '' && allowEmpty ? '' : Number(raw);
        if (raw !== '' && Number.isNaN(v)) { input.replaceWith(el); return; }
        state[key] = v;
        saveState(id, state);
        el.innerHTML = v === '' ? '&nbsp;' : v;
        input.replaceWith(el);
      };
      input.addEventListener('blur', commit);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); });
    });
  };

  editPill(cur, 'currentHP');
  editPill(tmp, 'tempHP', true);

  hero.style.cursor = 'pointer';
  hero.title = 'Click to cycle hero points (0–3)';
  hero.addEventListener('click', () => {
    state.heroPoints = (state.heroPoints + 1) % 4;
    saveState(id, state);
    hero.textContent = PIPS[state.heroPoints];
  });
}

