// Single source of truth for ingredient normalization, aliases and translations.

export const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss");

/**
 * Bidirectional alias map — keys are English canonical names,
 * values include German translations, plural forms and common variants.
 * `expandIngredients` treats keys and values symmetrically so direction
 * does not matter for matching.
 */
export const aliasMap: Record<string, string[]> = {
  egg: ["ei", "eier", "eggs"],
  pasta: ["nudeln", "spaghetti", "penne", "ravioli", "agnolotti"],
  rice: ["reis"],
  bread: ["brot", "toast", "ciabatta"],
  wraps: ["wrap", "tortilla", "tortillas"],
  tomato: ["tomate", "tomaten", "tomatoes", "cherrytomaten"],
  onion: ["zwiebel", "zwiebeln", "onions"],
  lemon: ["zitrone", "zitronen", "lemons"],
  garlic: ["knoblauch"],
  spinach: ["spinat"],
  cucumber: ["gurke", "gurken"],
  basil: ["basilikum"],
  vinegar: ["essig"],
  yogurt: ["joghurt", "griechischer joghurt", "greek yogurt"],
  chickpeas: ["kichererbsen"],
  feta: ["feta"],
  ricotta: ["ricotta"],
  parmesan: ["parmesan"],
  cheese: ["kaese", "käse"],
  chicken: ["huhn", "haehnchen", "hähnchen"],
  tofu: ["tofu"],
  zucchini: ["zucchini"],
  gochujang: ["gochujang"],
  cumin: ["kreuzkuemmel", "kreuzkümmel"],
  "olive oil": ["olivenoel", "olivenöl"],
  "sesame oil": ["sesamoel", "sesamöl"],
  "soy sauce": ["sojasauce"],
  "spring onion": [
    "fruehlingszwiebel",
    "frühlingszwiebel",
    "fruehlingszwiebeln",
    "frühlingszwiebeln",
    "spring onions"
  ],
  pepper: ["pfeffer"],
  breadcrumbs: ["paniermehl", "brotkruemel", "brösel", "bread crumbs"]
};

/** English-to-German display labels used on the recipe detail page and online recipes. */
export const ingredientTranslations: Record<string, string> = {
  pasta: "Nudeln",
  spaghetti: "Spaghetti",
  penne: "Penne",
  ravioli: "Ravioli",
  agnolotti: "Agnolotti",
  rice: "Reis",
  bread: "Brot",
  wraps: "Wraps",
  wrap: "Wrap",
  tortilla: "Tortilla",
  tortillas: "Tortillas",
  egg: "Ei",
  eggs: "Eier",
  onion: "Zwiebel",
  onions: "Zwiebeln",
  "spring onion": "Frühlingszwiebel",
  "spring onions": "Frühlingszwiebeln",
  garlic: "Knoblauch",
  tomato: "Tomate",
  tomatoes: "Tomaten",
  cucumber: "Gurke",
  lemon: "Zitrone",
  lemons: "Zitronen",
  yogurt: "Joghurt",
  "greek yogurt": "Griechischer Joghurt",
  "olive oil": "Olivenöl",
  "sesame oil": "Sesamöl",
  "soy sauce": "Sojasauce",
  vinegar: "Essig",
  basil: "Basilikum",
  chickpeas: "Kichererbsen",
  spinach: "Spinat",
  cheese: "Käse",
  feta: "Feta",
  parmesan: "Parmesan",
  ricotta: "Ricotta",
  zucchini: "Zucchini",
  gochujang: "Gochujang",
  cumin: "Kreuzkümmel",
  chicken: "Huhn",
  tofu: "Tofu",
  breadcrumbs: "Paniermehl",
  "bread crumbs": "Paniermehl",
  pepper: "Pfeffer"
};

/**
 * Reverse index from every known spelling to its canonical English key.
 * Built once so matching works regardless of whether a recipe names an
 * ingredient in English ("tomato"), German ("Tomaten") or a variant.
 */
const canonicalByVariant: Record<string, string> = (() => {
  const index: Record<string, string> = {};

  for (const [key, aliases] of Object.entries(aliasMap)) {
    index[normalize(key)] = key;
    for (const alias of aliases) {
      index[normalize(alias)] = key;
    }
  }

  return index;
})();

/** Map any known spelling of an ingredient to its canonical form. */
export function canonicalize(name: string) {
  const normalized = normalize(name);
  return canonicalByVariant[normalized] ?? normalized;
}

/** Expand a list of user-entered ingredients into a Set of all normalized variants. */
export function expandIngredients(items: string[]) {
  const expanded = new Set<string>();

  for (const item of items) {
    const normalized = normalize(item);
    expanded.add(normalized);

    const canonical = canonicalByVariant[normalized];
    if (!canonical) continue;

    expanded.add(normalize(canonical));
    for (const alias of aliasMap[canonical] ?? []) {
      expanded.add(normalize(alias));
    }
  }

  return expanded;
}

/**
 * Check whether a recipe ingredient is covered by the user's available set.
 * Compares canonical forms, so "Eier" at home satisfies a recipe asking for "egg".
 */
export function hasIngredient(available: Set<string>, ingredientName: string) {
  const normalized = normalize(ingredientName);
  if (available.has(normalized)) return true;

  const canonical = canonicalByVariant[normalized];
  if (!canonical) return false;

  if (available.has(normalize(canonical))) return true;

  return (aliasMap[canonical] ?? []).some((alias) => available.has(normalize(alias)));
}

/** Translate an English ingredient name to German, with word-by-word fallback. */
export function translateIngredientName(name: string) {
  const cleaned = name.trim();
  const normalized = normalize(cleaned);

  if (ingredientTranslations[normalized]) {
    return ingredientTranslations[normalized];
  }

  // Try the original casing in the map (handles already-German names)
  if (ingredientTranslations[cleaned.toLowerCase()]) {
    return ingredientTranslations[cleaned.toLowerCase()];
  }

  // Word-by-word fallback
  return cleaned
    .split(" ")
    .map((part) => {
      const translated = ingredientTranslations[normalize(part)];
      return translated ?? part;
    })
    .join(" ");
}
