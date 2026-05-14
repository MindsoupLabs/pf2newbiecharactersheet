import { escape } from './escape.js';

export function renderHeader(model) {
  const el = document.createElement('div');
  el.className = 'panel-header';
  el.innerHTML = `
    <div>
      <div class="char-name">${escape(model.name)}</div>
      <div class="char-subtitle">${escape(model.heritage)} ${escape(model.ancestry)} · ${escape(model.background)} · ${escape(model.size)}</div>
    </div>
    <div class="header-stat">
      <div class="header-label">CLASS</div>
      <div class="header-class">${escape(model.class)}</div>
    </div>
    <div class="header-stat">
      <div class="header-label">LEVEL</div>
      <div class="header-level">${model.level}</div>
    </div>
    <div class="header-stat header-hero">
      <div class="header-label">HERO PTS</div>
      <div class="hero-pips" data-hero-pips>⬢ ⬡ ⬡</div>
    </div>
  `;
  return el;
}

