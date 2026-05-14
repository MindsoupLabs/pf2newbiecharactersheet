import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseCharacter } from './pathbuilder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const exampleJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'example_character.json'), 'utf8')
);

test('parseCharacter: identity fields', () => {
  const c = parseCharacter(exampleJson);
  assert.equal(c.name, 'Roach (Bard) remaster');
  assert.equal(c.class, 'Cleric');
  assert.equal(c.level, 7);
  assert.equal(c.ancestry, 'Human');
  assert.equal(c.heritage, 'Tiefling');
  assert.equal(c.background, 'Cultist');
  assert.equal(c.size, 'Medium');
});

test('parseCharacter: ability modifiers', () => {
  const c = parseCharacter(exampleJson);
  assert.deepEqual(c.abilities, { str: 0, dex: 2, con: 1, int: 1, wis: 5, cha: 4 });
});

test('parseCharacter: HP, AC, speed', () => {
  const c = parseCharacter(exampleJson);
  assert.equal(c.hp.max, 78);
  assert.equal(c.ac, 22);
  assert.equal(c.speed, 25);
});

test('parseCharacter: saves include rank labels', () => {
  const c = parseCharacter(exampleJson);
  assert.deepEqual(c.saves.fort, { total: 12, rank: 'E' });
  assert.deepEqual(c.saves.reflex, { total: 11, rank: 'T' });
  assert.deepEqual(c.saves.will, { total: 16, rank: 'E' });
});

test('parseCharacter: perception with untyped bonus', () => {
  const c = parseCharacter(exampleJson);
  assert.deepEqual(c.perception, { total: 17, rank: 'E' });
});

test('parseCharacter: class DC', () => {
  const c = parseCharacter(exampleJson);
  assert.equal(c.classDC, 24);
});

test('parseCharacter: skills include trained ones with rank label and lores', () => {
  const c = parseCharacter(exampleJson);
  const medicine = c.skills.find(s => s.name === 'Medicine');
  assert.deepEqual(medicine, { name: 'Medicine', total: 17, rank: 'E' });
  const cultLore = c.skills.find(s => s.name === 'Cult Lore');
  assert.deepEqual(cultLore, { name: 'Cult Lore', total: 10, rank: 'T' });
  const acro = c.skills.find(s => s.name === 'Acrobatics');
  assert.deepEqual(acro, { name: 'Acrobatics', total: 2, rank: null });
});

test('parseCharacter: weapons', () => {
  const c = parseCharacter(exampleJson);
  assert.equal(c.weapons.length, 4);
  const scimitar = c.weapons[0];
  assert.equal(scimitar.display, '+1 Striking Scimitar');
  assert.equal(scimitar.baseName, 'Scimitar');
  assert.equal(scimitar.attackBonus, 10);
  assert.equal(scimitar.damageType, 'S');
});

test('parseCharacter: feats grouped by type', () => {
  const c = parseCharacter(exampleJson);
  assert.ok(c.feats.some(f => f.name === 'Bon Mot' && f.type === 'Skill Feat'));
  assert.ok(c.feats.some(f => f.name === 'Reach Spell' && f.type === 'Class Feat'));
});

test('parseCharacter: features (specials)', () => {
  const c = parseCharacter(exampleJson);
  assert.ok(c.features.includes('Healing Font'));
  assert.ok(c.features.includes('Domain: Sun'));
});

test('parseCharacter: equipment with quantities', () => {
  const c = parseCharacter(exampleJson);
  const torch = c.equipment.find(i => i.name === 'Torch');
  assert.equal(torch.qty, 5);
});
