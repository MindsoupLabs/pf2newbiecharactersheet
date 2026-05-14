export function abilityMod(score) {
  return Math.floor((score - 10) / 2);
}

export function profBonus(rank, level) {
  return rank === 0 ? 0 : rank + level;
}

export function signed(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function hpTotal(attrs, conMod, level) {
  const { ancestryhp, classhp, bonushp = 0, bonushpPerLevel = 0 } = attrs;
  return ancestryhp + (classhp + conMod + bonushpPerLevel) * level + bonushp;
}

export function saveTotal(abilityMod, rank, level) {
  return abilityMod + profBonus(rank, level);
}

export function perceptionTotal(wisMod, rank, level, itemBonus = 0) {
  return wisMod + profBonus(rank, level) + itemBonus;
}

export function classDC(keyMod, rank, level) {
  return 10 + keyMod + profBonus(rank, level);
}

export function sumSkillMods(mods, skillName) {
  const entry = mods?.[skillName];
  if (!entry) return 0;
  return Object.values(entry).reduce((acc, v) => acc + (typeof v === 'number' ? v : 0), 0);
}

export function skillTotal(abilityMod, rank, level, modsBonus = 0) {
  return abilityMod + profBonus(rank, level) + modsBonus;
}

export function rankLabel(rank) {
  return ({ 2: 'T', 4: 'E', 6: 'M', 8: 'L' })[rank] ?? null;
}
