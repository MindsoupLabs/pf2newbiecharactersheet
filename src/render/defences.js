import { signed } from '../compute.js';
import { escape } from './escape.js';

export function renderDefences(model) {
  const el = document.createElement('section');
  el.className = 'panel panel-defences';
  el.innerHTML = `
    <div class="panel-title def-title">DEFENCES</div>
    <div class="def-row">
      <div class="def-cell">
        <div class="def-label">AC</div>
        <span class="pill-grn-lg">${model.ac}</span>
        <div class="def-armor">${escape(model.armorName)}</div>
      </div>
      <div class="def-divider"></div>
      ${saveCell('FORT', model.saves.fort)}
      ${saveCell('REFLEX', model.saves.reflex)}
      ${saveCell('WILL', model.saves.will)}
    </div>
    <div class="hp-row">
      ${hpCell('MAX HP', model.hp.max, 'data-hp-max')}
      ${hpCell('CURRENT', model.hp.max, 'data-hp-current')}
      ${hpCell('TEMP', '', 'data-hp-temp')}
    </div>
  `;
  return el;
}

function saveCell(label, save) {
  const badge = save.rank
    ? `<span class="prof-badge" style="background:#0f2e0f;">${save.rank}</span>`
    : '';
  return `
    <div class="def-cell">
      <div class="def-label">${label}</div>
      <span class="pill-wrap">
        <span class="pill-grn">${signed(save.total)}</span>
        ${badge}
      </span>
    </div>
  `;
}

function hpCell(label, value, attr) {
  return `
    <div class="def-cell">
      <div class="def-label">${label}</div>
      <span class="pill-grn hp-pill" ${attr}>${value === '' ? '&nbsp;' : value}</span>
    </div>
  `;
}
