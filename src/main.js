import { getIdFromUrl, loadCharacterJson, showPasteFallback } from './loader.js';
import { loadRules } from './rules.js';
import { parseCharacter } from './pathbuilder.js';
import { renderHeader } from './render/header.js';
import { renderAttributes } from './render/attributes.js';
import { renderDefences } from './render/defences.js';
import { renderUtility } from './render/utility.js';
import { renderSkills } from './render/skills.js';
import { renderAttacks } from './render/attacks.js';
import { renderAbilities } from './render/abilities.js';
import { renderGear } from './render/gear.js';
import { wireEdit } from './edit.js';

const app = document.getElementById('app');
const id = getIdFromUrl();

async function mount(json) {
  const rules = await loadRules();
  const model = parseCharacter(json);
  app.innerHTML = '';
  app.appendChild(renderHeader(model));
  const body = document.createElement('div');
  body.className = 'sheet-body';
  const col1 = make('div', 'sheet-col col-1');
  const col2 = make('div', 'sheet-col col-2');
  const col3 = make('div', 'sheet-col col-3');
  col1.append(renderAttributes(model), renderUtility(model), renderSkills(model));
  col2.append(renderDefences(model), renderAttacks(model, rules.weapons));
  col3.append(renderAbilities(model, rules), renderGear(model));
  body.append(col1, col2, col3);
  app.appendChild(body);
  if (id) wireEdit(app, id, model);
}
function make(tag, cls) { const el = document.createElement(tag); el.className = cls; return el; }

if (!id) {
  app.appendChild(showPasteFallback(null, mount));
} else {
  try {
    const json = await loadCharacterJson(id);
    await mount(json);
  } catch (err) {
    console.warn('Load failed, showing paste fallback:', err);
    app.appendChild(showPasteFallback(id, mount));
  }
}
