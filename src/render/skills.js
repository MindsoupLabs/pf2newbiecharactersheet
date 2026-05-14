import { signed } from '../compute.js';
import { escape } from './escape.js';

export function renderSkills(model) {
  const el = document.createElement('section');
  el.className = 'panel panel-skills';
  const rows = model.skills.map(s => {
    const isTrained = s.rank !== null;
    const nameClass = isTrained ? 'skill-name skill-trained' : 'skill-name';
    const badge = s.rank
      ? `<span class="prof-badge" style="background:#0d2a3a;">${s.rank}</span>`
      : '';
    return `
      <div class="${nameClass}">${escape(s.name)}</div>
      <div><span class="pill-wrap"><span class="pill-blu">${signed(s.total)}</span>${badge}</span></div>
    `;
  }).join('');
  el.innerHTML = `
    <div class="panel-title sk-title">SKILLS</div>
    <div class="skills-grid">${rows}</div>
  `;
  return el;
}
