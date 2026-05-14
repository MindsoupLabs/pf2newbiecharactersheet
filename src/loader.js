const STORAGE_KEY = id => `pf2e-sheet:json:${id}`;

const isValidId = id => /^[0-9]+$/.test(id ?? '');

export function getIdFromUrl() {
  const raw = new URL(location.href).searchParams.get('id');
  return isValidId(raw) ? raw : null;
}

export async function loadCharacterJson(id) {
  if (!isValidId(id)) throw new Error('Invalid Pathbuilder ID');

  // Try cache first (instant; will be refreshed by network attempt below)
  const cached = localStorage.getItem(STORAGE_KEY(id));

  // Try network. On success, update cache and return.
  try {
    const res = await fetch(`https://pathbuilder2e.com/json.php?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error('Pathbuilder returned success=false');
    localStorage.setItem(STORAGE_KEY(id), JSON.stringify(json));
    return json;
  } catch (networkErr) {
    if (cached) return JSON.parse(cached);
    throw networkErr;
  }
}

export function showPasteFallback(id, onLoaded) {
  const validId = isValidId(id) ? id : null;
  const wrap = document.createElement('div');
  wrap.className = 'paste-fallback';

  const heading = document.createElement('h2');
  heading.textContent = validId
    ? `Couldn't load character ${validId} from Pathbuilder`
    : "Couldn't load this character";
  wrap.appendChild(heading);

  const linkHref = validId
    ? `https://pathbuilder2e.com/json.php?id=${validId}`
    : 'https://pathbuilder2e.com';
  const p = document.createElement('p');
  p.append(
    'This usually means CORS blocked the browser request, or the ID is wrong. Open ',
  );
  const link = document.createElement('a');
  link.href = linkHref;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'the Pathbuilder JSON URL';
  p.append(link, ' in a new tab, copy the whole response, and paste it below.');
  wrap.appendChild(p);

  const ta = document.createElement('textarea');
  ta.rows = 12;
  ta.placeholder = 'Paste Pathbuilder JSON here...';
  wrap.appendChild(ta);

  const btn = document.createElement('button');
  btn.textContent = 'Render sheet';
  wrap.appendChild(btn);

  btn.addEventListener('click', () => {
    try {
      const json = JSON.parse(ta.value);
      if (validId) localStorage.setItem(STORAGE_KEY(validId), JSON.stringify(json));
      onLoaded(json);
    } catch (e) {
      alert("That doesn't look like valid JSON: " + e.message);
    }
  });
  return wrap;
}
