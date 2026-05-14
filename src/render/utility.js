import { signed } from '../compute.js';
import { escape } from './escape.js';

export function renderUtility(model) {
  const el = document.createElement('section');
  el.className = 'panel panel-utility';
  const percBadge = model.perception.rank
    ? `<span class="prof-badge" style="background:#5a4500;">${model.perception.rank}</span>`
    : '';
  const senses = model.senses.length
    ? `<div class="util-senses"><b>Senses:</b> ${model.senses.map(escape).join(', ')}</div>`
    : '';
  el.innerHTML = `
    <div class="panel-title util-title">UTILITY</div>
    <div class="util-row">
      <div class="util-cell">
        <div class="util-label">PERCEPTION</div>
        <span class="pill-wrap"><span class="pill-yel">${signed(model.perception.total)}</span>${percBadge}</span>
      </div>
      <div class="util-cell">
        <div class="util-label">SPEED</div>
        <span class="pill-yel">${model.speed} ft</span>
      </div>
    </div>
    ${senses}
  `;
  return el;
}
