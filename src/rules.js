// Loads bundled rules data. Falls back to empty objects if files are missing
// (so the page still renders, just without descriptions).
export async function loadRules() {
  const tryLoad = async (path) => {
    try { return await (await fetch(path)).json(); } catch { return {}; }
  };
  return {
    feats:    await tryLoad('./data/feats.json'),
    features: await tryLoad('./data/features.json'),
    weapons:  await tryLoad('./data/weapons.json'),
  };
}
