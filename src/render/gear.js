import { escape } from './escape.js';

export function renderGear(model) {
  const el = document.createElement('section');
  el.className = 'panel panel-gear';
  const items = model.equipment
    .map(i => i.qty > 1 ? `${escape(i.name)} ×${i.qty}` : escape(i.name))
    .join(' · ');
  el.innerHTML = `
    <div class="panel-title gear-title">GEAR</div>
    <div class="gear-list">${items}</div>
  `;
  return el;
}
