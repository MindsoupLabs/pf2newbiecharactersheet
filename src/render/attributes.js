import { signed } from '../compute.js';

const KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function renderAttributes(model) {
  const el = document.createElement('section');
  el.className = 'panel panel-attributes';
  el.innerHTML = `
    <div class="panel-title attr-title">ATTRIBUTES</div>
    <div class="attr-grid">
      ${KEYS.map(k => `
        <div class="attr-cell">
          <div class="attr-label">${k.toUpperCase()}</div>
          <div class="attr-mod">${signed(model.abilities[k])}</div>
        </div>
      `).join('')}
    </div>
  `;
  return el;
}
