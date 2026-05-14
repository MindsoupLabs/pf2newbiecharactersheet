import { abilityMod, hpTotal, saveTotal, perceptionTotal, classDC,
         skillTotal, sumSkillMods, rankLabel } from './compute.js';

const SKILL_KEYS = {
  Acrobatics: 'dex', Arcana: 'int', Athletics: 'str', Crafting: 'int',
  Deception: 'cha', Diplomacy: 'cha', Intimidation: 'cha', Medicine: 'wis',
  Nature: 'wis', Occultism: 'int', Performance: 'cha', Religion: 'wis',
  Society: 'int', Stealth: 'dex', Survival: 'wis', Thievery: 'dex',
};

export function parseCharacter(json) {
  const b = json.build ?? json;
  const level = b.level;
  const abilities = {
    str: abilityMod(b.abilities.str), dex: abilityMod(b.abilities.dex),
    con: abilityMod(b.abilities.con), int: abilityMod(b.abilities.int),
    wis: abilityMod(b.abilities.wis), cha: abilityMod(b.abilities.cha),
  };

  const prof = b.proficiencies;
  const mods = b.mods ?? {};

  const saves = {
    fort:   { total: saveTotal(abilities.con, prof.fortitude, level), rank: rankLabel(prof.fortitude) },
    reflex: { total: saveTotal(abilities.dex, prof.reflex,    level), rank: rankLabel(prof.reflex) },
    will:   { total: saveTotal(abilities.wis, prof.will,      level), rank: rankLabel(prof.will) },
  };

  const percItem = sumSkillMods(mods, 'Perception');
  const perception = {
    total: perceptionTotal(abilities.wis, prof.perception, level, percItem),
    rank: rankLabel(prof.perception),
  };

  const skills = Object.entries(SKILL_KEYS).map(([name, key]) => {
    const rank = prof[name.toLowerCase()] ?? 0;
    const item = sumSkillMods(mods, name);
    const total = skillTotal(abilities[key], rank, level, item);
    return { name, total, rank: rankLabel(rank) };
  });

  // Lores: build.lores is [[name, rank], ...]. Lore key ability is INT.
  for (const [name, rank] of (b.lores ?? [])) {
    const item = sumSkillMods(mods, name);
    skills.push({
      name: `${name} Lore`,
      total: skillTotal(abilities.int, rank, level, item),
      rank: rankLabel(rank),
    });
  }

  const weapons = (b.weapons ?? []).map(w => ({
    display: w.display,
    baseName: w.name,
    attackBonus: w.attack,
    damage: formatDamage(w),
    damageType: w.damageType,
  }));

  const feats = (b.feats ?? []).map(([name, _ignore, type, gainedAtLevel]) => ({
    name, type, level: gainedAtLevel,
  }));

  const features = b.specials ?? [];

  const equipment = (b.equipment ?? []).map(([name, qty]) => ({ name, qty }));

  return {
    name: b.name,
    class: b.class,
    level,
    ancestry: b.ancestry,
    heritage: b.heritage,
    background: b.background,
    size: b.sizeName,
    abilities,
    hp: { max: hpTotal(b.attributes, abilities.con, level) },
    ac: b.acTotal?.acTotal ?? 10,
    armorName: b.armor?.[0]?.name ?? 'unarmored',
    speed: b.attributes.speed,
    senses: deriveSenses(features),
    saves,
    perception,
    classDC: classDC(abilities[b.keyability], prof.classDC, level),
    skills,
    weapons,
    feats,
    features,
    equipment,
  };
}

function formatDamage(weapon) {
  // Pathbuilder doesn't give a final damage string — we synthesise one.
  // Striking adds a die. For melee with strength: damage = nDX + strMod
  // For now we present "{n}d{X} {type}" without the str mod since it's already factored
  // into Pathbuilder's attack number; a full damage formula is out of scope for MVP.
  const numDice = weapon.str === 'striking' ? 2
                : weapon.str === 'greaterStriking' ? 3
                : weapon.str === 'majorStriking' ? 4 : 1;
  return `${numDice}${weapon.die} ${weapon.damageType}`;
}

function deriveSenses(features) {
  const result = [];
  if (features.includes('Darkvision')) result.push('Darkvision');
  if (features.includes('Low-Light Vision')) result.push('Low-Light Vision');
  return result;
}
