import { signed } from '../compute.js';
import { escape } from './escape.js';

export function renderAttacks(model, weaponMeta = {}) {
  const el = document.createElement('section');
  el.className = 'panel panel-attacks';
  const weaponCards = model.weapons.map(w => {
    const meta = weaponMeta[w.baseName] ?? {};
    const traitList = meta.traits ?? [];
    const traits = traitList.join(', ') || 'no traits data';
    const range = meta.range ?? 'melee';
    const map = traitList.includes('agile') ? 4 : 5;
    const a1 = w.attackBonus;
    const a2 = a1 - map;
    const a3 = a1 - 2 * map;
    return `
      <div class="weapon-card">
        <div class="weapon-name">${escape(w.display)}</div>
        <div class="weapon-stats">
          <span class="weapon-attacks">attacks:
            <span class="atk-step"><span class="atk-ord">1st</span><span class="pill-red">${signed(a1)}</span></span>
            <span class="atk-step"><span class="atk-ord">2nd</span><span class="pill-red">${signed(a2)}</span></span>
            <span class="atk-step"><span class="atk-ord">3rd</span><span class="pill-red">${signed(a3)}</span></span>
          </span>
          <span>damage: <span class="pill-red">${escape(w.damage)}</span></span>
        </div>
        <div class="weapon-traits">${escape(range)} · ${escape(traits)}</div>
      </div>
    `;
  }).join('');
  el.innerHTML = `
    <div class="atk-header">
      <div class="panel-title atk-title">ATTACKS</div>
      <div class="atk-cdc">
        <div class="cdc-label">CLASS DC</div>
        <span class="pill-red-lg">${model.classDC}</span>
      </div>
    </div>
    ${weaponCards}
  `;
  return el;
}
