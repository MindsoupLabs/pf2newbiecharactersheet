# Pathfinder 2e — New Player Character Sheet

A static webpage that loads a Pathbuilder 2e character by ID and renders a
new-player-friendly sheet for one-shot adventures. Works on widescreen, mobile,
and printed A4.

## Usage

1. Build your character in [Pathbuilder 2e](https://pathbuilder2e.com).
2. Export → JSON. Note the ID in the export URL.
3. Visit `https://your-host/?id=YOUR_ID`.
4. If your browser can't fetch Pathbuilder directly (CORS), the page shows a
   "paste JSON here" textarea — open the JSON URL yourself and paste the result.

## Editing during play

Click the Current HP, Temp HP, or hero point pips to edit them. Changes persist
in your browser's localStorage, keyed by the Pathbuilder ID. To start fresh,
clear your browser's site data for this page.

## Local development

```sh
python3 -m http.server     # or any other static server
open http://localhost:8000
```

Run unit tests:
```sh
npm test
```

## Adding new feats / weapons

Bundled rules data lives in `data/{feats,features,weapons}.json`. To support a
character whose feats aren't yet in `feats.json`, add an entry:
```json
"Feat Name": {
  "actionCost": "1" | "2" | "3" | "reaction" | "free" | null,
  "type": "Class Feat" | "Skill Feat" | "Ancestry Feat" | "General Feat" | "Class Feature",
  "description": "Short rules-paraphrased description.",
  "isPassive": false
}
```

Set `isPassive: true` for permanent stat boosts that don't need to appear in the
abilities panel.

## Licensing

The Pathfinder 2e game system is © Paizo Inc.; rules text is published under the
[Open Game License](https://paizo.com/community/communityuse). Rules text bundled
in `data/` is paraphrased for in-play reference only — verify against the rulebook
or [Archives of Nethys](https://2e.aonprd.com/) before use at the table.

This sheet's source code is MIT-licensed.
