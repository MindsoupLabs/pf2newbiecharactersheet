import { escape } from './escape.js';

const FEAT_TYPE_ORDER = [
  'Class Feature', 'Class Feat', 'Ancestry Feat',
  'Skill Feat', 'General Feat', 'Heritage', 'Archetype Feat', 'Bard Feat',
];

export function renderAbilities(model, rules) {
  const el = document.createElement('section');
  el.className = 'panel panel-abilities';

  const items = [
    // Features → pseudo-feats with type "Class Feature"
    ...model.features.map(name => ({
      name, type: 'Class Feature',
      meta: rules.features?.[name] ?? null,
    })),
    ...model.feats.map(f => ({
      name: f.name, type: f.type,
      meta: rules.feats?.[f.name] ?? null,
    })),
  ];

  // Filter: hide if known and isPassive=true. Show if unknown (with a hint).
  const visible = items.filter(i => !(i.meta && i.meta.isPassive === true));

  // Group by type, in canonical order
  const groups = {};
  for (const i of visible) (groups[i.type] ??= []).push(i);

  // Show known types in canonical order, then any leftover types so unknown
  // categories don't get silently dropped.
  const orderedTypes = [
    ...FEAT_TYPE_ORDER.filter(t => groups[t]?.length),
    ...Object.keys(groups).filter(t => !FEAT_TYPE_ORDER.includes(t)),
  ];
  const sections = orderedTypes.map(t => `
      <div class="ab-group-title">${escape(t)}s</div>
      ${groups[t].map(i => abilityLine(i)).join('')}
    `).join('');

  el.innerHTML = `
    <div class="panel-title ab-title">ABILITIES — actions &amp; conditional</div>
    ${sections}
  `;
  return el;
}

function abilityLine(item) {
  if (!item.meta) {
    return `<div class="ab-line"><b>${escape(item.name)}</b> — <i>(unknown — check the rulebook)</i></div>`;
  }
  const action = item.meta.actionCost ? ` ${actionGlyph(item.meta.actionCost)}` : '';
  // item.meta.description comes from a bundled data file we author — interpolated raw
  // so authors can include light HTML (e.g. <i> for spell names).
  return `<div class="ab-line"><b>${escape(item.name)}</b>${action} — ${item.meta.description}</div>`;
}

function actionGlyph(cost) {
  return ({ '1': '◆', '2': '◆◆', '3': '◆◆◆', 'reaction': '↺', 'free': '◇' })[cost] ?? '';
}
