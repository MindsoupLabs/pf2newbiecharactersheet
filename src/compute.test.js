import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abilityMod } from './compute.js';

test('abilityMod: 10 → +0', () => assert.equal(abilityMod(10), 0));
test('abilityMod: 16 → +3', () => assert.equal(abilityMod(16), 3));
test('abilityMod: 9  → -1', () => assert.equal(abilityMod(9), -1));
test('abilityMod: 20 → +5', () => assert.equal(abilityMod(20), 5));
test('abilityMod: 7  → -2', () => assert.equal(abilityMod(7), -2));

import { profBonus, signed } from './compute.js';

test('profBonus: untrained (0) → 0', () => assert.equal(profBonus(0, 5), 0));
test('profBonus: trained (2) at lv 5 → 7', () => assert.equal(profBonus(2, 5), 7));
test('profBonus: expert (4) at lv 7 → 11', () => assert.equal(profBonus(4, 7), 11));
test('profBonus: master (6) at lv 1 → 7', () => assert.equal(profBonus(6, 1), 7));
test('profBonus: legendary (8) at lv 20 → 28', () => assert.equal(profBonus(8, 20), 28));

test('signed: 5  → "+5"',  () => assert.equal(signed(5), '+5'));
test('signed: -2 → "-2"',  () => assert.equal(signed(-2), '-2'));
test('signed: 0  → "+0"',  () => assert.equal(signed(0), '+0'));

import { hpTotal, saveTotal, perceptionTotal, classDC } from './compute.js';

test('hpTotal: Roach example', () => {
  // ancestryhp 8, classhp 8, bonushp 0, bonushpPerLevel 1, conMod +1, level 7
  // = 8 + (8 + 1 + 1) * 7 + 0 = 78
  assert.equal(hpTotal({ ancestryhp: 8, classhp: 8, bonushp: 0, bonushpPerLevel: 1 }, 1, 7), 78);
});

test('saveTotal: Roach FORT (con +1, expert (4), lv 7)', () => {
  assert.equal(saveTotal(1, 4, 7), 12);
});
test('saveTotal: Roach REFLEX (dex +2, trained (2), lv 7)', () => {
  assert.equal(saveTotal(2, 2, 7), 11);
});
test('saveTotal: untrained save still gets ability mod', () => {
  assert.equal(saveTotal(3, 0, 5), 3);
});

test('perceptionTotal: Roach (wis +5, expert (4), lv 7, +1 untyped)', () => {
  assert.equal(perceptionTotal(5, 4, 7, 1), 17);
});

test('classDC: Roach (key wis +5, trained (2), lv 7)', () => {
  // 10 + 5 + 9 = 24
  assert.equal(classDC(5, 2, 7), 24);
});

import { sumSkillMods, skillTotal } from './compute.js';

test('sumSkillMods: missing skill → 0', () => {
  assert.equal(sumSkillMods({}, 'Medicine'), 0);
});
test('sumSkillMods: single bonus', () => {
  assert.equal(sumSkillMods({ Medicine: { 'Item Bonus': 1 } }, 'Medicine'), 1);
});
test('sumSkillMods: multiple bonuses sum', () => {
  assert.equal(sumSkillMods({ Stealth: { 'Item Bonus': 2, 'Circumstance Bonus': 1 } }, 'Stealth'), 3);
});

test('skillTotal: Roach Medicine (wis +5, expert (4), lv 7, +1 item)', () => {
  // 5 + 11 + 1 = 17
  assert.equal(skillTotal(5, 4, 7, 1), 17);
});
test('skillTotal: untrained skill still uses ability mod', () => {
  assert.equal(skillTotal(2, 0, 7, 0), 2);
});

import { rankLabel } from './compute.js';

test('rankLabel: 0 → null', () => assert.equal(rankLabel(0), null));
test('rankLabel: 2 → T',    () => assert.equal(rankLabel(2), 'T'));
test('rankLabel: 4 → E',    () => assert.equal(rankLabel(4), 'E'));
test('rankLabel: 6 → M',    () => assert.equal(rankLabel(6), 'M'));
test('rankLabel: 8 → L',    () => assert.equal(rankLabel(8), 'L'));
